/* ARISE : configuration à compléter avant d'ouvrir les comptes et les groupes.
   Tant que les champs ci-dessous sont vides, ARISE fonctionne en mode local (profil sur l'appareil, pas de compte, pas de groupes).
   Le guide pas à pas est dans SUPABASE.txt. La clé « anon » est faite pour être publique : la sécurité repose sur
   les règles du fichier supabase/schema.sql (à exécuter une fois dans Supabase). Ne mets JAMAIS la clé « service_role » ici. */
window.ARISE_CONFIG = {
  supabaseUrl: '',        // exemple : 'https://abcdxyz.supabase.co'
  supabaseAnonKey: '',    // la clé publique « anon public » de ton projet

  /* Identité légale de l'éditeur : obligatoire pour ouvrir les inscriptions (mentions légales, RGPD).
     L'inscription reste fermée tant que name, email et address ne sont pas renseignés. */
  publisher: {
    name: '',             // nom et prénom, ou nom de l'association / de la société
    status: '',           // exemple : 'particulier', 'association loi 1901', 'SAS au capital de ...'
    address: '',          // adresse postale de l'éditeur
    email: '',            // adresse de contact (aussi utilisée pour les demandes RGPD)
    director: '',         // directeur de la publication (souvent le même nom)
    dpo: '',              // délégué à la protection des données, si tu en as un (sinon laisse vide)
    host: '',             // hébergeur du SITE (exemple : 'Netlify, Inc., 512 2nd Street, San Francisco, USA')
    dbRegion: '',         // région de ta base Supabase (exemple : 'Union européenne (Francfort)')
    mediator: ''          // médiateur de la consommation (obligatoire si l'appli devient payante)
  },

  /* À changer à chaque modification des textes dans legal.js : les nouveaux inscrits acceptent cette version. */
  legalVersion: '2026-10-03'
};
