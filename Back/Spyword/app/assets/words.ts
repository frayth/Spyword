export type Word = {
  word: string
  spy: string[]
}
const words: Word[] = [
  { word: 'pomme', spy: ['banane', 'poire', 'raisin'] },
  { word: 'banane', spy: ['pomme', 'poire', 'raisin'] },
  { word: 'poire', spy: ['pomme', 'banane', 'raisin'] },
  { word: 'raisin', spy: ['pomme', 'banane', 'poire'] },

  { word: 'avion', spy: ['pilote', 'aéroport', 'vol'] },
  { word: 'pilote', spy: ['avion', 'aéroport', 'vol'] },
  { word: 'aéroport', spy: ['avion', 'pilote', 'vol'] },
  { word: 'vol', spy: ['avion', 'pilote', 'aéroport'] },

  { word: 'école', spy: ['élève', 'professeur', 'classe'] },
  { word: 'élève', spy: ['école', 'professeur', 'classe'] },
  { word: 'professeur', spy: ['école', 'élève', 'classe'] },
  { word: 'classe', spy: ['école', 'élève', 'professeur'] },

  { word: 'ordinateur', spy: ['clavier', 'écran', 'souris'] },
  { word: 'clavier', spy: ['ordinateur', 'écran', 'souris'] },
  { word: 'écran', spy: ['ordinateur', 'clavier', 'souris', 'cinéma'] },
  { word: 'souris', spy: ['ordinateur', 'clavier', 'écran'] },

  { word: 'guitare', spy: ['musique', 'cordes', 'instrument'] },
  { word: 'musique', spy: ['guitare', 'cordes', 'instrument', 'danse', 'notes', 'ballet', 'son'] },
  { word: 'cordes', spy: ['guitare', 'musique', 'instrument'] },
  { word: 'instrument', spy: ['guitare', 'musique', 'cordes'] },

  { word: 'montagne', spy: ['sommet', 'randonnée', 'alpinisme'] },
  { word: 'sommet', spy: ['montagne', 'randonnée', 'alpinisme'] },
  { word: 'randonnée', spy: ['montagne', 'sommet', 'alpinisme'] },
  { word: 'alpinisme', spy: ['montagne', 'sommet', 'randonnée'] },

  { word: 'peinture', spy: ['art', 'toile', 'pinceau'] },
  { word: 'art', spy: ['peinture', 'toile', 'pinceau'] },
  { word: 'toile', spy: ['peinture', 'art', 'pinceau'] },
  { word: 'pinceau', spy: ['peinture', 'art', 'toile'] },

  { word: 'voiture', spy: ['moteur', 'route', 'conduite'] },
  { word: 'moteur', spy: ['voiture', 'route', 'conduite'] },
  { word: 'route', spy: ['voiture', 'moteur', 'conduite'] },
  { word: 'conduite', spy: ['voiture', 'moteur', 'route'] },

  { word: 'téléphone', spy: ['appel', 'portable', 'communication'] },
  { word: 'appel', spy: ['téléphone', 'portable', 'communication'] },
  { word: 'portable', spy: ['téléphone', 'appel', 'communication'] },
  { word: 'communication', spy: ['téléphone', 'appel', 'portable'] },

  { word: 'cinéma', spy: ['film', 'écran', 'acteur'] },
  { word: 'film', spy: ['cinéma', 'écran', 'acteur'] },
  { word: 'acteur', spy: ['cinéma', 'film', 'écran', 'théâtre'] },

  { word: 'jardin', spy: ['fleurs', 'plantes', 'potager'] },
  { word: 'fleurs', spy: ['jardin', 'plantes', 'potager'] },
  { word: 'plantes', spy: ['jardin', 'fleurs', 'potager'] },
  { word: 'potager', spy: ['jardin', 'fleurs', 'plantes'] },

  { word: 'hôpital', spy: ['médecin', 'infirmière', 'patient'] },
  { word: 'médecin', spy: ['hôpital', 'infirmière', 'patient'] },
  { word: 'infirmière', spy: ['hôpital', 'médecin', 'patient'] },
  { word: 'patient', spy: ['hôpital', 'médecin', 'infirmière'] },

  { word: 'restaurant', spy: ['menu', 'serveur', 'cuisine'] },
  { word: 'menu', spy: ['restaurant', 'serveur', 'cuisine'] },
  { word: 'serveur', spy: ['restaurant', 'menu', 'cuisine'] },
  { word: 'cuisine', spy: ['restaurant', 'menu', 'serveur', 'recette', 'ingrédients', 'chef'] },

  { word: 'bibliothèque', spy: ['livres', 'lecture', 'étagères'] },
  { word: 'livres', spy: ['bibliothèque', 'lecture', 'étagères'] },
  { word: 'lecture', spy: ['bibliothèque', 'livres', 'étagères'] },
  { word: 'étagères', spy: ['bibliothèque', 'livres', 'lecture'] },

  { word: 'plage', spy: ['sable', 'mer', 'soleil'] },
  { word: 'sable', spy: ['plage', 'mer', 'soleil'] },
  { word: 'mer', spy: ['plage', 'sable', 'soleil', 'bateau', 'vague', 'poisson'] },
  {
    word: 'soleil',
    spy: ['plage', 'sable', 'mer', 'lumière', 'météo', 'chaud', 'brille', 'été', 'vacances'],
  },

  { word: 'football', spy: ['ballon', 'but', 'équipe'] },
  { word: 'ballon', spy: ['football', 'but', 'équipe', 'rond', 'lancer', 'sport', 'rebondir'] },
  { word: 'but', spy: ['football', 'ballon', 'équipe'] },
  { word: 'équipe', spy: ['football', 'ballon', 'but', 'sport', 'ensemble', 'gagner'] },

  { word: 'théâtre', spy: ['scène', 'acteur', 'pièce'] },
  { word: 'scène', spy: ['théâtre', 'acteur', 'pièce'] },
  { word: 'pièce', spy: ['théâtre', 'scène', 'acteur', 'argent', 'rond', 'metal'] },

  { word: 'astronomie', spy: ['étoiles', 'planète', 'télescope'] },
  {
    word: 'étoiles',
    spy: ['astronomie', 'planète', 'télescope', 'constellation', 'voie lactée', 'astérisme'],
  },
  { word: 'planète', spy: ['astronomie', 'étoiles', 'télescope'] },
  { word: 'télescope', spy: ['astronomie', 'étoiles', 'planète', 'galaxie'] },

  { word: 'recette', spy: ['cuisine', 'ingrédients', 'chef'] },
  { word: 'ingrédients', spy: ['cuisine', 'recette', 'chef'] },
  { word: 'chef', spy: ['cuisine', 'recette', 'ingrédients'] },

  { word: 'photographie', spy: ['appareil', 'image', 'objectif'] },
  { word: 'appareil', spy: ['photographie', 'image', 'objectif'] },
  { word: 'image', spy: ['photographie', 'appareil', 'objectif', 'reflet', 'miroir', 'vision'] },
  { word: 'objectif', spy: ['photographie', 'appareil', 'image'] },

  { word: 'danse', spy: ['ballet', 'mouvement', 'musique'] },
  { word: 'ballet', spy: ['danse', 'mouvement', 'musique'] },
  { word: 'mouvement', spy: ['danse', 'ballet', 'musique'] },

  { word: 'vélo', spy: ['pédales', 'guidon', 'cycliste'] },
  { word: 'pédales', spy: ['vélo', 'guidon', 'cycliste'] },
  { word: 'guidon', spy: ['vélo', 'pédales', 'cycliste'] },
  { word: 'cycliste', spy: ['vélo', 'pédales', 'guidon'] },

  { word: 'zoo', spy: ['animaux', 'enclos', 'visite'] },
  { word: 'animaux', spy: ['zoo', 'enclos', 'visite'] },
  { word: 'enclos', spy: ['zoo', 'animaux', 'visite'] },
  { word: 'visite', spy: ['zoo', 'animaux', 'enclos'] },

  { word: 'notes', spy: ['mélodie', 'orchestre', 'musique'] },
  { word: 'mélodie', spy: ['notes', 'orchestre', 'musique', 'chant'] },
  { word: 'orchestre', spy: ['notes', 'mélodie', 'musique'] },

  { word: 'galaxie', spy: ['télescope'] },

  { word: 'ombre', spy: ['silhouettes', 'crépuscule', 'reflet', 'lumière', 'caché'] },
  { word: 'silhouettes', spy: ['ombre', 'crépuscule', 'reflet'] },
  { word: 'crépuscule', spy: ['ombre', 'silhouettes', 'reflet', 'aube', 'horizon'] },
  { word: 'reflet', spy: ['ombre', 'silhouettes', 'crépuscule', 'miroir', 'image', 'eau'] },

  { word: 'écho', spy: ['réverbération', 'répétition', 'son'] },
  { word: 'réverbération', spy: ['écho', 'répétition', 'son'] },
  { word: 'répétition', spy: ['écho', 'réverbération', 'son'] },
  { word: 'son', spy: ['écho', 'réverbération', 'répétition', 'musique', 'voix', 'bruit'] },

  { word: 'mirage', spy: ['illusion', 'désert'] },
  { word: 'illusion', spy: ['mirage', 'désert'] },
  { word: 'désert', spy: ['mirage', 'illusion'] },

  { word: 'volcan', spy: ['lave', 'éruption', 'cratère'] },
  { word: 'lave', spy: ['volcan', 'éruption', 'cratère'] },
  { word: 'éruption', spy: ['volcan', 'lave', 'cratère'] },
  { word: 'cratère', spy: ['volcan', 'lave', 'éruption'] },

  { word: 'constellation', spy: ['étoiles', 'voie lactée', 'astérisme'] },
  { word: 'voie lactée', spy: ['constellation', 'étoiles', 'astérisme'] },
  { word: 'astérisme', spy: ['constellation', 'étoiles', 'voie lactée'] },

  { word: 'abysse', spy: ['profondeur', 'ténèbres', 'fosse'] },
  { word: 'profondeur', spy: ['abysse', 'ténèbres', 'fosse'] },
  { word: 'ténèbres', spy: ['abysse', 'profondeur', 'fosse'] },
  { word: 'fosse', spy: ['abysse', 'profondeur', 'ténèbres'] },

  { word: 'métamorphose', spy: ['transformation', 'mutation', 'changement'] },
  { word: 'transformation', spy: ['métamorphose', 'mutation', 'changement', 'cocon'] },
  { word: 'mutation', spy: ['métamorphose', 'transformation', 'changement'] },
  { word: 'changement', spy: ['métamorphose', 'transformation', 'mutation', 'cocon'] },

  { word: 'énigme', spy: ['mystère', 'secret', 'question', 'résoudre'] },
  { word: 'mystère', spy: ['énigme', 'secret', 'brouillard', 'inconnu', 'chuchoter'] },
  {
    word: 'secret',
    spy: ['énigme', 'mystère', 'murmure', 'chuchoter', 'confiance', 'caché', 'refuge'],
  },

  { word: 'incandescence', spy: ['lumière', 'chaleur', 'brillance'] },
  {
    word: 'chaleur',
    spy: ['incandescence', 'lumière', 'brillance', 'soleil', 'chaud', 'été', 'ampoule'],
  },
  {
    word: 'brillance',
    spy: ['incandescence', 'lumière', 'chaleur', 'éclat', 'clarté', 'brillant'],
  },

  {
    word: 'maison',
    spy: [
      'toit',
      'porte',
      'fenêtre',
      'famille',
      'foyer',
      'abri',
      'chambre',
      'cuisine',
      'salon',
      'salle de bain',
    ],
  },
  { word: 'toit', spy: ['maison', 'porte', 'fenêtre'] },
  { word: 'porte', spy: ['maison', 'toit', 'fenêtre', 'entrer', 'clé'] },
  { word: 'fenêtre', spy: ['maison', 'toit', 'porte', 'regarder', 'verre'] },

  { word: 'arbre', spy: ['feuille', 'racine', 'branche', 'nature', 'tronc', 'banc'] },
  { word: 'feuille', spy: ['arbre', 'racine', 'branche', 'nature', 'verdure'] },
  { word: 'racine', spy: ['arbre', 'feuille', 'branche', 'terre', 'origine', 'plantation'] },
  { word: 'branche', spy: ['arbre', 'feuille', 'racine', 'nid'] },

  { word: 'rivière', spy: ['courant', 'eau', 'berge', 'nature'] },
  { word: 'courant', spy: ['rivière', 'eau', 'berge'] },
  {
    word: 'eau',
    spy: [
      'rivière',
      'courant',
      'berge',
      'mer',
      'brouillard',
      'sillage',
      'piscine',
      'douche',
      'arroser',
    ],
  },
  { word: 'berge', spy: ['rivière', 'courant', 'eau'] },

  { word: 'livre', spy: ['page', 'histoire', 'auteur', 'lecture', 'écrit', 'bibliothèque'] },
  { word: 'page', spy: ['livre', 'histoire', 'auteur', 'lecture', 'tourner', 'chiffre'] },
  {
    word: 'histoire',
    spy: ['livre', 'page', 'auteur', 'récit', 'personnage', 'relique', 'ancien', 'passé', 'époque'],
  },
  { word: 'auteur', spy: ['livre', 'page', 'histoire'] },

  { word: 'aube', spy: ['crépuscule', 'horizon', 'clarté'] },
  { word: 'horizon', spy: ['aube', 'crépuscule', 'lointain'] },
  { word: 'clarté', spy: ['aube', 'lumière', 'brillance', 'évident', 'compréhension'] },

  { word: 'murmure', spy: ['vent', 'secret', 'discret'] },
  { word: 'vent', spy: ['murmure', 'souffle', 'brise', 'sillage', 'voile', 'météo', 'froid'] },
  { word: 'discret', spy: ['murmure', 'silencieux', 'caché', 'chuchoter', 'léger'] },

  { word: 'éclat', spy: ['diamant', 'lumière', 'brillant'] },
  { word: 'diamant', spy: ['éclat', 'pierre', 'précieux'] },
  { word: 'brillant', spy: ['éclat', 'lumineux', 'scintillant', 'briller'] },

  { word: 'chemin', spy: ['sentier', 'direction', 'voyage', 'labyrinthe', 'guide'] },
  { word: 'sentier', spy: ['chemin', 'tracé', 'forêt'] },
  { word: 'direction', spy: ['chemin', 'boussole', 'destination'] },
  { word: 'voyage', spy: ['chemin', 'aventure', 'découverte', 'valise', 'carte', 'explorer'] },

  { word: 'brouillard', spy: ['mystère', 'cachette', 'humidité'] },
  { word: 'cachette', spy: ['brouillard', 'secret', 'refuge', 'coffre'] },
  { word: 'humidité', spy: ['brouillard', 'rosée', 'fraîcheur'] },
  { word: 'refuge', spy: ['brouillard', 'abri', 'sécurité'] },

  { word: 'ruban', spy: ['nœud', 'cadeau', 'détail'] },
  { word: 'nœud', spy: ['ruban', 'attacher', 'lien'] },
  { word: 'cadeau', spy: ['ruban', 'surprise', 'fête'] },
  { word: 'détail', spy: ['ruban', 'précision', 'nuance'] },

  { word: 'sillage', spy: ['bateau', 'trace', 'eau'] },
  { word: 'bateau', spy: ['sillage', 'mer', 'voile', 'ancre', 'port', 'transport'] },
  { word: 'trace', spy: ['sillage', 'empreinte', 'passage'] },
  { word: 'voile', spy: ['sillage', 'vent', 'navire'] },

  { word: 'parfum', spy: ['fleur', 'odeur', 'essence', 'fragrance'] },
  { word: 'odeur', spy: ['parfum', 'fragrance', 'nez', 'odorat'] },
  { word: 'essence', spy: ['parfum', 'extrait', 'concentré', 'moteur', 'véhicule'] },
  { word: 'fragrance', spy: ['parfum', 'doux', 'arôme'] },

  { word: 'étoffe', spy: ['tissu', 'vêtement', 'texture'] },
  { word: 'tissu', spy: ['étoffe', 'couture', 'matière', 'vêtement', 'doux', 'coudre', 'habit'] },
  {
    word: 'vêtement',
    spy: ['étoffe', 'mode', 'habit', 'porter', 'veste', 'pantalon', 'chaussette'],
  },
  { word: 'texture', spy: ['étoffe', 'toucher', 'surface'] },

  { word: 'miroir', spy: ['reflet', 'glace', 'apparence'] },
  { word: 'glace', spy: ['miroir', 'froid', 'boire', 'hiver', 'été'] },
  { word: 'apparence', spy: ['reflet', 'aspect', 'façade'] },

  { word: 'labyrinthe', spy: ['chemin', 'énigme', 'perdu'] },
  { word: 'perdu', spy: ['labyrinthe', 'désorienté', 'trouver'] },
  { word: 'désorienté', spy: ['labyrinthe', 'égaré', 'confus'] },

  { word: 'voix', spy: ['chant', 'parole', 'son', 'chuchoter', 'murmurer'] },
  { word: 'parole', spy: ['voix', 'discours', 'langage'] },
  { word: 'chant', spy: ['voix', 'mélodie', 'musique', 'oiseau', 'chante'] },
  { word: 'discours', spy: ['voix', 'prendre', 'public'] },

  { word: 'muraille', spy: ['mur', 'protection', 'ancien'] },
  { word: 'mur', spy: ['muraille', 'bâtiment', 'brique', 'fixer', 'clou'] },
  { word: 'protection', spy: ['muraille', 'défense', 'sécurité', 'cocon', 'abri', 'refuge'] },
  { word: 'ancien', spy: ['muraille', 'histoire', 'passé', 'relique', 'objet', 'artéfact'] },

  { word: 'éclaireur', spy: ['pionnier', 'guide', 'découverte'] },
  { word: 'pionnier', spy: ['éclaireur', 'premier', 'explorateur'] },
  { word: 'guide', spy: ['éclaireur', 'chemin', 'conseil'] },
  { word: 'explorateur', spy: ['éclaireur', 'aventure', 'inconnu'] },

  { word: 'chuchoter', spy: ['murmurer', 'secret', 'doucement'] },
  { word: 'doucement', spy: ['chuchoter', 'calme', 'lentement', 'tissu'] },

  { word: 'trésor', spy: ['coffre', 'or', 'découverte'] },
  { word: 'coffre', spy: ['trésor', 'cachette', 'serrure'] },
  { word: 'or', spy: ['trésor', 'richesse', 'métal'] },
  { word: 'découverte', spy: ['trésor', 'exploration', 'trouvaille', 'voyage', 'nouveau'] },

  { word: 'cocon', spy: ['chrysalide', 'protection', 'transformation'] },
  { word: 'chrysalide', spy: ['cocon', 'papillon', 'larve'] },
  { word: 'papillon', spy: ['chrysalide', 'voler', 'fleur'] },

  { word: 'abri', spy: ['refuge', 'maison', 'protection'] },
  { word: 'sécurité', spy: ['refuge', 'calme', 'tranquillité', 'protection', 'ancre', 'attacher'] },
  { word: 'caché', spy: ['refuge', 'secret', 'invisible', 'brouillard', 'ombre'] },

  { word: 'silencieux', spy: ['calme', 'bruit', 'discret'] },
  { word: 'bruit', spy: ['silencieux', 'son', 'absence', 'moteur'] },
  { word: 'calme', spy: ['silencieux', 'tranquillité', 'paix', 'repos', 'campagne', 'doucement'] },

  { word: 'ancre', spy: ['bateau', 'stabilité', 'attacher'] },
  { word: 'stabilité', spy: ['ancre', 'équilibre', 'fixe'] },
  { word: 'attacher', spy: ['ancre', 'lien', 'sécuriser', 'nœud'] },

  { word: 'relique', spy: ['ancien', 'objet', 'histoire'] },
  { word: 'objet', spy: ['relique', 'ancien', 'artéfact', 'table', 'chaise', 'usine'] },
  { word: 'artéfact', spy: ['relique', 'découverte', 'ancien'] },

  { word: 'frisson', spy: ['peur', 'froid', 'sensation'] },
  { word: 'peur', spy: ['frisson', 'crainte', 'angoisse'] },
  { word: 'froid', spy: ['frisson', 'température', 'hiver', 'vent', 'glace'] },
  { word: 'sensation', spy: ['frisson', 'sentiment', 'émotion'] },

  { word: 'fruit', spy: ['goût', 'pépin', 'jus'] },
  { word: 'goût', spy: ['fruit', 'saveur', 'langue'] },
  { word: 'pépin', spy: ['fruit', 'graine', 'petit'] },
  { word: 'jus', spy: ['fruit', 'liquide', 'verre'] },

  {
    word: 'animal',
    spy: ['patte', 'queue', 'poil', 'chien', 'chat', 'oiseau', 'zoo', 'enclos', 'visite'],
  },
  { word: 'patte', spy: ['animal', 'marche', 'griffes'] },
  { word: 'queue', spy: ['animal', 'derrière', 'remue'] },
  { word: 'poil', spy: ['animal', 'douceur', 'pelage'] },

  { word: 'oiseau', spy: ['plume', 'nid', 'voler', 'animal', 'chante', 'aile'] },
  { word: 'plume', spy: ['oiseau', 'léger', 'doux'] },
  { word: 'nid', spy: ['oiseau', 'œuf', 'branche'] },
  { word: 'voler', spy: ['oiseau', 'ciel', 'ailes', 'avion'] },

  { word: 'vague', spy: ['mer', 'eau', 'roule'] },
  { word: 'poisson', spy: ['mer', 'nage', 'écailles'] },

  { word: 'temps', spy: ['minute', 'heure', 'jour', 'horloge', 'minuteur', 'passer'] },
  { word: 'minute', spy: ['temps', 'seconde', 'rapide'] },
  { word: 'heure', spy: ['temps', 'montre', 'rendez-vous'] },
  { word: 'jour', spy: ['temps', 'nuit', 'lumière'] },

  { word: 'famille', spy: ['maison', 'amour', 'parent'] },
  { word: 'amour', spy: ['famille', 'cœur', 'partage'] },
  { word: 'parent', spy: ['famille', 'enfant', 'adulte'] },

  { word: 'jeu', spy: ['règle', 'jouer', 'rigoler'] },
  { word: 'règle', spy: ['jeu', 'suivre', 'interdit'] },
  { word: 'jouer', spy: ['jeu', "s'amuser", 'enfant', 'sport', 'terrain'] },
  { word: 'rigoler', spy: ['jeu', 'rire', 'plaisir'] },

  { word: 'couleur', spy: ['peindre', 'rouge', 'arc-en-ciel', 'ballon'] },
  { word: 'peindre', spy: ['couleur', 'pinceau', 'tableau'] },
  { word: 'rouge', spy: ['couleur', 'pomme', 'feu'] },
  { word: 'arc-en-ciel', spy: ['couleur', 'pluie', 'ciel'] },

  { word: 'maître', spy: ['école', 'apprendre', 'classe'] },
  { word: 'étudier', spy: ['élève', 'copain'] },

  { word: 'courir', spy: ['sport', 'vite', 'jambe', 'course', 'vitesse', 'piste'] },

  { word: 'fleur', spy: ['pétale', 'jardin', 'parfum', 'nature', 'verdure'] },
  { word: 'pétale', spy: ['fleur', 'doux', 'tombe'] },

  { word: 'nourriture', spy: ['manger', 'faim', 'assiette'] },
  {
    word: 'manger',
    spy: ['nourriture', 'bouche', 'gourmand', 'cuisine', 'repas', 'table', 'bois'],
  },
  { word: 'faim', spy: ['nourriture', 'ventre', 'midi'] },
  { word: 'assiette', spy: ['nourriture', 'table', 'propre'] },

  { word: 'vêtement', spy: ['habit', 'tissu', 'porter'] },
  { word: 'habit', spy: ['vêtement', 'robe', 'chemise', 'veste', 'pantalon', 'chaussette'] },
  { word: 'porter', spy: ['vêtement', 'mettre', 'corps'] },

  { word: 'valise', spy: ['voyage', 'bagage', 'fermer'] },
  { word: 'carte', spy: ['voyage', 'chemin', 'trouver', 'point'] },

  { word: 'métier', spy: ['travailler', 'outil', 'aider'] },
  { word: 'travailler', spy: ['métier', 'bureau', 'argent', 'surface'] },
  { word: 'aider', spy: ['métier', 'service', 'personne'] },

  { word: 'météo', spy: ['soleil', 'pluie', 'vent'] },
  { word: 'pluie', spy: ['météo', 'goutte', 'parapluie', 'arc-en-ciel'] },

  { word: 'objet', spy: ['table', 'chaise', 'usine', 'relique', 'ancien', 'artéfact'] },
  { word: 'table', spy: ['objet', 'manger', 'bois', 'bureau', 'travailler', 'surface'] },
  { word: 'chaise', spy: ['objet', "s'asseoir", 'pied', 'bureau', 'dossier'] },
  { word: 'usine', spy: ['objet', 'fabriquer', 'machine'] },

  { word: 'lieu', spy: ['ville', 'campagne', 'point'] },
  { word: 'ville', spy: ['lieu', 'rue', 'bâtiment'] },
  { word: 'campagne', spy: ['lieu', 'nature', 'calme'] },
  { word: 'point', spy: ['lieu', 'indiquer', 'carte'] },

  { word: 'corps', spy: ['main', 'pied', 'tête', 'porter'] },
  { word: 'main', spy: ['corps', 'doigt', 'prendre', 'outil', 'fabriquer'] },
  { word: 'pied', spy: ['corps', 'chaussure', 'marcher', 'patte', 'chaussette'] },
  { word: 'tête', spy: ['corps', 'cheveux', 'penser', 'bonnet'] },

  { word: 'émotion', spy: ['joie', 'tristesse', 'colère', 'sensation', 'sentiment'] },
  { word: 'joie', spy: ['émotion', 'rire', 'heureux'] },
  { word: 'tristesse', spy: ['émotion', 'pleurer', 'chagrin'] },
  { word: 'colère', spy: ['émotion', 'crier', 'frustré'] },

  { word: 'sens', spy: ['vue', 'ouïe', 'odorat'] },
  { word: 'vue', spy: ['sens', 'œil', 'regarder'] },
  { word: 'ouïe', spy: ['sens', 'oreille', 'écouter'] },
  { word: 'odorat', spy: ['sens', 'nez', 'sentir'] },

  { word: 'forme', spy: ['rond', 'carré', 'triangle', 'cercle'] },
  { word: 'rond', spy: ['forme', 'cercle', 'balle', 'pièce'] },
  { word: 'carré', spy: ['forme', 'quatre', 'boîte', 'côté'] },
  { word: 'triangle', spy: ['forme', 'trois', 'pointe'] },

  { word: 'moyen', spy: ['voiture', 'bus', 'train'] },
  { word: 'bus', spy: ['moyen', 'transport', 'arrêt'] },
  { word: 'train', spy: ['moyen', 'rail', 'rapide'] },

  { word: 'nature', spy: ['arbre', 'rivière', 'montagne', 'fleur', 'vert', 'verdure', 'campagne'] },
  { word: 'tronc', spy: ['arbre', 'bois', 'solide'] },

  { word: 'cuisine', spy: ['four', 'casserole', 'manger'] },
  { word: 'four', spy: ['cuisine', 'chaud', 'cuire'] },
  { word: 'casserole', spy: ['cuisine', 'ustensile', 'bouillir'] },

  { word: 'jardinage', spy: ['fleur', 'terre', 'arroser'] },
  { word: 'arroser', spy: ['jardinage', 'eau', 'tuyau'] },

  { word: 'dessin', spy: ['crayon', 'feuille', 'couleur', 'gomme'] },
  { word: 'crayon', spy: ['dessin', 'écrire', 'mine'] },
  { word: 'gomme', spy: ['dessin', 'effacer', 'erreur'] },

  { word: 'chiffre', spy: ['compter', 'nombre', 'calcul'] },
  { word: 'compter', spy: ['chiffre', 'addition', 'un'] },
  { word: 'nombre', spy: ['chiffre', 'grand', 'petit'] },
  { word: 'calcul', spy: ['chiffre', 'math', 'opération'] },

  { word: 'vacances', spy: ['plage', 'soleil', 'repos'] },
  { word: 'repos', spy: ['vacances', 'détente', 'calme'] },

  { word: 'hiver', spy: ['froid', 'neige', 'bonnet'] },
  { word: 'neige', spy: ['hiver', 'blanc', 'tomber'] },
  { word: 'bonnet', spy: ['hiver', 'tête', 'chaud'] },

  { word: 'été', spy: ['chaud', 'piscine', 'glace'] },
  { word: 'piscine', spy: ['été', 'nager', 'bleu', 'eau'] },

  { word: 'santé', spy: ['docteur', 'malade', 'médicament'] },
  { word: 'docteur', spy: ['santé', 'soigner', 'hôpital'] },
  { word: 'malade', spy: ['santé', 'fièvre', 'toux'] },
  { word: 'médicament', spy: ['santé', 'guérir', 'pilule'] },

  { word: 'véhicule', spy: ['roue', 'moteur', 'rouler'] },
  { word: 'roue', spy: ['véhicule', 'pneu', 'tourner'] },
  { word: 'rouler', spy: ['véhicule', 'route', 'avancer'] },

  { word: 'horloge', spy: ['temps', 'aiguille', 'mur'] },
  { word: 'minuteur', spy: ['temps', 'compte', 'cuisine'] },

  { word: 'verdure', spy: ['nature', 'herbe', 'forêt'] },

  { word: 'fête', spy: ['ballon', 'musique', 'gâteau'] },
  { word: 'gâteau', spy: ['fête', 'bougie', 'sucré'] },

  { word: 'argent', spy: ['pièce', 'billet', 'payer'] },
  { word: 'payer', spy: ['argent', 'acheter', 'prix'] },
  { word: 'billet', spy: ['argent', 'papier', 'banque'] },

  { word: 'bureau', spy: ['chaise', 'table', 'stylo'] },
  { word: 'stylo', spy: ['bureau', 'écrire', 'encre'] },

  { word: 'lampe', spy: ['lumière', 'nuit', 'allumer'] },
  { word: 'ampoule', spy: ['lumière', 'verre', 'chaud'] },

  { word: 'cercle', spy: ['forme', 'rond', 'anneau'] },
  { word: 'carré', spy: ['forme', 'côté', 'boîte'] },

  { word: 'chambre', spy: ['maison', 'lit', 'dormir'] },
  { word: 'salon', spy: ['maison', 'canapé', 'télévision'] },
  { word: 'salle de bain', spy: ['maison', 'douche', 'eau'] },

  { word: 'veste', spy: ['habit', 'bras', 'chaud'] },
  { word: 'pantalon', spy: ['habit', 'jambe', 'bouton'] },
  { word: 'chaussette', spy: ['habit', 'pied', 'paire'] },

  { word: 'marteau', spy: ['outil', 'frapper', 'bois'] },
  { word: 'clou', spy: ['outil', 'fixer', 'mur'] },
  { word: 'scie', spy: ['outil', 'couper', 'dent'] },

  { word: 'chien', spy: ['animal', 'aboie', 'fidèle'] },
  { word: 'chat', spy: ['animal', 'ronronne', 'souris'] },

  { word: 'course', spy: ['sport', 'vitesse', 'piste'] },
  { word: 'terrain', spy: ['sport', 'jouer', 'herbe'] },

  { word: 'transport', spy: ['vélo', 'voiture', 'bateau', 'bus', 'train', 'avion'] },
]
export default words
