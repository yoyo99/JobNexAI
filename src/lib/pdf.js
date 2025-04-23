var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// Initialize pdfMake with fonts
if (pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
}
else {
    pdfMake.vfs = pdfFonts;
}
pdfMake.fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};
export function generateApplicationPDF(application_1) {
    return __awaiter(this, arguments, void 0, function* (application, options = {}) {
        const { includeNotes = true, includeTimeline = true } = options;
        const docDefinition = {
            content: [
                {
                    text: 'Détails de la candidature',
                    style: 'header',
                },
                {
                    text: [
                        { text: 'Poste : ', bold: true },
                        application.job.title,
                    ],
                    margin: [0, 10, 0, 5],
                },
                {
                    text: [
                        { text: 'Entreprise : ', bold: true },
                        application.job.company,
                    ],
                    margin: [0, 0, 0, 5],
                },
                {
                    text: [
                        { text: 'Localisation : ', bold: true },
                        application.job.location,
                    ],
                    margin: [0, 0, 0, 5],
                },
                {
                    text: [
                        { text: 'Statut : ', bold: true },
                        application.status,
                    ],
                    margin: [0, 0, 0, 5],
                },
                {
                    text: [
                        { text: 'Date de candidature : ', bold: true },
                        format(new Date(application.created_at), 'dd MMMM yyyy', { locale: fr }),
                    ],
                    margin: [0, 0, 0, 20],
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5],
                },
            },
            defaultStyle: {
                font: 'Helvetica',
            },
        };
        if (includeNotes && application.notes) {
            docDefinition.content.push({ text: 'Notes', style: 'subheader' }, { text: application.notes, margin: [0, 0, 0, 20] });
        }
        if (includeTimeline && application.timeline) {
            docDefinition.content.push({ text: 'Historique', style: 'subheader' }, {
                // Historique sous forme de liste à puces
                text: application.timeline.map(event => `• ${format(new Date(event.date), 'dd/MM/yyyy', { locale: fr })} - ${event.description}`).join('\n'),
                margin: [0, 0, 0, 20],
            });
        }
        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = pdfMake.createPdf(docDefinition);
                pdfDoc.getBlob((blob) => {
                    resolve(blob);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
export function downloadApplicationPDF(application, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const blob = yield generateApplicationPDF(application, options);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `candidature-${application.job.company}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}
