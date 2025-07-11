const { createClient } = require('@supabase/supabase-js');
const { db } = require('../../lib/db');
const { users, profiles } = require('../../lib/schemas/users');
const { eq } = require('drizzle-orm');

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
  
  // Vérifier l'authentification
  const auth = await requireAuth(event);
  if (!auth.authed) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: auth.error })
    };
  }

  // Traiter selon la méthode HTTP et le chemin
  try {
    // GET /users/profile
    if (httpMethod === 'GET' && endpoint === 'profile') {
      // Récupérer le profil complet de l'utilisateur avec les deux tables
      const userData = await db.select()
        .from(users)
        .where(eq(users.id, auth.user.id))
        .limit(1);

      if (!userData.length) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Utilisateur non trouvé' })
        };
      }

      // Récupérer le profil associé
      const profileData = await db.select()
        .from(profiles)
        .where(eq(profiles.userId, auth.user.id))
        .limit(1);

      // Combiner les données
      const fullProfile = {
        ...userData[0],
        profile: profileData.length ? profileData[0] : null
      };

      return {
        statusCode: 200,
        body: JSON.stringify(fullProfile)
      };
    }
    
    // PUT /users/profile
    if (httpMethod === 'PUT' && endpoint === 'profile') {
      const updateData = JSON.parse(event.body);
      
      // Séparer les données pour les deux tables
      const { firstName, lastName, email, isActive, role, preferences } = updateData;
      const { title, bio, location, website, skills, experience, education, languages } = updateData.profile || {};

      // Mettre à jour les données utilisateur de base
      await db.update(users)
        .set({
          firstName,
          lastName,
          email,
          isActive,
          role,
          preferences,
          updatedAt: new Date()
        })
        .where(eq(users.id, auth.user.id));

      // Mettre à jour ou créer le profil
      const existingProfile = await db.select()
        .from(profiles)
        .where(eq(profiles.userId, auth.user.id))
        .limit(1);

      if (existingProfile.length) {
        await db.update(profiles)
          .set({
            title,
            bio,
            location,
            website,
            skills,
            experience,
            education,
            languages,
            updatedAt: new Date()
          })
          .where(eq(profiles.userId, auth.user.id));
      } else {
        await db.insert(profiles)
          .values({
            userId: auth.user.id,
            title,
            bio,
            location,
            website,
            skills,
            experience,
            education,
            languages
          });
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Profil mis à jour avec succès' })
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
