/* ARISE : contenus de l'appli (textes des activités, défis détox, carte des sorties, mode hybride, cartes surprises).
   Tu peux modifier les textes ici sans toucher au code. Garde la structure (guillemets, virgules, accolades) et
   augmente VERSION au début de sw.js après chaque changement avant de mettre en ligne.
   D = activités et jours, CH = défis, MP = carte des sorties, HY = mode hybride, CARDS = cartes surprises. */
window.ARISE_CONTENT = {
  D: {
    "activities": {
      "outside": [
        {
          "title": "Regarder, vraiment.",
          "body": "Sors ou installe-toi près d’une fenêtre. Téléphone posé, remarque trois détails que tu n’avais jamais vus : une couleur, une forme, un mouvement.",
          "prompt": "Décris un de ces détails comme si tu voulais le faire découvrir à quelqu’un qui n’était pas là.",
          "tip": "Tu n’as pas besoin d’aller loin. Un endroit familier peut devenir une découverte."
        },
        {
          "title": "Écouter ce qui est là.",
          "body": "Dans un lieu où tu peux rester en sécurité, écoute les sons autour de toi. Repère un son proche, un son lointain et les silences entre les deux.",
          "prompt": "Décris le lieu en utilisant uniquement ce que tu as entendu.",
          "tip": "Essaie ce moment sans écouteurs, si cela te convient."
        },
        {
          "title": "Un lieu, un souvenir.",
          "body": "Observe un lieu ou un objet dehors. Laisse venir un souvenir ou une association d’idées, sans chercher à vérifier quoi que ce soit sur ton téléphone.",
          "prompt": "Commence par « Cet endroit me rappelle… » et poursuis avec tes propres mots.",
          "tip": "Le souvenir peut être minuscule. Il n’a pas besoin d’être extraordinaire."
        },
        {
          "title": "Changer de point de vue.",
          "body": "Choisis une petite promenade adaptée à tes possibilités, ou change simplement de place. Observe comment un même endroit semble différent depuis ce nouveau point de vue.",
          "prompt": "Qu’as-tu découvert en changeant de place ? Décris un avant et un après.",
          "tip": "Choisis un trajet connu et sûr. Adapte la distance à ton énergie."
        },
        {
          "title": "Ramener une idée.",
          "body": "Cherche dehors une couleur, une texture ou une forme qui t’inspire. Garde-la en mémoire pour en faire ensuite un dessin ou quelques lignes sur papier.",
          "prompt": "Dessine ton détail de mémoire, puis écris une phrase pour l’accompagner.",
          "tip": "Pas besoin de photo ni de modèle. Ton interprétation suffit."
        },
        {
          "title": "Un moment à deux.",
          "body": "Propose à une personne de marcher, de regarder dehors ou de discuter avec les téléphones rangés. Si tu préfères rester seul, observe un lieu où les gens se rencontrent.",
          "prompt": "Quelle phrase ou quel détail de ce moment aimerais-tu conserver ?",
          "tip": "Partager est une invitation. Tu peux choisir de rester seul."
        },
        {
          "title": "Ce que tu veux garder.",
          "body": "Reprends le moment dehors que tu as préféré dans ce parcours. Choisis un endroit et une durée qui te conviennent aujourd’hui.",
          "prompt": "Complète : « J’aimerais garder cette habitude parce que… »",
          "tip": "Une habitude tenable peut être toute petite. Choisis-la pour toi."
        }
      ],
      "creative": [
        {
          "title": "Dessiner sans modèle.",
          "body": "Choisis un objet près de toi. Observe-le, puis dessine-le sur papier sans ouvrir une image de référence. Accueille les imperfections.",
          "prompt": "Qu’as-tu remarqué en dessinant que tu n’avais pas vu au premier regard ?",
          "tip": "Un stylo et une feuille suffisent. Le résultat n’a pas à être joli."
        },
        {
          "title": "Un son, une histoire.",
          "body": "Écoute un son autour de toi. Sur papier, invente une scène très courte dans laquelle ce son apparaît. Laisse les idées venir sans rechercher d’inspiration en ligne.",
          "prompt": "Commence par « J’ai entendu… » et écris la suite.",
          "tip": "Trois phrases peuvent déjà raconter quelque chose."
        },
        {
          "title": "Une page à toi.",
          "body": "Prends une feuille. Écris ce qui te traverse l’esprit aujourd’hui, sans correction et sans chercher un sujet parfait. Tu peux aussi commencer par décrire ce qui t’entoure.",
          "prompt": "« En ce moment, je remarque… » Puis laisse ton écriture continuer.",
          "tip": "Tu peux t’arrêter après quelques lignes. Rien n’est noté ni évalué."
        },
        {
          "title": "Une pause entre les idées.",
          "body": "Pose ton matériel et change doucement de position, ou marche un peu si tu le peux. Puis reviens à ta feuille et observe si une autre idée est apparue.",
          "prompt": "Note une idée venue pendant cette pause, même incomplète.",
          "tip": "Le mouvement est une possibilité, pas une obligation."
        },
        {
          "title": "Trois façons d’imaginer.",
          "body": "Choisis un objet banal et imagine trois usages inattendus. Note-les ou dessine-les sur papier avant toute recherche et sans aide de l’IA.",
          "prompt": "Quelle idée te surprend le plus ? Développe-la en quelques lignes.",
          "tip": "Autorise-toi les idées étranges : c’est un exercice, pas un concours."
        },
        {
          "title": "Créer pour quelqu’un.",
          "body": "Écris quelques mots ou fais un petit dessin destiné à quelqu’un. Tu peux lui offrir en personne, ou le garder pour toi.",
          "prompt": "Quel détail personnel as-tu choisi pour cette personne ?",
          "tip": "Tu n’as aucune obligation de publier ou d’envoyer ta création."
        },
        {
          "title": "Garder ton élan.",
          "body": "Reprends une activité créative appréciée dans ce parcours. Installe ton matériel, pose le téléphone et choisis une petite réalisation possible aujourd’hui.",
          "prompt": "Quelle place aimerais-tu donner à cette activité dans ta semaine ?",
          "tip": "Laisse une feuille et un crayon accessibles pour la prochaine fois."
        }
      ],
      "movement": [
        {
          "title": "Changer de position.",
          "body": "Quitte quelques instants ta position habituelle. Installe-toi autrement ou lève-toi si cela te convient. Repère ce qui paraît confortable, sans chercher une posture parfaite.",
          "prompt": "Qu’est-ce qui a changé dans ton ressenti après cette pause ?",
          "tip": "Bouge dans une amplitude confortable. Une douleur est un signal pour arrêter."
        },
        {
          "title": "Une promenade attentive.",
          "body": "Marche à ton rythme si tu le peux, dans un endroit sûr. Tu peux aussi faire une pause assise dans un autre lieu. Écoute les sons sans regarder ton téléphone.",
          "prompt": "Décris un son qui t’a accompagné pendant ce moment.",
          "tip": "Adapte la proposition à tes possibilités, même sans sortir."
        },
        {
          "title": "Du corps aux mots.",
          "body": "Après une courte pause ou un changement de position, prends une feuille. Décris ton énergie et ton confort avec des mots simples, sans chercher de diagnostic.",
          "prompt": "« Aujourd’hui, je me sens… » Écris ce qui te semble juste.",
          "tip": "Ton ressenti n’a pas à être positif. Il peut simplement être différent."
        },
        {
          "title": "Une mobilité toute douce.",
          "body": "Assieds-toi de façon confortable, pieds soutenus. Si cela ne provoque aucune douleur, tourne lentement la tête d’un côté puis de l’autre, dans une petite amplitude. Reviens au centre. Tu peux préférer marcher ou changer de position.",
          "prompt": "Quel mouvement ou quelle position t’a semblé le plus confortable ?",
          "tip": "Exercice inspiré du NHS : sans forcer, sans douleur. En cas de douleur persistante, demande un avis professionnel."
        },
        {
          "title": "Dessiner le mouvement.",
          "body": "Après un mouvement confortable ou une petite marche, dessine sur papier les lignes qui évoquent ton ressenti. Tu peux aussi rester assis et dessiner le mouvement observé dehors.",
          "prompt": "Ajoute trois mots à ton dessin pour décrire ton expérience.",
          "tip": "Quelques traits suffisent. Tu n’as rien à prouver."
        },
        {
          "title": "Une pause ensemble.",
          "body": "Invite quelqu’un à faire une pause sans téléphone : marcher, changer d’air ou discuter. Si tu préfères, garde ce moment pour toi.",
          "prompt": "Qu’as-tu apprécié ou moins apprécié pendant ce moment ?",
          "tip": "Chacun adapte l’activité à son énergie et à ses possibilités."
        },
        {
          "title": "Ta pause, à ta façon.",
          "body": "Reprends la pause ou le mouvement qui t’a convenu. Choisis un moment réaliste pour le refaire dans les prochains jours.",
          "prompt": "Quel petit changement pourrait rendre tes journées plus confortables ?",
          "tip": "Varier les positions et ajuster son poste peut aider au confort. Aucune posture n’est à maintenir toute la journée."
        }
      ]
    },
    "days": [
      "Observer",
      "Écouter",
      "Écrire",
      "Bouger",
      "Créer",
      "Partager",
      "Choisir"
    ],
    "themes": [
      {
        "id": "outside",
        "label": "Prendre l’air",
        "description": "Observer, écouter, découvrir"
      },
      {
        "id": "creative",
        "label": "Créer quelque chose",
        "description": "Écrire, dessiner, imaginer"
      },
      {
        "id": "movement",
        "label": "Me remettre en mouvement",
        "description": "Marcher, varier mes positions"
      }
    ]
  },
  CH: {
    "habits": [
      {
        "id": "social",
        "label": "Réseaux sociaux"
      },
      {
        "id": "video",
        "label": "Vidéos courtes en boucle"
      },
      {
        "id": "news",
        "label": "Actualités en continu"
      },
      {
        "id": "games",
        "label": "Jeux sur mobile"
      },
      {
        "id": "stream",
        "label": "Séries et streaming en boucle"
      },
      {
        "id": "bed",
        "label": "Téléphone au lit"
      },
      {
        "id": "notifs",
        "label": "Notifications non essentielles"
      }
    ],
    "evidence": {
      "etabli": "Bien établi",
      "observe": "Observé dans des études",
      "hypothese": "Hypothèse plausible"
    },
    "challenges": [
      {
        "id": "soiree",
        "title": "Soirée sans écran",
        "tagline": "Un soir pour souffler, sans engagement.",
        "duration": "Environ 3 heures",
        "level": "Facile",
        "tone": "lilac",
        "icon": "moon",
        "intro": "Le meilleur point de départ : ce soir, les écrans de loisir restent de côté et tu observes ce que ça change.",
        "prep": [
          "Choisis l’heure de départ et un endroit où ranger ton téléphone, hors de vue.",
          "Prépare une activité papier : un livre, un carnet, un jeu de cartes.",
          "Prévois une exception pour les vraies urgences (un appel reste possible)."
        ],
        "defaultHabits": [
          "social",
          "video",
          "stream",
          "bed"
        ],
        "paliers": [
          {
            "at": 0,
            "when": "Tout de suite",
            "title": "Je range le téléphone",
            "do": "Mets-le dans une autre pièce ou un tiroir. Dis-toi à voix haute : « ce soir, il reste là ».",
            "brain": "À force de répétitions, ton cerveau a appris que sortir le téléphone apporte une petite récompense rapide, et la main part toute seule. Décider à l’avance (« ce soir, il reste là ») fonctionne mieux que de se retenir à chaque fois.",
            "evidence": "etabli",
            "source": "Les plans « si… alors… » aident à tenir un objectif (méta-analyse de Gollwitzer et Sheeran, 2006).",
            "invite": {
              "theme": "outside",
              "day": 0
            },
            "hy": "Active « Ne pas déranger » et pose le téléphone écran vers le bas, à plus d’un bras de toi."
          },
          {
            "at": 1,
            "when": "Après 1 heure",
            "title": "L’envie va et vient",
            "do": "Quand l’envie de checker arrive, nomme-la dans ta tête (« tiens, une envie »), puis reprends ce que tu faisais.",
            "brain": "Dans les études où l’on retire le smartphone pendant 24 heures, c’est surtout l’envie de le reprendre qui augmente, pas forcément l’anxiété ni la mauvaise humeur. Une envie fonctionne souvent par vagues : elle monte, puis redescend si on ne la suit pas.",
            "evidence": "observe",
            "source": "Université de Lancaster, 2019 (revue Addictive Behaviors) : 24 h sans smartphone.",
            "hy": "Si tu dois le prendre (appel, minuteur), fais-le, puis repose-le sans ouvrir autre chose."
          },
          {
            "at": 2,
            "when": "Après 2 heures",
            "title": "Le temps ralentit",
            "do": "Fais une chose lente : cuisiner, dessiner, ranger, lire quelques pages.",
            "brain": "Quand les temps morts ne sont plus comblés par un écran, l’esprit se met à vagabonder : souvenirs, idées, projets. Certaines personnes y trouvent du calme, d’autres de l’ennui au début. Les deux sont normaux, et l’ennui ne veut pas dire que ça ne marche pas.",
            "evidence": "hypothese",
            "invite": {
              "theme": "creative",
              "day": 2
            },
            "hy": "Musique ou podcast autorisés, écran éteint, pour accompagner une activité lente."
          },
          {
            "at": 3,
            "when": "Après 3 heures",
            "title": "Cap sur la nuit",
            "do": "Garde le téléphone hors de la chambre, ou au moins loin du lit. Utilise un vrai réveil.",
            "brain": "Un écran allumé au lit garde souvent l’esprit en alerte (fils d’actualité, messages), ce qui peut retarder l’endormissement. Dans une étude d’une semaine avec moins de réseaux sociaux, les symptômes d’insomnie ont baissé de 14,5 % en moyenne, avec de grandes différences d’une personne à l’autre.",
            "evidence": "observe",
            "source": "JAMA Network Open, novembre 2025 : 295 jeunes adultes, une semaine de réseaux sociaux réduits, sans groupe témoin.",
            "hy": "Garde-le pour le réveil seulement, branché loin du lit, en « Ne pas déranger »."
          }
        ],
        "hybrid": {
          "intro": "Le téléphone reste là, mais en retrait : tu ne t’en sers que pour l’utile.",
          "rules": [
            "« Ne pas déranger » activé jusqu’à demain matin, avec tes proches en exception.",
            "Écran vers le bas, hors de portée de main.",
            "Autorisé : appels, musique, minuteur, carte si besoin.",
            "En pause : réseaux sociaux, vidéos courtes, actualités."
          ]
        }
      },
      {
        "id": "weekend",
        "title": "Aventure d’un week-end",
        "tagline": "48 heures pour ressentir la différence.",
        "duration": "48 heures",
        "level": "Moyen",
        "tone": "mint",
        "icon": "mountain",
        "intro": "Du départ au retour, tu mets de côté tes habitudes d’écran pendant tout un week-end. À chaque palier, tu découvres ce que ton cerveau peut ressentir.",
        "prep": [
          "Préviens tes proches que tu seras moins réactif·ve.",
          "Prévois trois activités hors écran : une dehors, une créative, une pour bouger.",
          "Installe un vrai réveil et une horloge ou une montre.",
          "Garde ce qui est utile : télécharge ou imprime à l’avance un itinéraire ou des billets."
        ],
        "defaultHabits": [
          "social",
          "video",
          "news",
          "games",
          "stream",
          "bed"
        ],
        "paliers": [
          {
            "at": 0,
            "when": "Au départ",
            "title": "Décollage",
            "do": "Choisis ton heure de départ, mets le téléphone en mode avion ou dans un tiroir, et note sur papier ce que tu veux faire ce week-end.",
            "brain": "Les décisions prises à l’avance sont plus faciles à tenir. Avoir des activités prêtes évite que le vide soit rempli par le réflexe d’écran.",
            "evidence": "etabli",
            "source": "Les plans « si… alors… » aident à tenir un objectif (méta-analyse de Gollwitzer et Sheeran, 2006).",
            "invite": {
              "theme": "outside",
              "day": 0
            },
            "hy": "Choisis tes exceptions (proches, appels) et laisse « Ne pas déranger » faire le tri."
          },
          {
            "at": 3,
            "when": "Après 3 heures",
            "title": "Le réflexe fantôme",
            "do": "Si ta main va chercher la poche ou si tu sens une vibration qui n’existe pas, c’est normal. Souris et continue.",
            "brain": "Les gestes répétés des centaines de fois se déclenchent tout seuls dans les contextes familiers (canapé, transports, attente). Beaucoup de gens décrivent même de fausses vibrations. Dans une petite étude de 41 étudiants, la séparation d’avec leur téléphone faisait monter l’anxiété et le rythme cardiaque ; sur 24 heures entières, l’étude de Lancaster n’a vu monter que l’envie. Les résultats ne vont pas tous dans le même sens.",
            "evidence": "observe",
            "source": "Université de Lancaster, 2019 (revue Addictive Behaviors) : 24 h sans smartphone.",
            "hy": "Si l’envie de checker arrive, attends ta fenêtre prévue plutôt que de céder tout de suite."
          },
          {
            "at": 12,
            "when": "Après 12 heures",
            "title": "La première nuit",
            "do": "Couche-toi sans écran, avec un livre ou une musique douce. Prévois un vrai réveil pour le matin.",
            "brain": "Sans fil d’actualité ni messages au lit, l’esprit a moins de choses à traiter avant de dormir. Plusieurs études associent moins de réseaux sociaux à un meilleur sommeil, surtout chez des personnes qui dormaient mal. Une seule nuit ne change pas tout : vois-la comme un essai.",
            "evidence": "observe",
            "source": "JAMA Network Open, novembre 2025 : 295 jeunes adultes, une semaine de réseaux sociaux réduits, sans groupe témoin.",
            "hy": "Téléphone hors de la chambre ; un réveil classique si tu en as un, sinon une alarme et rien d’autre."
          },
          {
            "at": 24,
            "when": "Après 24 heures",
            "title": "Un jour entier",
            "do": "Fais la grande activité du week-end : balade, sortie, projet manuel, repas avec quelqu’un.",
            "brain": "À ce stade, ce que les études mesurent surtout, c’est l’envie de reprendre le téléphone. Sur 24 heures, l’humeur et l’anxiété n’avaient pas bougé en moyenne. Si tu te sens un peu agité·e, ça arrive et ça passe souvent avec l’activité. Si c’est très inconfortable, tu peux arrêter sans te juger.",
            "evidence": "observe",
            "source": "Université de Lancaster, 2019 (revue Addictive Behaviors) : 24 h sans smartphone.",
            "invite": {
              "theme": "outside",
              "day": 3
            },
            "hy": "Garde cartes et appareil photo pour la sortie, mais pas les réseaux : tu publies plus tard, ou jamais."
          },
          {
            "at": 36,
            "when": "Après 36 heures",
            "title": "L’attention se pose",
            "do": "Essaie une activité longue sans interruption : lire 20 pages, un puzzle, une vraie conversation.",
            "brain": "Beaucoup de gens racontent qu’ils tiennent plus longtemps sur une même chose quand le téléphone n’est plus là. Les mesures d’attention en laboratoire montrent des effets après deux semaines, pas après un week-end : ici, c’est un avant-goût, pas une preuve.",
            "evidence": "hypothese",
            "invite": {
              "theme": "creative",
              "day": 0
            },
            "hy": "Lis, écris ou dessine avec le téléphone en mode avion pendant l’activité."
          },
          {
            "at": 48,
            "when": "Au retour",
            "title": "Retour en douceur",
            "do": "Reprends en deux temps : d’abord un seul usage utile, notifications éteintes pour le reste. Note ce que tu n’as pas manqué.",
            "brain": "Dans l’essai de deux semaines, le temps d’écran est remonté après la fin du blocage, sans retrouver tout à fait son niveau de départ. Reprendre avec des règles claires aide à garder une partie du bénéfice.",
            "evidence": "observe",
            "source": "PNAS Nexus, 2025 : essai randomisé de 2 semaines sans internet mobile, 467 adultes.",
            "hy": "Reprends par une seule fenêtre de 15 minutes pour tes messages, puis décide de tes règles."
          }
        ],
        "hybrid": {
          "intro": "Tu gardes l’utile et tu limites le reste à de courtes fenêtres.",
          "rules": [
            "« Ne pas déranger » du début à la fin du week-end, avec tes proches en exception.",
            "Deux fenêtres de 15 minutes par jour pour les messages.",
            "Autorisé : appels, cartes, musique, photos (sans publier).",
            "En pause : réseaux sociaux, vidéos courtes, jeux, actualités."
          ]
        }
      },
      {
        "id": "semaine",
        "title": "Semaine reset",
        "tagline": "7 jours pour desserrer le réflexe.",
        "duration": "7 jours",
        "level": "Moyen",
        "tone": "sky",
        "icon": "calendar",
        "intro": "Une semaine pour changer tes routines : moins de scroll, plus de sommeil, plus de présence. Un format qui a été testé dans des études.",
        "prep": [
          "Coupe les notifications non essentielles et sors les applis tentantes de l’écran d’accueil.",
          "Charge ton téléphone hors de la chambre.",
          "Repère tes moments-réflexe (matin au lit, transports, attente) et prépare une alternative.",
          "Prévois un moment avec quelqu’un en vrai, dans la semaine."
        ],
        "defaultHabits": [
          "social",
          "video",
          "news",
          "notifs",
          "bed"
        ],
        "paliers": [
          {
            "at": 0,
            "when": "Jour 1",
            "title": "Je mets en place",
            "do": "Coupe les notifications non essentielles, cache les applis tentantes et charge le téléphone hors de la chambre.",
            "brain": "Rendre le réflexe un peu plus difficile (une appli cachée, un téléphone dans une autre pièce) réduit les usages automatiques : tu gagnes une seconde pour décider.",
            "evidence": "observe",
            "hy": "Fixe tes trois fenêtres (matin, midi, soir) et coupe tout le reste."
          },
          {
            "at": 24,
            "when": "Jour 2",
            "title": "Les temps morts",
            "do": "Quand tu attends (file, transport), regarde autour de toi ou prends un livre.",
            "brain": "Les temps morts sont souvent comblés sans y penser. Les retirer laisse un vide au début, qui se remplit de pensées, d’observations, parfois d’ennui. C’est le signe que le réflexe se desserre, pas que tu fais fausse route.",
            "evidence": "hypothese",
            "invite": {
              "theme": "outside",
              "day": 0
            },
            "hy": "Pendant un temps mort, écoute quelque chose hors ligne plutôt que de scroller."
          },
          {
            "at": 72,
            "when": "Jour 4",
            "title": "Le sommeil",
            "do": "Fixe une heure de coucher sans écran et note sur papier comment tu t’endors.",
            "brain": "Après quelques jours, certaines personnes s’endorment plus vite et dorment mieux. Dans des études où l’on réduit les réseaux sociaux (de 1 à 3 semaines), les symptômes d’insomnie ou le temps de sommeil se sont améliorés en moyenne, mais les résultats varient beaucoup selon les personnes.",
            "evidence": "observe",
            "source": "JAMA Network Open, novembre 2025 : 295 jeunes adultes, une semaine de réseaux sociaux réduits, sans groupe témoin.",
            "hy": "Fixe une heure à la dernière fenêtre du soir, puis téléphone hors de la chambre."
          },
          {
            "at": 120,
            "when": "Jour 6",
            "title": "L’humeur",
            "do": "Écris trois mots sur ton humeur du jour, sur papier, puis appelle ou retrouve quelqu’un en vrai.",
            "brain": "Dans un essai randomisé d’une semaine sans réseaux sociaux, le bien-être et l’anxiété se sont améliorés, et la dépression aussi chez les personnes qui avaient déjà des symptômes. Ce sont des moyennes : certaines personnes ne ressentent presque rien, et c’est normal.",
            "evidence": "observe",
            "source": "Essai randomisé d’une semaine sans réseaux sociaux, 154 adultes (Cyberpsychology, Behavior and Social Networking, 2022).",
            "invite": {
              "theme": "outside",
              "day": 5
            },
            "hy": "Réserve ton quota de réseaux à une fenêtre, et note ton humeur avant et après."
          },
          {
            "at": 168,
            "when": "Jour 7",
            "title": "Le bilan",
            "do": "Regarde ce que tu as gagné (temps, sommeil, humeur) et choisis une ou deux règles à garder.",
            "brain": "Une semaine suffit pour sentir une différence chez beaucoup de gens, mais les études suggèrent que les bénéfices sont plus nets à partir de 10 jours à 2 semaines. Tu peux enchaîner avec la détox complète si l’envie est là.",
            "evidence": "observe",
            "source": "PNAS Nexus, 2025 : essai randomisé de 2 semaines sans internet mobile, 467 adultes.",
            "hy": "Compte les jours où tu as respecté tes fenêtres, sans chercher la perfection."
          }
        ],
        "hybrid": {
          "intro": "Trois fenêtres par jour pour tout le reste : c’est le rythme testé dans les études sur les notifications.",
          "rules": [
            "Notifications coupées, sauf appels et messages de tes proches.",
            "Trois fenêtres par jour (matin, midi, soir) pour le reste.",
            "Téléphone hors de la chambre la nuit.",
            "Réseaux sociaux : environ 30 minutes par jour au plus, pendant une fenêtre."
          ]
        }
      },
      {
        "id": "complete",
        "title": "Détox complète",
        "tagline": "30 jours pour changer de rythme pour de bon.",
        "duration": "30 jours",
        "level": "Ambitieux",
        "tone": "pink",
        "icon": "star",
        "intro": "Le grand défi : un mois pour remplacer tes réflexes d’écran par d’autres habitudes. Tu gardes ce qui est utile (appels, travail, banque, cartes) et tu mets le reste de côté.",
        "prep": [
          "Liste ce qui est vraiment utile et que tu gardes : appels, messages importants, banque, cartes, travail.",
          "Supprime ou bloque les applis tentantes, ou demande à un proche de les verrouiller.",
          "Prépare un carnet et trois activités hors écran que tu aimes.",
          "Parle de ton défi à une personne qui peut te soutenir."
        ],
        "defaultHabits": [
          "social",
          "video",
          "news",
          "games",
          "stream",
          "bed",
          "notifs"
        ],
        "paliers": [
          {
            "at": 0,
            "when": "Jour 1",
            "title": "Le grand tri",
            "do": "Choisis ce que tu mets en pause, bloque ou supprime les applis tentantes, et garde seulement l’utile.",
            "brain": "En psychologie, les récompenses imprévisibles sont celles qui accrochent le plus, et beaucoup de fils d’actualité fonctionnent ainsi (« et s’il y avait du nouveau ? »). C’est un mécanisme plausible, pas la preuve que tout le monde est « accro ». Retirer ces sources t’aide à voir ce qui reste quand elles disparaissent.",
            "evidence": "hypothese",
            "hy": "Applis tentantes supprimées ou bloquées ; tes essentiels (travail, banque, cartes) restent installés."
          },
          {
            "at": 72,
            "when": "3 jours",
            "title": "Le plus dur est souvent là",
            "do": "Si l’envie est forte, marche cinq minutes ou bois un verre d’eau, puis décide.",
            "brain": "Les premiers jours, l’envie de checker est la plus présente : le réflexe cherche son signal. Il n’existe pas de « seuil magique » prouvé à 3 jours, mais beaucoup de personnes disent que ça s’allège ensuite.",
            "evidence": "hypothese",
            "invite": {
              "theme": "movement",
              "day": 1
            },
            "hy": "Ouvre une fenêtre si besoin, mais pas avant : l’envie passe souvent pendant ces cinq minutes."
          },
          {
            "at": 168,
            "when": "1 semaine",
            "title": "Un peu moins d’anxiété ?",
            "do": "Note ce qui a changé : sommeil, humeur, concentration. Écris-le sur papier.",
            "brain": "Dans une étude de 2025 où 295 jeunes adultes ont réduit leurs réseaux sociaux pendant 7 jours, l’anxiété a baissé de 16 % en moyenne, la dépression de 25 % et l’insomnie de 14,5 %. Les écarts entre personnes étaient grands, et il n’y avait pas de groupe témoin.",
            "evidence": "observe",
            "source": "JAMA Network Open, novembre 2025 : 295 jeunes adultes, une semaine de réseaux sociaux réduits, sans groupe témoin.",
            "hy": "Note ce qui change quand tu limites ton téléphone à deux fenêtres par jour."
          },
          {
            "at": 240,
            "when": "10 jours",
            "title": "Le seuil des études",
            "do": "Fais une sortie sans téléphone, ou propose un moment à deux sans écran.",
            "brain": "Dans l’essai de deux semaines sans internet mobile, les personnes qui ont tenu au moins 10 jours ont eu les meilleures améliorations de santé mentale et de bien-être, et un peu moins nettes sur l’attention. Tu entres dans la zone où les effets mesurés deviennent plus clairs.",
            "evidence": "observe",
            "source": "PNAS Nexus, 2025 : essai randomisé de 2 semaines sans internet mobile, 467 adultes.",
            "invite": {
              "theme": "outside",
              "day": 5
            },
            "hy": "Sors avec le téléphone en mode avion ou « Ne pas déranger », et regarde-le seulement pour un vrai besoin."
          },
          {
            "at": 336,
            "when": "2 semaines",
            "title": "L’attention",
            "do": "Choisis un projet qui demande de la concentration : lire un chapitre, dessiner, apprendre quelque chose.",
            "brain": "C’est la durée de l’essai de 467 adultes : l’attention soutenue s’est améliorée d’un niveau comparable à environ 10 ans de déclin lié à l’âge, et environ 7 personnes sur 10 ont vu leur santé mentale progresser. Ces personnes passaient aussi plus de temps avec les autres, dehors et à bouger. Attention : cette étude bloquait tout internet mobile, ton défi est plus souple, tes résultats peuvent différer.",
            "evidence": "observe",
            "source": "PNAS Nexus, 2025 : essai randomisé de 2 semaines sans internet mobile, 467 adultes.",
            "invite": {
              "theme": "creative",
              "day": 4
            },
            "hy": "Bloque des plages de concentration (téléphone en retrait) plutôt qu’une coupure totale."
          },
          {
            "at": 504,
            "when": "3 semaines",
            "title": "Le mythe des 21 jours",
            "do": "Si tu as flanché un jour, reprends simplement le lendemain. Un jour raté n’efface pas le reste.",
            "brain": "On lit partout qu’il faut 21 jours pour créer une habitude. Dans une étude de 2010, il fallait en moyenne environ 66 jours, avec de 18 à 254 jours selon les personnes. Si tu n’y es pas encore, ce n’est pas un manque de volonté : c’est du temps.",
            "evidence": "observe",
            "source": "Lally et coll., 2010 : 96 personnes suivies pour installer une nouvelle habitude.",
            "hy": "Un écart ne compte pas : reprends tes fenêtres au prochain créneau."
          },
          {
            "at": 720,
            "when": "30 jours",
            "title": "Ton nouveau rythme",
            "do": "Choisis deux ou trois règles durables : téléphone hors de la chambre, un jour par semaine sans réseaux, notifications coupées.",
            "brain": "À 30 jours, tu n’as pas « réinitialisé » ton cerveau : c’est une image, pas un résultat prouvé. Ce qui a changé, ce sont tes routines, tes signaux et peut-être ton sommeil et ton humeur. Les habitudes tiennent surtout grâce au contexte (lieu, moment) qui déclenche le geste : c’est lui qu’il faut garder aménagé.",
            "evidence": "etabli",
            "hy": "Garde deux ou trois règles (fenêtres, notifications coupées, téléphone hors de la chambre) : c’est ton rythme durable."
          }
        ],
        "hybrid": {
          "intro": "Les applis tentantes disparaissent, mais tes outils du quotidien restent.",
          "rules": [
            "Réseaux, vidéos courtes, jeux et actualités en pause pendant tout le mois (applis supprimées ou bloquées).",
            "Gardés : appels, messages utiles, cartes, banque, travail, santé.",
            "Deux ou trois fenêtres par jour pour les messages non urgents.",
            "Un jour de souplesse par semaine si besoin, sans culpabilité."
          ]
        }
      }
    ],
    "science": {
      "title": "Ce que la science dit, et ne dit pas",
      "points": [
        "Les effets décrits sont des moyennes : certaines personnes se sentent nettement mieux, d’autres peu.",
        "Beaucoup d’études sont courtes, petites ou sans groupe témoin. Ce sont des pistes, pas des garanties.",
        "« Reset de dopamine » ou « cerveau réparé en 48 h » sont des images populaires, pas des résultats prouvés.",
        "Tout ou rien n’est pas obligatoire : le mode hybride (appels et utile gardés, fenêtres choisies) a aussi des appuis dans la recherche. Voir « Pourquoi l’hybride compte vraiment ».",
        "Un défi n’est pas un traitement. Si tes écrans te pèsent beaucoup, ou si tu te sens mal (anxiété forte, tristesse qui dure), parles-en à un·e médecin ou à un·e psychologue."
      ]
    }
  },
  MP: {
    "categories": [
      {
        "id": "parc",
        "title": "Parcs et jardins publics",
        "short": "Parcs",
        "icon": "flower",
        "tone": "mint",
        "pin": [
          20,
          62
        ],
        "free": "L’entrée est libre dans la plupart des parcs et jardins publics.",
        "doit": "Assieds-toi sur un banc dix minutes et compte cinq sons différents. Puis marche jusqu’à l’arbre qui te paraît le plus ancien.",
        "tip": "Certains jardins ferment à la tombée de la nuit : vérifie les horaires avant de partir.",
        "search": "parc jardin public",
        "invite": {
          "theme": "outside",
          "day": 0
        },
        "live": "Parc ou jardin"
      },
      {
        "id": "biblio",
        "title": "Bibliothèques et médiathèques",
        "short": "Livres",
        "icon": "book",
        "tone": "lilac",
        "pin": [
          38,
          25
        ],
        "free": "Dans la plupart des bibliothèques publiques, entrer, lire et travailler sur place est gratuit (l’emprunt peut demander une inscription).",
        "doit": "Choisis un livre dans un rayon que tu ne regardes jamais et lis la première page. Note une phrase qui te plaît sur ton carnet.",
        "tip": "Beaucoup proposent aussi des revues, des jeux et des expositions gratuites.",
        "search": "bibliothèque médiathèque",
        "invite": {
          "theme": "creative",
          "day": 2
        },
        "live": "Bibliothèque"
      },
      {
        "id": "vue",
        "title": "Points de vue",
        "short": "Vues",
        "icon": "mountain",
        "tone": "peach",
        "pin": [
          82,
          22
        ],
        "free": "Un belvédère, une colline ou un pont : la vue ne coûte rien.",
        "doit": "Regarde l’horizon pendant trois minutes, puis dessine la ligne des toits ou des collines sur ton carnet.",
        "tip": "Va-y en fin de journée pour la lumière, et prévois une couche en plus pour le vent.",
        "search": "point de vue belvédère",
        "invite": {
          "theme": "outside",
          "day": 3
        },
        "live": "Point de vue"
      },
      {
        "id": "eau",
        "title": "Quais, rivières et plans d’eau",
        "short": "Eau",
        "icon": "waves",
        "tone": "sky",
        "pin": [
          48,
          78
        ],
        "free": "Marcher au bord de l’eau ne coûte rien.",
        "doit": "Marche le long de l’eau sans destination. Choisis un détail qui bouge (un reflet, un canard, une péniche) et regarde-le deux minutes.",
        "tip": "Reste à distance des bords glissants et ne te penche pas au-dessus de l’eau.",
        "search": "quais berges rivière lac",
        "invite": {
          "theme": "movement",
          "day": 1
        },
        "live": "Bord d’eau"
      },
      {
        "id": "marche",
        "title": "Marchés de quartier",
        "short": "Marchés",
        "icon": "store",
        "tone": "lemon",
        "pin": [
          55,
          46
        ],
        "free": "On peut flâner entre les étals sans rien acheter.",
        "doit": "Observe les couleurs, les gestes, les odeurs. Demande à un commerçant sa saison préférée et écoute la réponse.",
        "tip": "Prends un sac et un peu de monnaie si l’envie d’acheter te prend : c’est facultatif.",
        "search": "marché",
        "invite": {
          "theme": "outside",
          "day": 1
        },
        "live": "Marché"
      },
      {
        "id": "art",
        "title": "Street art et œuvres en plein air",
        "short": "Art",
        "icon": "pen",
        "tone": "pink",
        "pin": [
          15,
          22
        ],
        "free": "Fresques, sculptures et façades se regardent gratuitement.",
        "doit": "Choisis une œuvre et décris-la en trois mots sur ton carnet. Puis imagine ce qu’elle raconte.",
        "tip": "Lève les yeux : les plus belles fresques sont souvent en hauteur.",
        "search": "street art fresque",
        "invite": {
          "theme": "creative",
          "day": 0
        },
        "live": "Œuvre en plein air"
      },
      {
        "id": "musee",
        "title": "Musées à entrée libre",
        "short": "Musées",
        "icon": "landmark",
        "tone": "lilac",
        "pin": [
          78,
          50
        ],
        "free": "Certains musées sont gratuits toute l’année, d’autres un jour précis du mois ou pour certaines personnes.",
        "doit": "Choisis une seule salle et reste-y dix minutes. Trouve l’objet qui te surprend le plus.",
        "tip": "Vérifie les jours et les conditions de gratuité avant de te déplacer.",
        "search": "musée gratuit",
        "invite": {
          "theme": "creative",
          "day": 4
        },
        "live": "Musée gratuit"
      },
      {
        "id": "sport",
        "title": "Agrès et terrains en accès libre",
        "short": "Bouger",
        "icon": "foot",
        "tone": "mint",
        "pin": [
          68,
          88
        ],
        "free": "Les parcours de santé, agrès et terrains en accès libre ne coûtent rien.",
        "doit": "Fais quelques mouvements doux, à ton rythme, puis marche tranquillement. Arrête-toi si tu ressens une douleur.",
        "tip": "Échauffe-toi un peu et adapte l’effort à ta forme du jour.",
        "search": "parcours de santé city stade agrès",
        "invite": {
          "theme": "movement",
          "day": 0
        },
        "live": "Agrès ou terrain"
      }
    ],
    "steps": [
      {
        "t": "Choisis",
        "d": "Une idée qui te donne envie."
      },
      {
        "t": "Repère",
        "d": "Un lieu près de toi, sur une vraie carte."
      },
      {
        "t": "Note",
        "d": "Son nom et ton chemin, sur papier."
      },
      {
        "t": "Pars",
        "d": "Sans ton téléphone, ou éteint au fond du sac."
      }
    ],
    "safety": [
      "Dis à quelqu’un où tu vas et à quelle heure tu rentres.",
      "Si tu sors seul·e, garde ton téléphone éteint au fond du sac pour les urgences : c’est de la sécurité, pas du scroll.",
      "Vérifie les horaires d’ouverture et la météo avant de partir."
    ]
  },
  HY: {
    "defaultMode": "hybrid",
    "modes": [
      {
        "id": "strict",
        "label": "Sans téléphone",
        "desc": "Le téléphone reste de côté pendant tes moments et tes défis."
      },
      {
        "id": "hybrid",
        "label": "Hybride",
        "desc": "Tu gardes le téléphone pour l’utile et tu l’ouvres à des heures choisies."
      }
    ],
    "essentials": [
      {
        "id": "calls",
        "label": "Appels et messages importants"
      },
      {
        "id": "maps",
        "label": "Cartes et transports"
      },
      {
        "id": "bank",
        "label": "Banque et paiement"
      },
      {
        "id": "work",
        "label": "Travail"
      },
      {
        "id": "health",
        "label": "Santé et urgences"
      },
      {
        "id": "music",
        "label": "Musique et podcasts"
      },
      {
        "id": "photo",
        "label": "Photos"
      },
      {
        "id": "read",
        "label": "Lecture"
      }
    ],
    "defaultEssentials": [
      "calls",
      "maps",
      "bank",
      "work",
      "health"
    ],
    "defaultWindows": [
      {
        "start": "08:30",
        "end": "08:45"
      },
      {
        "start": "12:30",
        "end": "12:45"
      },
      {
        "start": "18:30",
        "end": "19:00"
      }
    ],
    "maxWindows": 4,
    "why": {
      "title": "Pourquoi l’hybride compte vraiment",
      "points": [
        "Dans l’essai de deux semaines sans internet mobile (467 adultes, PNAS Nexus, 2025), les participants gardaient appels et SMS. Ceux qui n’ont pas tout respecté ont quand même progressé, un peu moins.",
        "Dans un essai de 237 personnes (Computers in Human Behavior, 2019), recevoir ses notifications en trois groupes par jour a réduit le stress et amélioré l’humeur, et les participants déverrouillaient moins leur téléphone. Les grouper chaque heure n’apportait presque rien.",
        "Dans la même étude, couper totalement les notifications a augmenté l’anxiété et la peur de rater quelque chose : une coupure complète n’est pas toujours la meilleure solution.",
        "D’où deux à trois fenêtres par jour plutôt qu’une coupure totale. Les résultats varient selon les personnes : l’hybride n’est pas une version au rabais, c’est une façon de tenir dans la vraie vie."
      ]
    },
    "away": {
      "strict": {
        "title": [
          "Tu peux poser",
          "ton téléphone."
        ],
        "note": ""
      },
      "hybrid": {
        "title": [
          "Mets ton téléphone",
          "en retrait."
        ],
        "note": "Mode avion ou « Ne pas déranger », écran vers le bas, hors de portée de main. Tu peux t’en servir pour un essentiel, puis le reposer."
      }
    },
    "mapStep": {
      "strict": {
        "t": "Pars",
        "d": "Sans ton téléphone, ou éteint au fond du sac."
      },
      "hybrid": {
        "t": "Pars",
        "d": "Téléphone en mode avion : carte et urgences seulement."
      }
    },
    "mapNote": {
      "strict": "Le lien ouvre une vraie carte, centrée sur ta position si ton appareil l’autorise. Repère un lieu, note son nom sur papier, puis pars.",
      "hybrid": "Mode hybride : garde ton téléphone pour t’orienter. Ouvre la carte, repère ton chemin, puis passe-le en mode avion pendant ta sortie."
    }
  },
  CARD_KIND: {
  idee: { label: 'Idée d’une minute', tone: 'mint', icon: 'flower' },
  defi: { label: 'Défi-minute', tone: 'lemon', icon: 'flag' },
  mot: { label: 'Un mot doux', tone: 'pink', icon: 'heart' },
  fait: { label: 'Le saviez-vous ?', tone: 'sky', icon: 'brain' }
  },
  CARDS: [
  { id: 'c01', k: 'idee', t: 'Regarde par la fenêtre et trouve quelque chose de bleu, puis quelque chose de rond. Deux minutes, pas plus.' },
  { id: 'c02', k: 'idee', t: 'Sur papier, écris trois choses qui t’ont fait sourire cette semaine, même minuscules.' },
  { id: 'c03', k: 'idee', t: 'Laisse couler de l’eau tiède sur tes mains et sens la température pendant dix secondes.' },
  { id: 'c04', k: 'idee', t: 'Dessine ton prochain repas en trois traits, sans réfléchir.' },
  { id: 'c05', k: 'idee', t: 'Ferme les yeux et compte cinq sons différents autour de toi.' },
  { id: 'c06', k: 'idee', t: 'Étire doucement les bras vers le plafond, puis relâche : deux respirations lentes.' },
  { id: 'c07', k: 'idee', t: 'Pense à quelqu’un que tu apprécies et prépare un petit mot pour lui, à écrire ou à dire demain.' },
  { id: 'c08', k: 'idee', t: 'Observe un objet de ta pièce comme si tu le voyais pour la première fois.' },
  { id: 'c09', k: 'idee', t: 'Pose une main sur ta poitrine et respire lentement quatre fois.' },
  { id: 'c10', k: 'idee', t: 'Choisis une chanson et écoute-la en entier, sans rien faire d’autre.' },
  { id: 'c11', k: 'idee', t: 'Regarde le ciel pendant une minute : nuages, couleurs, mouvements.' },
  { id: 'c12', k: 'idee', t: 'Range un tout petit coin (un tiroir, un bout de bureau) et regarde la différence.' },
  { id: 'c13', k: 'defi', t: 'Défi-minute : va jusqu’à la fenêtre ou la porte la plus éloignée de chez toi et reviens, téléphone posé.' },
  { id: 'c14', k: 'defi', t: 'Défi-minute : décris ta journée en trois mots, à voix haute.' },
  { id: 'c15', k: 'defi', t: 'Défi-minute : trouve une odeur agréable chez toi (savon, thé, orange) et respire-la lentement.' },
  { id: 'c16', k: 'defi', t: 'Défi-minute : écris à la main une phrase que tu aimerais te dire demain matin.' },
  { id: 'c17', k: 'defi', t: 'Défi-minute : bois un verre d’eau en regardant dehors, sans rien d’autre dans les mains.' },
  { id: 'c18', k: 'mot', t: 'Un petit pas de côté compte déjà comme un pas.' },
  { id: 'c19', k: 'mot', t: 'Tu n’as rien à rattraper. Tu reprends là où tu es.' },
  { id: 'c20', k: 'mot', t: 'Avoir envie de regarder son téléphone, c’est humain. Respire, puis choisis.' },
  { id: 'c21', k: 'mot', t: 'L’ennui est parfois la porte d’une idée.' },
  { id: 'c22', k: 'mot', t: 'Faire peu, mais le faire vraiment.' },
  { id: 'c23', k: 'mot', t: 'Ce que tu poses aujourd’hui te rend un peu de place demain.' },
  { id: 'c24', k: 'mot', t: 'Une pause réussie, c’est une pause qui t’a fait du bien, pas une pause parfaite.' },
  { id: 'c25', k: 'fait', t: 'Dans une étude de 2010, il a fallu en moyenne 66 jours pour installer une habitude, avec de 18 à 254 jours selon les personnes. Prendre son temps est normal.', s: 'Lally et coll., 2010 : 96 personnes suivies.' },
  { id: 'c26', k: 'fait', t: 'Après 24 heures sans smartphone, c’est surtout l’envie de le reprendre qui a augmenté, pas forcément l’anxiété. Une envie va et vient par vagues.', s: 'Université de Lancaster, 2019 (revue Addictive Behaviors).' },
  { id: 'c27', k: 'fait', t: 'Dans une étude de 2019, la baisse du cortisol (une hormone du stress) était la plus efficace après 20 à 30 minutes passées dans un espace de nature, même en ville. Un petit parc peut compter aussi.', s: 'Hunter et coll., 2019 (Frontiers in Psychology), mesures de cortisol. Une seule étude, et les résultats varient selon les personnes.' },
  { id: 'c28', k: 'fait', t: 'Décider à l’avance (« quand je rentre, je range mon téléphone ») aide à tenir un objectif mieux que se retenir sur le moment.', s: 'Gollwitzer et Sheeran, 2006 (méta-analyse).' }
  ]
};
