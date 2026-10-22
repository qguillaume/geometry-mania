/* =======================================================================
   3-FIGURES.JS  —  La boîte à outils du dessinateur.

   C'est le fichier le plus important de l'application : c'est lui qui
   sait tracer un point, un segment, un cercle, un angle droit, le
   codage des côtés égaux... bref, tout le vocabulaire de la géométrie,
   mais en dessin.

   LE FORMAT UTILISÉ : LE SVG
   Un dessin SVG est une suite de traits et de textes décrits par leurs
   coordonnées. Deux avantages énormes :
     - il reste net quelle que soit la taille de l'écran ;
     - ses couleurs viennent du CSS, donc de css/1-couleurs.css.

   LE REPÈRE DU DESSIN
     - x augmente vers la DROITE
     - y augmente vers le BAS  (attention, c'est l'inverse des maths !)
   Pour monter dans le dessin, il faut donc DIMINUER y.

   COMMENT ON S'EN SERT
   Chaque fonction ci-dessous RENVOIE UN BOUT DE TEXTE (du SVG). Un
   exercice en fabrique une liste, et la fonction figure() les colle
   ensemble :

       figure("Un triangle ABC", [
         polygone([A, B, C]),
         point(A, "A"),
         point(B, "B"),
         point(C, "C")
       ])

   L'ORDRE COMPTE : ce qui est écrit en dernier se dessine PAR-DESSUS.
   On trace donc d'abord les surfaces, puis les traits, et les points
   et les noms tout à la fin, pour qu'ils restent bien lisibles.
   ======================================================================= */

"use strict";


/* La taille du dessin, dans ses propres unités (pas en pixels d'écran :
   le navigateur l'agrandit ou le réduit ensuite pour remplir la place
   disponible). */
const FIG_LARGEUR = 420;
const FIG_HAUTEUR = 250;


/* ===================== LA FIGURE COMPLÈTE ============================ */

/* figure(description, elements, legende)

   description : la phrase lue par un lecteur d'écran à la place du
                 dessin. Elle est OBLIGATOIRE : une image sans
                 description n'existe pas pour un enfant malvoyant.
   elements    : la liste des bouts de SVG à empiler.
   legende     : une petite phrase affichée SOUS le dessin (facultatif),
                 par exemple « figure à main levée ». */
function figure(description, elements, legende) {
  return {
    description: description,
    elements: elements,
    legende: legende || ""
  };
}

/* Transforme une figure en HTML prêt à être affiché.
   role="img" et aria-label : pour un lecteur d'écran, le dessin est
   une image, décrite par la phrase. */
function dessinerFigure(fig) {
  let html =
    '<svg class="figure-dessin" viewBox="0 0 ' +
    FIG_LARGEUR + " " + FIG_HAUTEUR +
    '" role="img" aria-label="' + echapper(fig.description) + '">' +
    fig.elements.join("") +
    "</svg>";

  if (fig.legende !== "") {
    html += '<p class="figure-legende">' + fig.legende + "</p>";
  }

  return html;
}


/* ====================== LES OUTILS DE BASE =========================== */

/* Arrondit une coordonnée : inutile d'écrire 123.45678901 dans le
   dessin, un dixième d'unité suffit largement. */
function c(valeur) {
  return Math.round(valeur * 10) / 10;
}

/* Le vecteur unitaire qui va de a vers b : une flèche de longueur 1
   qui indique la direction. On s'en sert pour avancer « un peu » dans
   une direction, sans se soucier de la longueur du segment. */
function direction(a, b) {
  const longueur = distance(a, b);

  if (longueur === 0) {
    return { x: 1, y: 0 }; // sécurité : deux points confondus
  }
  return { x: (b.x - a.x) / longueur, y: (b.y - a.y) / longueur };
}

/* La direction perpendiculaire à [ab] : on fait tourner la flèche d'un
   quart de tour. Pour tourner de 90°, on échange x et y et on change
   un signe. Sert à décaler une étiquette « à côté » d'un segment. */
