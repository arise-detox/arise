/* ARISE : textes juridiques (modèles).
   Ces textes sont un point de départ rédigé pour le fonctionnement actuel de l'appli. Ils ne remplacent pas un avis
   juridique : fais-les relire par un juriste ou l'organisme qui t'accompagne avant d'ouvrir les inscriptions, et
   mets-les à jour si l'appli change (nouveaux services, nouveaux prestataires, appli payante...).
   Les marques {{name}}, {{email}}... sont remplacées par les valeurs de config.js. */
window.ARISE_LEGAL = {
  cgu: {
    title: 'Conditions générales d’utilisation',
    sections: [
      { h: '1. Objet', p: [
        'ARISE est une application web qui propose des moments sans écran, des défis de détox numérique, des idées de sorties gratuites et, pour les personnes qui ont un compte, des groupes pour organiser des sorties ensemble.',
        'Les présentes conditions encadrent l’utilisation d’ARISE, éditée par {{name}} ({{status}}), {{address}}. Contact : {{email}}.'] },
      { h: '2. Accès et compte', p: [
        'ARISE peut être utilisée sans compte : le suivi reste alors sur ton appareil. Un compte, créé avec une adresse e-mail, est nécessaire pour rejoindre ou créer un groupe.',
        'Tu dois avoir 18 ans révolus pour créer un compte. Tu t’engages à fournir une adresse e-mail valide, à garder ton mot de passe confidentiel et à ne pas partager ton compte.',
        'Tu peux supprimer ton compte à tout moment depuis ton profil.'] },
      { h: '3. Règles de conduite', p: [
        'Tu t’engages à rester respectueux·se, à ne pas harceler, discriminer, menacer ni usurper l’identité de quelqu’un, à ne pas publier de contenu illicite, haineux, violent ou à caractère sexuel, et à ne pas utiliser les groupes pour de la publicité, de la vente ou du démarchage.',
        'Les contenus que tu publies (nom de groupe, description, sorties) restent sous ta responsabilité.'] },
      { h: '4. Groupes et sorties : ce qu’ARISE fait, et ne fait pas', p: [
        'ARISE met en relation des personnes. Les sorties sont organisées par les membres, pas par l’éditeur : {{name}} n’organise pas les sorties, n’y assiste pas et ne peut pas vérifier l’identité ni les intentions des participants.',
        'Avant de te rendre à une sortie : choisis un lieu public et fréquenté, préviens un proche de l’endroit et de l’heure, ne communique pas ton adresse personnelle, et quitte la sortie si tu ne te sens pas à l’aise. Tu participes sous ta propre responsabilité et selon tes capacités physiques.',
        'Tu peux signaler un groupe, une sortie ou un membre depuis l’appli. L’éditeur peut masquer un contenu, retirer un membre ou suspendre un compte qui ne respecte pas ces conditions, avec ou sans préavis en cas de situation grave.'] },
      { h: '5. Santé et bien-être', p: [
        'ARISE propose des idées d’activités et des informations tirées de la recherche à titre indicatif. Ce n’est ni un avis médical ni un traitement. Si tes écrans te pèsent beaucoup ou si tu te sens mal, parles-en à un·e professionnel·le de santé.'] },
      { h: '6. Disponibilité', p: [
        'ARISE est fournie « en l’état », sans garantie de disponibilité continue. L’éditeur peut modifier, suspendre ou arrêter tout ou partie du service, par exemple pour maintenance ou évolution.'] },
      { h: '7. Responsabilité', p: [
        'Dans les limites permises par la loi, l’éditeur n’est pas responsable des dommages résultant de la rencontre entre membres, des sorties organisées par les membres, ou du contenu publié par les utilisateurs. Cela ne limite pas les droits dont tu disposes en tant que consommateur ni la responsabilité de l’éditeur en cas de faute lourde ou intentionnelle.'] },
      { h: '8. Propriété intellectuelle', p: [
        'Le nom ARISE, le logo, les textes, les illustrations et le code de l’application appartiennent à leur auteur ou à leurs titulaires de droits. Tu ne les copies pas sans autorisation. Tu gardes tes droits sur les contenus que tu publies et tu accordes à l’éditeur le droit de les afficher dans l’appli, pour le fonctionnement du service.'] },
      { h: '9. Données personnelles', p: [
        'Le traitement de tes données personnelles est décrit dans la politique de confidentialité, qui fait partie de ces conditions.'] },
      { h: '10. Modification des conditions', p: [
        'Ces conditions peuvent évoluer. En cas de changement important, tu seras invité·e à les accepter de nouveau. La version en vigueur est celle indiquée dans l’appli.'] },
      { h: '11. Droit applicable et litiges', p: [
        'Ces conditions sont régies par le droit français. En cas de litige, tu peux d’abord écrire à {{email}}. Si tu es consommateur, tu peux aussi recourir gratuitement à un médiateur de la consommation : {{mediator}}. Tu peux aussi utiliser la plateforme européenne de règlement en ligne des litiges (ec.europa.eu/consumers/odr).'] }
    ]
  },

  privacy: {
    title: 'Politique de confidentialité (RGPD)',
    sections: [
      { h: '1. Qui est responsable de tes données ?', p: [
        'Le responsable du traitement est {{name}} ({{status}}), {{address}}. Contact pour toute question ou demande sur tes données : {{email}}. {{dpo}}'] },
      { h: '2. Ce qui reste sur ton appareil', p: [
        'Sans compte, tout ton suivi (moments, défis, réglages, prénom, avatar, photo) est enregistré dans le stockage de ton navigateur. Il n’est pas envoyé à l’éditeur. Ce stockage est strictement nécessaire au fonctionnement de l’appli : ARISE n’utilise aucun cookie publicitaire ni outil de mesure d’audience.'] },
      { h: '3. Les données collectées quand tu crées un compte', p: [
        'Adresse e-mail ; mot de passe (conservé uniquement sous forme chiffrée irréversible) ; pseudo et avatar ; photo de profil, facultative (recadrée et réduite sur ton appareil, sans ses métadonnées, tu peux la retirer à tout moment) ; date et version des conditions acceptées, confirmation de ta majorité, choix pour les e-mails d’information ; groupes que tu crées ou rejoins, sorties auxquelles tu t’inscris ; signalements que tu envoies ; données techniques de sécurité (adresse IP, date de connexion) conservées par le prestataire d’authentification.',
        'Ton adresse e-mail n’est jamais visible des autres membres. Ton pseudo, ton avatar et ta photo (si tu en ajoutes une) sont visibles des autres membres connectés. Une photo de visage est une donnée personnelle : n’ajoute que ta propre photo, ou choisis un avatar. Les membres d’un groupe voient aussi qui en fait partie et qui participe aux sorties.'] },
      { h: '4. Pourquoi, et sur quelle base légale ?', p: [
        'Créer et gérer ton compte, faire fonctionner les groupes et les sorties : exécution du service que tu demandes (article 6.1.b du RGPD).',
        'Sécurité, prévention des abus, modération et traitement des signalements : intérêt légitime de l’éditeur et des membres (article 6.1.f).',
        'Conserver la preuve de ton acceptation des conditions : intérêt légitime et obligation de pouvoir justifier tes consentements.',
        'Envoi d’e-mails d’information ou de nouveautés : uniquement si tu l’as demandé, avec ton consentement (article 6.1.a). La case est décochée par défaut et tu peux retirer ton accord à tout moment depuis ton profil, sans que cela affecte le reste du service.'] },
      { h: '5. Combien de temps ?', p: [
        'Tant que ton compte existe. À sa suppression, tes données de compte, ton appartenance aux groupes et tes inscriptions aux sorties sont effacées ; les groupes que tu as créés sont supprimés. Les signalements peuvent être conservés au plus 12 mois pour la sécurité des membres. Les sauvegardes techniques sont purgées dans un délai maximal de 90 jours. Un compte inactif depuis plus de 24 mois peut être supprimé après un e-mail d’information.'] },
      { h: '6. Qui reçoit tes données ?', p: [
        'Seulement les prestataires techniques nécessaires, qui agissent pour le compte de l’éditeur : l’hébergeur de la base de données et de l’authentification (Supabase), région : {{dbRegion}} ; l’hébergeur du site : {{host}} ; Google Fonts (polices) et jsDelivr (bibliothèque technique), qui reçoivent ton adresse IP lorsque tu charges la page. Aucune donnée n’est vendue ni utilisée pour de la publicité.',
        'Certains prestataires peuvent être situés hors de l’Union européenne. Dans ce cas, le transfert s’appuie sur des garanties appropriées (décision d’adéquation ou clauses contractuelles types).'] },
      { h: '7. Tes droits', p: [
        'Tu peux demander l’accès à tes données, leur rectification, leur effacement, la limitation ou l’opposition à leur traitement, leur portabilité, et définir des directives sur leur sort après ton décès.',
        'Dans l’appli, tu peux : modifier ton pseudo et ton avatar, télécharger toutes tes données (fichier JSON), retirer ton accord pour les e-mails d’information et supprimer ton compte. Pour toute autre demande, écris à {{email}} : réponse sous un mois.',
        'Si tu estimes que tes droits ne sont pas respectés, tu peux introduire une réclamation auprès de la CNIL (cnil.fr).'] },
      { h: '8. Sécurité', p: [
        'Les échanges sont chiffrés (HTTPS). Les mots de passe sont chiffrés de façon irréversible. L’accès aux données est limité par des règles strictes : chaque membre ne voit que ce qui le concerne. Aucun système n’est infaillible : en cas de violation de données présentant un risque pour toi, tu en seras informé·e et la CNIL sera notifiée dans les 72 heures lorsque la loi l’exige.'] },
      { h: '9. Mineurs', p: [
        'Le compte, les groupes et les sorties sont réservés aux personnes de 18 ans et plus. Si tu penses qu’une personne mineure a créé un compte, écris à {{email}} pour le faire supprimer.'] },
      { h: '10. Modifications', p: [
        'Cette politique peut évoluer. La version en vigueur est indiquée dans l’appli ; en cas de changement important, tu en seras informé·e.'] }
    ]
  },

  mentions: {
    title: 'Mentions légales',
    sections: [
      { h: 'Éditeur', p: ['{{name}} ({{status}}) — {{address}} — {{email}}. Directeur·rice de la publication : {{director}}.'] },
      { h: 'Hébergement', p: ['Site : {{host}}. Base de données et authentification : Supabase, région {{dbRegion}}.'] },
      { h: 'Contact', p: ['Pour toute question, demande RGPD ou signalement : {{email}}.'] }
    ]
  }
};
