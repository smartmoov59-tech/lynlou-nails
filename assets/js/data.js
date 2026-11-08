/* ============================================================
   Données du salon — tout ce qui change se modifie ICI.
   Sources : fiche Planity, Google Maps, Instagram @lynlounails
   (relevé du 3 novembre 2026)
   ============================================================ */
window.LYNLOU = {
  phone: "06 73 50 28 73",
  phoneTel: "+33673502873",
  planity: "https://www.planity.com/lynlou-nails-13100-aix-en-provence",
  instagram: "https://www.instagram.com/lynlounails/",
  maps: "https://www.google.com/maps/place/Lynlou+Nails/@43.529243,5.4445041,17z/data=!4m6!3m5!1s0x12c98dbee60195f9:0x3c56d587b3d1d6ab!8m2!3d43.529243!4d5.4445041!16s%2Fg%2F11n60hhzd6",
  itineraire: "https://www.google.com/maps/dir/?api=1&destination=43.529243,5.4445041",

  /* Horaires affichés sur Google Maps (0 = dimanche). null = fermé.
     ⚠ La fiche Planity indique 9h30-20h (lun-sam) et 10h30-18h30 (dim) :
     à faire confirmer par le salon. */
  hours: {
    0: null,
    1: ["10:00", "19:00"],
    2: ["10:00", "19:00"],
    3: ["10:00", "19:00"],
    4: ["10:00", "19:00"],
    5: ["10:00", "19:00"],
    6: ["10:00", "19:00"]
  },

  /* Carte des prestations (prix Planity). from:true = « à partir de ». */
  menu: [
    {
      id: "semi",
      title: "Semi-permanent mains",
      short: "Le vernis qui tient, sans les dégâts",
      from: 25,
      img: "assets/img/salon/planity-06.jpg",
      items: [
        { n: "Beauté des mains sans vernis", note: "Couper, limer, repousser les cuticules", d: "10 min", p: 15 },
        { n: "Manucure homme", note: "Gommage des cuticules + massage crème, boisson offerte", d: "15 min", p: 20 },
        { n: "Dépose vernis simple", d: "1 min", p: 2 },
        { n: "Dépose semi-permanent", note: "Main ou pied", d: "10 min", p: 10 },
        { n: "Réparation d'un ongle cassé", d: "15 min", p: 5 },
        { n: "Pose semi-permanent, couleur au choix", note: "Dépose non comprise", d: "30 min", p: 25 },
        { n: "Dépose + pose semi-permanent, couleur au choix", d: "40 min", p: 30 },
        { n: "Pose French semi-permanent", note: "Dépose non comprise", d: "35 min", p: 33 },
        { n: "Dépose + pose semi-permanent French", d: "45 min", p: 38 },
        { n: "Dépose faux ongles + pose semi-permanent couleur", d: "45 min", p: 40 },
        { n: "Dépose faux ongles + pose semi-permanent French", d: "1 h", p: 48 }
      ]
    },
    {
      id: "pieds",
      title: "Beauté des pieds",
      short: "Fauteuil massant, bain, gommage, boisson offerte",
      from: 15,
      img: "assets/img/insta/pieds-fleurs.jpg",
      items: [
        { n: "Beauté des pieds simple, sans vernis", note: "Couper, limer, enlever la peau morte autour de l'ongle", d: "15 min", p: 15 },
        { n: "Pose semi-permanent, couleur au choix", note: "Dépose non comprise", d: "20 min", p: 25 },
        { n: "Dépose + pose semi-permanent, couleur au choix", d: "30 min", p: 28 },
        { n: "Pose semi-permanent option French", d: "40 min", p: 33 },
        { n: "Dépose + pose semi-permanent option French", d: "45 min", p: 38 },
        { n: "Dépose faux ongles + pose couleur", d: "45 min", p: 38 },
        { n: "Dépose faux ongles + pose French", d: "1 h", p: 46 },
        { n: "Beauté des pieds, fauteuil massant", note: "Bain, cuticules, coupe et lime, crème, boisson offerte", d: "40 min", p: 40 },
        { n: "Beauté des pieds spa + semi-permanent", note: "Gommage, massage, soin, fauteuil massant, boisson offerte", d: "1 h", p: 55 },
        { n: "Beauté des pieds spa + French semi-permanent", note: "Fauteuil massant, boisson offerte", d: "1 h", p: 63 },
        { n: "Beauté des pieds pour homme", note: "Gommage cuticules + massage crème, fauteuil massant", d: "45 min", p: 45 }
      ]
    },
    {
      id: "resine",
      title: "Faux ongles en résine",
      short: "Rallonges, comblages, nail art sur mesure",
      from: 35,
      img: "assets/img/salon/planity-08.jpg",
      items: [
        { n: "Pose résine sur ongles naturels", note: "Sans capsule, sans couleur", d: "30 min", p: 35 },
        { n: "Rallonge capsule + semi-permanent", d: "45 min", p: 52, from: true },
        { n: "Rallonge capsule + French", d: "1 h", p: 60, from: true },
        { n: "Rallonge capsule baby boomer", d: "1 h", p: 60, from: true },
        { n: "Comblage résine (sans ongle cassé) + semi-permanent", d: "45 min", p: 42, from: true },
        { n: "Comblage résine + French", d: "1 h 15", p: 50, from: true },
        { n: "Comblage résine + baby boomer", d: "50 min", p: 50 },
        { n: "Rallonge chablon + semi-permanent", d: "1 h 30", p: 65 },
        { n: "Rallonge chablon + French", d: "1 h 30", p: 73 },
        { n: "Pose ongles artistique", note: "Nail art sur mesure", d: "1 h 30", p: 80 },
        { n: "Décoration", d: "30 min", p: null, label: "Sur devis" },
        { n: "Rallonge sur 1 doigt", note: "Main ou pied — 7 € si posé ailleurs", d: "10 min", p: 5 },
        { n: "Réparation d'un ongle cassé", note: "7 € si posé ailleurs", d: "15 min", p: 5 },
        { n: "Dépose faux ongles", note: "Résine, gel, porcelaine", d: "20 min", p: 20 }
      ]
    },
    {
      id: "gel",
      title: "Gel Biab & extensions gel",
      short: "Le gel qui renforce l'ongle naturel",
      from: 40,
      img: "assets/img/salon/gel-biab.jpg",
      items: [
        { n: "Pose complète gel Biab, ongles courts", note: "Sans capsule, couleur du gel au choix", d: "40 min", p: 40 },
        { n: "Dépose + pose Biab ongles courts + semi-permanent", d: "1 h", p: 45 },
        { n: "Dépose + pose Biab ongles longs + semi-permanent", d: "1 h 15", p: 50 },
        { n: "Dépose + pose Biab ongles courts à médium", note: "Sans vernis, couleur du gel au choix", d: "50 min", p: 42 },
        { n: "Pose complète gel ongles courts", note: "Sans vernis", d: "50 min", p: 45 },
        { n: "Dépose + pose gel ongles courts + semi-permanent", d: "1 h 15", p: 50 },
        { n: "Pose gel ongles courts + semi-permanent", d: "1 h", p: 52 },
        { n: "Pose complète gel ongles longs", note: "Couleur du gel, sans vernis", d: "1 h", p: 55 },
        { n: "Dépose + pose gel ongles longs + semi-permanent", d: "1 h 15", p: 65 },
        { n: "Pose gel ongles longs + semi-permanent", d: "1 h 10", p: 65 },
        { n: "Pose gel ongles courts + French", d: "1 h 15", p: 68 },
        { n: "Pose gel ongles longs + French", d: "1 h 15", p: 73 },
        { n: "Longueur L, XL", d: "20 min", p: 10 }
      ]
    },
    {
      id: "gelx",
      title: "Gel X, capsules américaines",
      short: "Capsules préfabriquées, mains ou pieds",
      from: 40,
      img: "assets/img/insta/ombre-orange.jpg",
      items: [
        { n: "Pose capsule américaine Gel X + semi-permanent", note: "Couleur au choix", d: "45 min", p: 40 },
        { n: "Dépose + pose capsule Gel X + semi-permanent", d: "1 h", p: 50 },
        { n: "Pose capsule Gel X + semi-permanent French", d: "50 min", p: 48 },
        { n: "Dépose + pose capsule Gel X French", d: "1 h", p: 58 },
        { n: "Dépose de capsule Gel X", d: "20 min", p: 20 }
      ]
    }
  ],

  /* Avis réels (Planity = avis vérifiés après rendez-vous). */
  reviews: [
    { t: "Très bon accueil, à l'écoute, rapide et professionnel.", r: 5, w: "Cliente Planity", d: "août 2026", s: "Planity" },
    { t: "Je recommande vivement ! Le monsieur était très appliqué, un travail soigné, encore merci.", r: 5, w: "Client Planity", d: "août 2026", s: "Planity" },
    { t: "Travail parfait et personnel accueillant, je recommande vraiment !!", r: 5, w: "Cliente Planity", d: "août 2026", s: "Planity" },
    { t: "Niveau prestation au top ! Travaille vite et bien, j'adore, je recommande !", r: 4, w: "Cliente Planity", d: "juillet 2026", s: "Planity" },
    { t: "Je trouve l'équipe sympathique et accueillante. Très bien organisée et propre. Jade a été aux petits soins et sa prestation parfaite.", r: 5, w: "Cliente Planity", d: "juin 2026", s: "Planity" },
    { t: "J'y suis allée pour la beauté des pieds et sincèrement j'ai adoré la prestation ! Et le massage. Ça m'a fait un bien fou. Je recommande !", r: 5, w: "Cliente Planity", d: "mai 2026", s: "Planity" },
    { t: "Tout le monde est adorable et la prestation est plus que réussi. Merci beaucoup pour ces magnifiques ongles !!", r: 5, w: "Florine B.", d: "publié sur Instagram", s: "Instagram" },
    { t: "Manucure soignée. Personne très agréable.", r: 4, w: "Cliente Planity", d: "juillet 2026", s: "Planity" }
  ],

  /* Notes détaillées Planity (sur 5) */
  criteria: [
    ["Accueil", 4.3],
    ["Propreté", 4.2],
    ["Cadre & ambiance", 4.1],
    ["Qualité de la prestation", 4.3]
  ],

  stats: { rating: 4.2, reviews: 123, followers: 1622 }
};