function perpendiculaire(a, b) {
  const d = direction(a, b);
  return { x: -d.y, y: d.x };
}

/* Avance depuis un point, dans une direction, d'une certaine longueur. */
function avancer(depart, dir, longueur) {
  return P(depart.x + dir.x * longueur, depart.y + dir.y * longueur);
}


/* ========================= LES TRAITS ================================ */

/* Un SEGMENT [AB] : il s'arrête à ses deux extrémités.
   classe vaut "fig-ligne" par défaut (le trait normal), ou
   "fig-forte" (l'élément dont on parle), ou "fig-pointille"
   (un trait de construction). */
function trait(a, b, classe) {
  return (
    '<line class="' + (classe || "fig-ligne") + '" x1="' + c(a.x) +
    '" y1="' + c(a.y) + '" x2="' + c(b.x) + '" y2="' + c(b.y) + '" />'
  );
}

/* Une DROITE (AB) : elle ne s'arrête pas, on la prolonge donc de part
   et d'autre des deux points. C'est la différence de dessin entre une
   droite et un segment, et elle compte : en 6e, savoir distinguer
   [AB], (AB) et [AB) est au programme. */
function droite(a, b, classe, prolongement) {
  const d = direction(a, b);
  const marge = prolongement === undefined ? 42 : prolongement;

  return trait(
    avancer(a, d, -marge),
    avancer(b, d, marge),
    classe
  );
}

/* Une DEMI-DROITE [AB) : elle part de A (elle s'arrête de ce côté) et
   file sans fin de l'autre côté. */
function demiDroite(a, b, classe, prolongement) {
  const d = direction(a, b);
  const marge = prolongement === undefined ? 42 : prolongement;
  return trait(a, avancer(b, d, marge), classe);
}


/* ===================== LES FORMES FERMÉES ============================ */

/* Le CONTOUR d'un polygone : on relie tous les sommets, et le dernier
   revient au premier. */
function polygone(sommets, classe) {
  let points = "";

  for (const sommet of sommets) {
    points += c(sommet.x) + "," + c(sommet.y) + " ";
  }

  return (
    '<polygon class="' + (classe || "fig-ligne") + '" points="' +
    points.trim() + '" />'
  );
}

/* L'INTÉRIEUR colorié d'un polygone. On s'en sert quand on parle de
   son AIRE : la surface est la grandeur dont on parle, il faut donc
   la voir. À tracer AVANT le contour, pour ne pas le recouvrir. */
function surface(sommets) {
  return polygone(sommets, "fig-surface");
}

/* Un CERCLE : seulement le trait rond, sans l'intérieur. */
function cercle(centre, rayon, classe) {
  return (
    '<circle class="' + (classe || "fig-ligne") + '" cx="' + c(centre.x) +
    '" cy="' + c(centre.y) + '" r="' + c(rayon) + '" />'
  );
}

/* Un DISQUE : le cercle ET tout l'intérieur. La différence de
   vocabulaire est au programme : le cercle est le tour, le disque est
   la galette entière. */
function disque(centre, rayon) {
  return (
    '<circle class="fig-surface" cx="' + c(centre.x) + '" cy="' +
    c(centre.y) + '" r="' + c(rayon) + '" />'
  );
}

/* Une ELLIPSE : sert uniquement à dessiner les solides en perspective
   (le dessus d'un cylindre est un cercle vu de biais, donc une
   ellipse). */
function ellipse(centre, rayonX, rayonY, classe) {
  return (
    '<ellipse class="' + (classe || "fig-ligne") + '" cx="' + c(centre.x) +
    '" cy="' + c(centre.y) + '" rx="' + c(rayonX) + '" ry="' + c(rayonY) +
    '" />'
  );
}


/* ===================== LES POINTS ET LES NOMS ======================== */

