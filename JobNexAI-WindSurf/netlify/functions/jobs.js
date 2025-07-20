const { createClient } = require('@supabase/supabase-js');
const { db } = require('../../lib/db');
const { jobs, applications } = require('../../lib/schemas/jobs');
const { users } = require('../../lib/schemas/users');
const { eq, desc, and, like, or } = require('drizzle-orm');

// Créer un client Supabase avec les variables d'environnement
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware pour vérifier l'authentification
const requireAuth = async (event) => {
  const token = event.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return { authed: false, error: 'Token d\'authentification manquant' };
  }

  // Vérifier la session avec Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { authed: false, error: 'Session invalide ou expirée' };
  }

  return { authed: true, user };
};

exports.handler = async (event, context) => {
  // Vérifier la méthode HTTP
  const httpMethod = event.httpMethod;
  const path = event.path.split('/').filter(Boolean);
  const endpoint = path[path.length - 1];
  const jobId = path[path.length - 2] === 'jobs' ? endpoint : null;
  
  // Paramètres de requête pour les GET
  const queryParams = event.queryStringParameters || {};
  
  // Traitement selon la méthode HTTP
  try {
    // Routes qui ne nécessitent pas d'authentification
    
    // GET /jobs (liste des offres publiques)
    if (httpMethod === 'GET' && endpoint === 'jobs') {
      // Pagination
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 20;
      const offset = (page - 1) * limit;
      
      // Filtrage
      const search = queryParams.search || '';
      const location = queryParams.location || '';
      const contractType = queryParams.contractType || '';
      const remote = queryParams.remote === 'true';
      
      // Construction de la requête
      let query = db.select()
        .from(jobs)
        .where(eq(jobs.status, 'active'));
      
      // Appliquer les filtres si fournis
      if (search) {
        query = query.where(or(
          like(jobs.title, `%${search}%`),
          like(jobs.company, `%${search}%`),
          like(jobs.description, `%${search}%`)
        ));
      }
      
      if (location) {
        query = query.where(like(jobs.location, `%${location}%`));
      }
      
      if (contractType) {
        query = query.where(eq(jobs.contractType, contractType));
      }
      
      if (remote) {
        query = query.where(eq(jobs.remote, true));
      }
      
      // Finaliser la requête avec l'ordre et la pagination
      query = query
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Exécuter la requête
      const jobsList = await query;
      
      // Compter le total pour la pagination
      const countQuery = await db.select({ count: count() })
        .from(jobs)
        .where(eq(jobs.status, 'active'));
      
      const total = countQuery[0].count;
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          jobs: jobsList,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
          }
        })
      };
    }
    
    // GET /jobs/:id (détails d'une offre)
    if (httpMethod === 'GET' && jobId) {
      // Incrémenter le compteur de vues
      await db.update(jobs)
        .set({ views: sql`${jobs.views} + 1` })
        .where(eq(jobs.id, jobId));
      
      // Récupérer les détails complets
      const jobDetails = await db.select({
        ...jobs,
        postedBy: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          avatarUrl: users.avatarUrl
        }
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.postedById, users.id))
      .where(eq(jobs.id, jobId))
      .limit(1);
      
      if (!jobDetails.length) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Offre d\'emploi non trouvée' })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(jobDetails[0])
      };
    }
    
    // Routes qui nécessitent une authentification
    const auth = await requireAuth(event);
    if (!auth.authed) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: auth.error })
      };
    }
    
    // POST /jobs (créer une nouvelle offre)
    if (httpMethod === 'POST' && endpoint === 'jobs') {
      const jobData = JSON.parse(event.body);
      
      // Validation de base
      if (!jobData.title || !jobData.company || !jobData.description) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Champs obligatoires manquants' })
        };
      }
      
      // Ajout de l'ID de l'utilisateur
      jobData.postedById = auth.user.id;
      
      // Insertion dans la base de données
      const newJob = await db.insert(jobs)
        .values(jobData)
        .returning();
      
      return {
        statusCode: 201,
        body: JSON.stringify(newJob[0])
      };
    }
    
    // PUT /jobs/:id (mettre à jour une offre)
    if (httpMethod === 'PUT' && jobId) {
      const jobData = JSON.parse(event.body);
      
      // Vérifier que l'utilisateur est propriétaire
      const jobCheck = await db.select()
        .from(jobs)
        .where(and(
          eq(jobs.id, jobId),
          eq(jobs.postedById, auth.user.id)
        ))
        .limit(1);
      
      if (!jobCheck.length) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Vous n\'êtes pas autorisé à modifier cette offre' })
        };
      }
      
      // Mise à jour
      const updatedJob = await db.update(jobs)
        .set({
          ...jobData,
          updatedAt: new Date()
        })
        .where(eq(jobs.id, jobId))
        .returning();
      
      return {
        statusCode: 200,
        body: JSON.stringify(updatedJob[0])
      };
    }
    
    // DELETE /jobs/:id (supprimer une offre)
    if (httpMethod === 'DELETE' && jobId) {
      // Vérifier que l'utilisateur est propriétaire
      const jobCheck = await db.select()
        .from(jobs)
        .where(and(
          eq(jobs.id, jobId),
          eq(jobs.postedById, auth.user.id)
        ))
        .limit(1);
      
      if (!jobCheck.length) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Vous n\'êtes pas autorisé à supprimer cette offre' })
        };
      }
      
      // Suppression
      await db.delete(jobs)
        .where(eq(jobs.id, jobId));
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Offre supprimée avec succès' })
      };
    }
    
    // POST /jobs/:id/apply (postuler à une offre)
    if (httpMethod === 'POST' && endpoint === 'apply') {
      const applicationData = JSON.parse(event.body);
      const targetJobId = path[path.length - 2];
      
      // Vérifier que l'offre existe
      const jobCheck = await db.select()
        .from(jobs)
        .where(eq(jobs.id, targetJobId))
        .limit(1);
      
      if (!jobCheck.length) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Offre d\'emploi non trouvée' })
        };
      }
      
      // Vérifier que l'utilisateur n'a pas déjà postulé
      const existingApplication = await db.select()
        .from(applications)
        .where(and(
          eq(applications.jobId, targetJobId),
          eq(applications.userId, auth.user.id)
        ))
        .limit(1);
      
      if (existingApplication.length) {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'Vous avez déjà postulé à cette offre' })
        };
      }
      
      // Créer la candidature
      const newApplication = await db.insert(applications)
        .values({
          jobId: targetJobId,
          userId: auth.user.id,
          coverLetter: applicationData.coverLetter,
          resumeUrl: applicationData.resumeUrl,
          metadata: applicationData.metadata || {}
        })
        .returning();
      
      // Incrémenter le compteur de candidatures
      await db.update(jobs)
        .set({ applicationsCount: sql`${jobs.applicationsCount} + 1` })
        .where(eq(jobs.id, targetJobId));
      
      return {
        statusCode: 201,
        body: JSON.stringify(newApplication[0])
      };
    }
    
    // GET /jobs/my-listings (offres publiées par l'utilisateur)
    if (httpMethod === 'GET' && endpoint === 'my-listings') {
      const myJobs = await db.select()
        .from(jobs)
        .where(eq(jobs.postedById, auth.user.id))
        .orderBy(desc(jobs.createdAt));
      
      return {
        statusCode: 200,
        body: JSON.stringify(myJobs)
      };
    }
    
    // GET /jobs/my-applications (candidatures de l'utilisateur)
    if (httpMethod === 'GET' && endpoint === 'my-applications') {
      const myApplications = await db.select({
        application: applications,
        job: jobs
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(applications.userId, auth.user.id))
      .orderBy(desc(applications.createdAt));
      
      return {
        statusCode: 200,
        body: JSON.stringify(myApplications)
      };
    }
    
    // Route non prise en charge
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Route non trouvée' })
    };
    
  } catch (error) {
    console.error('Erreur de traitement:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur', details: error.message })
    };
  }
};
