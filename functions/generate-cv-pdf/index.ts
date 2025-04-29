import { createClient } from '@supabase/supabase-js';
import PdfPrinter from 'pdfmake';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

// --- Types & Enums ---

enum CVSectionType {
  HEADER = 'header',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
}

interface CVSection {
  type: CVSectionType;
  title: string;
  content: any;
}

interface CV {
  id: string;
  template_id: string;
  sections: CVSection[];
  language: string;
  template: { category: string };
}

interface TemplateStyle {
  [key: string]: any;
}

interface ResponseBody {
  pdf?: string;
  error?: string;
  message?: string;
}

// --- PDF Styles ---

const STANDARD_TEMPLATE_STYLE: TemplateStyle = {
  header: { fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
  subheader: { fontSize: 18, margin: [0, 0, 0, 5] },
  sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
  contact: { fontSize: 10, color: '#666666' },
};

const CREATIVE_TEMPLATE_STYLE: TemplateStyle = {
  header: { fontSize: 28, bold: true, color: '#2563eb', margin: [0, 0, 0, 10] },
  subheader: { fontSize: 20, color: '#4b5563', margin: [0, 0, 0, 5] },
  sectionHeader: { fontSize: 16, bold: true, color: '#2563eb', margin: [0, 20, 0, 10] },
  contact: { fontSize: 12, color: '#4b5563' },
};

const FREELANCE_TEMPLATE_STYLE: TemplateStyle = {
  header: { fontSize: 26, bold: true, color: '#059669', margin: [0, 0, 0, 10] },
  subheader: { fontSize: 19, color: '#374151', margin: [0, 0, 0, 5] },
  sectionHeader: { fontSize: 15, bold: true, color: '#059669', margin: [0, 20, 0, 10] },
  contact: { fontSize: 11, color: '#374151' },
};

// --- Helpers ---

function getTemplateStyle(category: string): { styles: TemplateStyle } {
  const styles: { [key: string]: TemplateStyle } = {
    standard: STANDARD_TEMPLATE_STYLE,
    creative: CREATIVE_TEMPLATE_STYLE,
    freelance: FREELANCE_TEMPLATE_STYLE,
  };
  if (category in styles) {
    return { styles: styles[category] };
  } else {
    return { styles: styles.standard };
  }
}

function getSectionContent(section: CVSection): any {
  switch (section.type) {
    case CVSectionType.EXPERIENCE:
      return section.content.items.map((item: any) => ({
        stack: [
          { columns: [ { text: item.title, bold: true }, { text: item.date, alignment: 'right' } ] },
          { columns: [ { text: item.company }, { text: item.location, alignment: 'right' } ], margin: [0, 2] },
          { text: item.description, margin: [0, 5] },
        ],
        margin: [0, 0, 0, 10],
      }));
    case CVSectionType.EDUCATION:
      return section.content.items.map((item: any) => ({
        stack: [
          { columns: [ { text: item.degree, bold: true }, { text: item.date, alignment: 'right' } ] },
          { columns: [ { text: item.school }, { text: item.location, alignment: 'right' } ], margin: [0, 2] },
        ],
        margin: [0, 0, 0, 10],
      }));
    case CVSectionType.SKILLS:
      return {
        columns: section.content.categories.map((category: any) => ({
          stack: [
            { text: category.name, bold: true, margin: [0, 0, 0, 5] },
            { ul: category.skills },
          ],
        })),
      };
    case CVSectionType.PROJECTS:
      return section.content.items.map((item: any) => ({
        stack: [
          { text: item.name, bold: true },
          { text: item.description, margin: [0, 2] },
          { text: (item.technologies || []).join(', '), italics: true, margin: [0, 2] },
        ],
        margin: [0, 0, 0, 10],
      }));
    default:
      return { text: JSON.stringify(section.content, null, 2) };
  }
}

// --- JWT & Supabase ---



const JWT_SECRET = process.env.JWT_SECRET!;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyJWT(req: any): string {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) throw new Error('Authorization header is missing');
  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Token is missing');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string };
    if (!payload || !payload.sub) throw new Error('Invalid token payload');
    return payload.sub;
  } catch {
    throw new Error('Invalid token');
  }
}

async function validateInput(data: any): Promise<string> {
  if (!data.cv_id) throw new Error('cv_id is required');
  if (typeof data.cv_id !== 'string') throw new Error('cv_id must be a string');
  return data.cv_id;
}

// --- Variables ---



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Handler ---

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  if (req.method === 'OPTIONS') {
    res.status(200).send('ok');
    return;
  }

  let status = 200;
  let response: ResponseBody = {};

  try {
    const userId = verifyJWT(req);
    const data = req.body;
    const cv_id = await validateInput(data);

    // Récupération du CV et du template
    const { data: cv, error: cvError } = await supabase
      .from('user_cvs')
      .select('*,template:cv_templates(*),sections:cv_sections(*)')
      .eq('id', cv_id)
      .single();

    if (cvError) {
      console.error('Supabase Error:', cvError);
      throw new Error('Error while fetching the CV');
    }
    if (!cv) {
      console.error('CV not found:', cv_id);
      throw new Error('CV not found');
    }

    // Style du template
    const templateStyle = getTemplateStyle(cv.template.category);

    // Construction du contenu du PDF dans un tableau local
    const content: any[] = [];

    // Header
    const headerSection = cv.sections.find((s: CVSection) => s.type === CVSectionType.HEADER);
    if (headerSection) {
      content.push({
        stack: [
          { text: headerSection.content.name, style: 'header' },
          { text: headerSection.content.title, style: 'subheader' },
          {
            columns: [
              { text: headerSection.content.email, style: 'contact' },
              { text: headerSection.content.phone, style: 'contact' },
              { text: headerSection.content.location, style: 'contact' },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      });
    }

    // Autres sections
    cv.sections.forEach((section: CVSection) => {
      if (section.type !== CVSectionType.HEADER) {
        const sectionContent = getSectionContent(section);
        if (Array.isArray(sectionContent)) {
          content.push(...sectionContent);
        } else {
          content.push(sectionContent);
        }
      }
    });

    // Définition du PDF
    const docDefinition: TDocumentDefinitions = {
      content,
      defaultStyle: { font: 'Helvetica' },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      info: { title: 'CV' },
      styles: templateStyle.styles,
    };


    // Génération du PDF
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      const pdfBase64 = result.toString('base64');
      response = { pdf: pdfBase64 };
      res.status(200).json(response);
    });
    pdfDoc.end();
    return;
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    response = { error: error.message };
    if (
      error.message === 'Authorization header is missing' ||
      error.message === 'Invalid token' ||
      error.message === 'Token is missing'
    ) {
      status = 401;
    } else {
      status = 400;
    }
    res.status(status).json(response);
    return;
  }
}