/* Un POINT : un petit disque plein. fort = true pour celui dont on
   parle (il devient orange ET plus gros). */
function point(p, fort) {
  const rayon = fort ? 7 : 5;
  const classe = fort ? "fig-point-fort" : "fig-point";

  return (
    '<circle class="' + classe + '" cx="' + c(p.x) + '" cy="' + c(p.y) +
    '" r="' + rayon + '" />'
  );
}

/* Le NOM d'un point (A, B, C...), écrit à côté de lui.
   ou : la position du nom par rapport au point. Le quatrième argument
   permet de pousser l'étiquette plus ou moins loin. */
function nom(p, texte, ou, fort) {
  const ecart = 20;
  let x = p.x;
  let y = p.y;

  if (ou === "haut") {
    y = y - ecart;
  } else if (ou === "bas") {
    y = y + ecart + 6;
  } else if (ou === "gauche") {
    x = x - ecart;
    y = y + 6;
  } else if (ou === "droite") {
    x = x + ecart;
    y = y + 6;
  } else if (ou === "haut-gauche") {
    x = x - ecart + 2;
    y = y - ecart + 4;
  } else if (ou === "haut-droite") {
    x = x + ecart - 2;
    y = y - ecart + 4;
  } else if (ou === "bas-gauche") {
    x = x - ecart + 2;
    y = y + ecart + 2;
  } else if (ou === "bas-droite") {
    x = x + ecart - 2;
    y = y + ecart + 2;
  } else {
    y = y - ecart; // par défaut : au-dessus
  }

  const classe = fort ? "fig-nom fig-nom-fort" : "fig-nom";

  return (
    '<text class="' + classe + '" x="' + c(x) + '" y="' + c(y) + '">' +
    echapper(texte) + "</text>"
  );
}

/* Le raccourci le plus utilisé : le point ET son nom d'un seul coup. */
function pointNomme(p, texte, ou, fort) {
  return point(p, fort) + nom(p, texte, ou, fort);
}

/* -----------------------------------------------------------------------
   LE SOMMET D'UN POLYGONE : le point, et son nom placé TOUT SEUL du bon
   côté.

   Pourquoi une fonction à part ? Parce qu'écrire « le nom de A va en
   haut à gauche » ne marche que pour UNE figure. Dès qu'on tourne le
   triangle, le nom se retrouve à l'intérieur, par-dessus les traits.

   Ici, on donne le sommet et ses DEUX VOISINS dans le polygone, et la
   fonction calcule elle-même la direction qui s'éloigne de la figure
   (voir versLExterieur dans 1-outils.js). Le nom est donc toujours
   dehors, quelle que soit la forme.
   ----------------------------------------------------------------------- */
function sommetNomme(sommet, voisin1, voisin2, texte, fort) {
  const place = versLExterieur(sommet, voisin1, voisin2, 27);
  const classe = fort ? "fig-nom fig-nom-fort" : "fig-nom";

  return (
    point(sommet, fort) +
    '<text class="' + classe + '" x="' + c(place.x) + '" y="' +
    c(place.y + 7) + '">' + echapper(texte) + "</text>"
  );
}

/* Un texte libre posé à un endroit du dessin : le nom d'une droite
   (d1), une remarque, un point d'interrogation. */
function texte(p, contenu, classe) {
  return (
    '<text class="' + (classe || "fig-etiquette") + '" x="' + c(p.x) +
    '" y="' + c(p.y) + '">' + echapper(contenu) + "</text>"
  );
}

/* Le nom d'une droite, écrit juste à côté d'elle, un peu au-delà de
   son extrémité : c'est là qu'on l'écrit au tableau. */
function nomDroite(a, b, contenu, decalage) {
  const d = direction(a, b);
  const n = perpendiculaire(a, b);
  const bout = avancer(b, d, 34);
  const place = avancer(bout, n, decalage === undefined ? -14 : decalage);

  return texte(P(place.x, place.y + 5), contenu);
}


/* ================== LE CODAGE D'UNE FIGURE ===========================

   Le codage, c'est le langage secret de la géométrie — sauf qu'il n'a
   rien de secret : il dit sur le dessin ce qu'on sait de la figure.

     - un petit carré dans un coin        : cet angle est droit
     - des petits traits sur deux côtés   : ces côtés ont la MÊME longueur
     - des flèches identiques sur 2 droites : elles sont parallèles

   C'est une information qui ne dépend d'AUCUNE couleur : même imprimé
   en noir et blanc, le codage se lit. D'où son importance ici.
   ===================================================================== */

/* LE PETIT CARRÉ DE L'ANGLE DROIT, dessiné dans le coin formé par les
   deux segments [sommet a] et [sommet b]. */
function angleDroit(sommet, a, b, taille) {
  const t = taille || 16;
  const u = direction(sommet, a);
  const v = direction(sommet, b);

  const p1 = avancer(sommet, u, t);
  const p3 = avancer(sommet, v, t);
  const p2 = P(p1.x + v.x * t, p1.y + v.y * t); // le coin du petit carré

  return (
    '<path class="fig-angle-droit" d="M' + c(p1.x) + " " + c(p1.y) +
    " L" + c(p2.x) + " " + c(p2.y) +
    " L" + c(p3.x) + " " + c(p3.y) + '" />'
  );
}

/* LES PETITS TRAITS DU CODAGE DES LONGUEURS.
   nombre = 1, 2 ou 3 traits. Deux côtés qui portent le MÊME nombre de
   traits ont la même longueur : c'est la règle. */
function codage(a, b, nombre) {
  const centre = milieu(a, b);
  const d = direction(a, b);
  const n = perpendiculaire(a, b);
  const combien = nombre || 1;
  const ecart = 7;      // distance entre deux traits du codage
  const demiHauteur = 8; // longueur d'un petit trait, de part et d'autre

  let dessin = "";

  /* On répartit les traits autour du milieu : un seul tombe pile au
     milieu, deux l'encadrent, trois se répartissent, etc. */
  for (let i = 0; i < combien; i++) {
    const decalage = (i - (combien - 1) / 2) * ecart;
    const base = avancer(centre, d, decalage);

    dessin += trait(
      avancer(base, n, -demiHauteur),
      avancer(base, n, demiHauteur),
      "fig-codage"
    );
  }

  return dessin;
}

/* LE CODAGE DU PARALLÉLISME : une petite flèche « > » posée sur chaque
   droite. Deux droites qui portent la même flèche sont parallèles. */
function codageParallele(a, b, nombre) {
  const centre = milieu(a, b);
  const d = direction(a, b);
  const n = perpendiculaire(a, b);
  const combien = nombre || 1;

  let dessin = "";

  for (let i = 0; i < combien; i++) {
    const base = avancer(centre, d, (i - (combien - 1) / 2) * 9);
    const pointe = avancer(base, d, 6);

    dessin +=
      '<path class="fig-codage" d="M' +
      c(avancer(base, n, -7).x) + " " + c(avancer(base, n, -7).y) +
      " L" + c(pointe.x) + " " + c(pointe.y) +
      " L" + c(avancer(base, n, 7).x) + " " + c(avancer(base, n, 7).y) +
      '" />';
  }

  return dessin;
}

/* L'ARC QUI MARQUE UN ANGLE, avec sa mesure écrite à côté.
   L'angle de sommet S, entre les demi-droites [SA) et [SB). */
function marqueAngle(sommet, a, b, rayon, etiquette) {
  const r = rayon || 30;
  const u = direction(sommet, a);
  const v = direction(sommet, b);

  const debut = avancer(sommet, u, r);
  const fin = avancer(sommet, v, r);

  /* Dans quel sens tourner pour aller de u à v ? Le "produit en croix"
     donne le signe : positif = dans le sens des aiguilles d'une montre
     à l'écran (puisque y descend). SVG appelle ça le "sweep-flag". */
  const croix = u.x * v.y - u.y * v.x;
  const sens = croix > 0 ? 1 : 0;

  let dessin =
    '<path class="fig-angle" d="M' + c(debut.x) + " " + c(debut.y) +
    " A" + r + " " + r + " 0 0 " + sens + " " + c(fin.x) + " " + c(fin.y) +
    '" />';

  /* L'étiquette se place sur la BISSECTRICE, c'est-à-dire pile au
     milieu de l'angle : on additionne les deux directions. */
  if (etiquette) {
    let bx = u.x + v.x;
    let by = u.y + v.y;
    const taille = Math.sqrt(bx * bx + by * by);

    if (taille > 0.001) {
      bx = bx / taille;
      by = by / taille;
    } else {
      bx = 0;
      by = -1;
    }

    const place = P(sommet.x + bx * (r + 22), sommet.y + by * (r + 22) + 6);
    dessin += texte(place, etiquette, "fig-mesure");
  }

  return dessin;
}


/* ===================== LES MESURES ÉCRITES =========================== */

/* Une longueur écrite LE LONG d'un côté, décalée vers l'extérieur pour
   ne pas tomber sur le trait. Un décalage négatif la met de l'autre
   côté du segment. */
function mesure(a, b, contenu, decalage) {
  const centre = milieu(a, b);
  const n = perpendiculaire(a, b);
  const place = avancer(centre, n, decalage === undefined ? 20 : decalage);

  return texte(P(place.x, place.y + 5), contenu, "fig-mesure");
}

/* UNE COTE, comme sur un plan : un trait fin parallèle au côté, fermé
   par deux petites barres, avec la mesure écrite au milieu. On s'en
   sert pour les longueurs d'un rectangle, là où écrire le nombre sur
   le côté lui-même deviendrait illisible. */
function cote(a, b, contenu, decalage) {
  const n = perpendiculaire(a, b);
  const ecart = decalage === undefined ? 22 : decalage;

  const a2 = avancer(a, n, ecart);
  const b2 = avancer(b, n, ecart);

  let dessin = trait(a2, b2, "fig-construction");

  // Les deux petites barres aux extrémités de la cote.
  dessin += trait(avancer(a2, n, -5), avancer(a2, n, 5), "fig-construction");
  dessin += trait(avancer(b2, n, -5), avancer(b2, n, 5), "fig-construction");

  // La mesure, écrite un peu plus loin encore.
  const centre = milieu(a2, b2);
  const place = avancer(centre, n, ecart > 0 ? 14 : -14);
  dessin += texte(P(place.x, place.y + 5), contenu, "fig-mesure");

  return dessin;
}

/* Une FLÈCHE, pour montrer quelque chose du doigt. */
function fleche(depart, arrivee, classe) {
  const d = direction(depart, arrivee);
  const n = perpendiculaire(depart, arrivee);
  const base = avancer(arrivee, d, -12);

  return (
    trait(depart, arrivee, classe || "fig-pointille") +
    '<path class="fig-codage" d="M' +
    c(avancer(base, n, -6).x) + " " + c(avancer(base, n, -6).y) +
    " L" + c(arrivee.x) + " " + c(arrivee.y) +
    " L" + c(avancer(base, n, 6).x) + " " + c(avancer(base, n, 6).y) +
    '" />'
  );
}


/* ======================= LE QUADRILLAGE ==============================

   Le papier quadrillé du cahier. Indispensable pour la symétrie : sans
   carreaux à compter, « le symétrique est à la même distance de l'axe »
   reste une phrase. Avec les carreaux, ça devient vérifiable au doigt.
   ===================================================================== */

function quadrillage(pas, x0, y0, colonnes, lignes) {
  let dessin = "";

  for (let i = 0; i <= colonnes; i++) {
    const x = x0 + i * pas;
    dessin += trait(P(x, y0), P(x, y0 + lignes * pas), "fig-quadrillage");
  }

  for (let j = 0; j <= lignes; j++) {
    const y = y0 + j * pas;
    dessin += trait(P(x0, y), P(x0 + colonnes * pas, y), "fig-quadrillage");
  }

  return dessin;
}


/* ====================== LES SOLIDES EN PERSPECTIVE ===================

   On dessine les solides « en perspective cavalière », comme au
   tableau : les faces cachées sont en POINTILLÉS. C'est cette
   convention qui permet de compter les arêtes et les sommets qu'on ne
   voit pas — exactement ce qu'on demande en 6e.
   ===================================================================== */

/* Un PAVÉ DROIT (une boîte). Si largeur = hauteur = profondeur, c'est
   un CUBE. Le décalage en biais donne l'impression de relief. */
function pave(coin, largeur, hauteur, profondeur) {
  const biaisX = profondeur * 0.55;
  const biaisY = -profondeur * 0.45;

  // Les 4 coins de la face avant.
  const a = coin;                                  // haut gauche
  const b = P(coin.x + largeur, coin.y);           // haut droite
  const d = P(coin.x, coin.y + hauteur);           // bas gauche
  const e = P(coin.x + largeur, coin.y + hauteur); // bas droite

  // Les mêmes, poussés en biais : la face arrière.
  const a2 = P(a.x + biaisX, a.y + biaisY);
  const b2 = P(b.x + biaisX, b.y + biaisY);
  const d2 = P(d.x + biaisX, d.y + biaisY);
  const e2 = P(e.x + biaisX, e.y + biaisY);

  let dessin = "";

  // Les trois arêtes cachées, qui partent du coin arrière-bas-gauche.
  dessin += trait(d2, a2, "fig-construction");
  dessin += trait(d2, e2, "fig-construction");
  dessin += trait(d2, d, "fig-construction");

  // La face avant.
  dessin += polygone([a, b, e, d]);

  // Les arêtes visibles qui filent vers l'arrière, et le dessus.
  dessin += trait(a, a2);
  dessin += trait(b, b2);
  dessin += trait(e, e2);
  dessin += trait(a2, b2);
  dessin += trait(b2, e2);

  return dessin;
}

/* Une PYRAMIDE à base carrée, posée sur sa base. */
function pyramide(centreBase, demiLargeur, hauteur) {
  const profondeur = demiLargeur * 0.6;

  const avantGauche = P(centreBase.x - demiLargeur, centreBase.y);
  const avantDroite = P(centreBase.x + demiLargeur, centreBase.y);
  const arriereGauche = P(centreBase.x - demiLargeur + profondeur,
                          centreBase.y - profondeur * 0.75);
  const arriereDroite = P(centreBase.x + demiLargeur + profondeur,
                          centreBase.y - profondeur * 0.75);
  const sommet = P(centreBase.x + profondeur / 2, centreBase.y - hauteur);

  let dessin = "";

  // Les arêtes cachées partent du coin arrière gauche.
  dessin += trait(arriereGauche, avantGauche, "fig-construction");
  dessin += trait(arriereGauche, arriereDroite, "fig-construction");
  dessin += trait(arriereGauche, sommet, "fig-construction");

  dessin += trait(avantGauche, avantDroite);
  dessin += trait(avantDroite, arriereDroite);
  dessin += trait(avantGauche, sommet);
  dessin += trait(avantDroite, sommet);
  dessin += trait(arriereDroite, sommet);

  return dessin;
}

/* Un PRISME DROIT à base triangulaire, posé sur une face rectangulaire. */
function prisme(coin, largeur, hauteur, profondeur) {
  /* Le décalage est plus marqué que pour le pavé : avec un décalage
     léger, les deux triangles se chevauchent et le dessin se lit comme
     une pyramide. En les écartant franchement, on voit le prisme. */
  const biaisX = profondeur * 1.1;
  const biaisY = -profondeur * 0.6;

  const bas1 = P(coin.x, coin.y + hauteur);
  const bas2 = P(coin.x + largeur, coin.y + hauteur);
  const haut1 = P(coin.x + largeur / 2, coin.y);

  const bas1b = P(bas1.x + biaisX, bas1.y + biaisY);
  const bas2b = P(bas2.x + biaisX, bas2.y + biaisY);
  const haut1b = P(haut1.x + biaisX, haut1.y + biaisY);

  let dessin = "";

  // Le triangle du fond : deux arêtes cachées sur trois.
  dessin += trait(bas1b, bas2b, "fig-construction");
  dessin += trait(bas1b, haut1b, "fig-construction");
  dessin += trait(bas1, bas1b, "fig-construction");

  dessin += polygone([bas1, bas2, haut1]);
  dessin += trait(bas2, bas2b);
  dessin += trait(haut1, haut1b);
  dessin += trait(bas2b, haut1b);

  return dessin;
}

/* Un CYLINDRE : deux ellipses et deux traits. La base du bas n'est vue
   que de l'extérieur : sa moitié arrière est cachée, on la laisse en
   pointillés. */
function cylindre(centreHaut, rayon, hauteur) {
  const rayonY = rayon * 0.35;
  const centreBas = P(centreHaut.x, centreHaut.y + hauteur);

  let dessin = "";

  // La moitié arrière du fond, cachée par le cylindre lui-même.
  dessin +=
    '<path class="fig-construction" d="M' + c(centreBas.x - rayon) + " " +
    c(centreBas.y) + " A" + c(rayon) + " " + c(rayonY) + " 0 0 1 " +
    c(centreBas.x + rayon) + " " + c(centreBas.y) + '" />';

  // La moitié avant du fond, bien visible.
  dessin +=
    '<path class="fig-ligne" d="M' + c(centreBas.x - rayon) + " " +
    c(centreBas.y) + " A" + c(rayon) + " " + c(rayonY) + " 0 0 0 " +
    c(centreBas.x + rayon) + " " + c(centreBas.y) + '" />';

  dessin += trait(P(centreHaut.x - rayon, centreHaut.y),
                  P(centreBas.x - rayon, centreBas.y));
  dessin += trait(P(centreHaut.x + rayon, centreHaut.y),
                  P(centreBas.x + rayon, centreBas.y));

  // Le disque du dessus se voit en entier.
  dessin += ellipse(centreHaut, rayon, rayonY);

  return dessin;
}

/* Un CÔNE : une ellipse pour la base, deux traits qui montent au sommet. */
function cone(centreBase, rayon, hauteur) {
  const rayonY = rayon * 0.35;
  const sommet = P(centreBase.x, centreBase.y - hauteur);

  let dessin = "";

  dessin +=
    '<path class="fig-construction" d="M' + c(centreBase.x - rayon) + " " +
    c(centreBase.y) + " A" + c(rayon) + " " + c(rayonY) + " 0 0 1 " +
    c(centreBase.x + rayon) + " " + c(centreBase.y) + '" />';
  dessin +=
    '<path class="fig-ligne" d="M' + c(centreBase.x - rayon) + " " +
    c(centreBase.y) + " A" + c(rayon) + " " + c(rayonY) + " 0 0 0 " +
    c(centreBase.x + rayon) + " " + c(centreBase.y) + '" />';

  dessin += trait(P(centreBase.x - rayon, centreBase.y), sommet);
  dessin += trait(P(centreBase.x + rayon, centreBase.y), sommet);

  return dessin;
}

/* Une BOULE : un cercle, plus une ellipse en pointillés qui lui donne
   du relief (c'est son « équateur », vu de biais). */
function boule(centre, rayon) {
  return (
    ellipse(centre, rayon, rayon * 0.3, "fig-construction") +
    cercle(centre, rayon)
  );
}
