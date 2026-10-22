/* =======================================================================
   5-EXERCICES-MESURES.JS  —  Les exercices qui CALCULENT.

     genererPerimetre()   -> le tour d'une figure
     genererAire()        -> la surface à l'intérieur
     genererConversions() -> 3,5 m = 350 cm

   La grande difficulté de 6e n'est pas le calcul : c'est de ne pas
   confondre le PÉRIMÈTRE (une longueur, en cm) et l'AIRE (une surface,
   en cm²). L'application insiste donc à chaque fois :
     - pour le périmètre, c'est le CONTOUR qui est mis en valeur ;
     - pour l'aire, c'est l'INTÉRIEUR qui est colorié.

   Tout en bas du fichier se trouve la liste FABRIQUES, qui relie chaque
   bouton de l'application à sa fonction.
   ======================================================================= */

"use strict";


/* -----------------------------------------------------------------------
   DESSINER À L'ÉCHELLE

   Quand on calcule, la figure doit être JUSTE : un rectangle de 8 cm
   sur 3 cm doit être dessiné deux fois et demie plus large que haut.
   Sinon l'enfant apprend à se fier aux nombres sans jamais regarder le
   dessin — et il ne repère plus ses erreurs.

   echelle(largeur, hauteur) renvoie combien de points du dessin valent
   1 cm, pour que la figure remplisse la place sans déborder.
   ----------------------------------------------------------------------- */
function echelle(largeurReelle, hauteurReelle) {
  const placeLargeur = 250;
  const placeHauteur = 130;

  return Math.min(
    placeLargeur / largeurReelle,
    placeHauteur / hauteurReelle
  );
}

/* Les quatre sommets d'un rectangle de L sur l, dessiné à l'échelle et
   centré dans la figure. */
function rectangleSommets(L, l) {
  const u = echelle(L, l);
  const largeur = L * u;
  const hauteur = l * u;
  const x = (FIG_LARGEUR - largeur) / 2;
  const y = (FIG_HAUTEUR - hauteur) / 2 - 5;

  return [
    P(x, y),
    P(x + largeur, y),
    P(x + largeur, y + hauteur),
    P(x, y + hauteur)
  ];
}


/* =======================================================================
   EXERCICE 9 : LE PÉRIMÈTRE

   Le périmètre, c'est la longueur du TOUR de la figure : la longueur de
   la ficelle qu'il faudrait pour en faire le tour.
   ======================================================================= */
function genererPerimetre(niveau) {
  const formes = ["carre", "rectangle"];

  if (niveau !== "facile") {
    formes.push("triangle");
  }
  if (niveau === "costaud") {
    formes.push("cercle");
  }

  const forme = choix(formes);

  if (forme === "carre") {
    return perimetreCarre(niveau);
  }
  if (forme === "triangle") {
    return perimetreTriangle(niveau);
  }
  if (forme === "cercle") {
    return perimetreCercle(niveau);
  }
  return perimetreRectangle(niveau);
}


function perimetreRectangle(niveau) {
  const L = niveau === "facile" ? alea(4, 9) : alea(6, 18);
  const l = niveau === "facile" ? alea(2, 3) : alea(2, L - 2);
  const perimetre = 2 * (L + l);

  const s = rectangleSommets(L, l);
  const dessin =
    polygone(s) +
    cote(s[3], s[2], L + " cm", 24) +
    cote(s[1], s[2], l + " cm", -24);

  return [
    {
      figure: figure(
        "Un rectangle de " + L + " cm de long et " + l + " cm de large.",
        [dessin]
      ),
      explication:
        "Calcule le <strong>périmètre</strong> de ce rectangle. " +
        "<strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure(
        "Le contour du rectangle est mis en valeur.",
        [dessin, polygone(s, "fig-forte")]
      ),
      explication:
        "Le " + cle("périmètre") + ", c'est la longueur du <strong>tour</strong> " +
        "de la figure : la ficelle qu'il faudrait pour en faire le tour."
    },
    {
      figure: figure(
        "Les quatre côtés du rectangle.",
        [dessin, polygone(s, "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("="), entier("L"), operation("+"),
        entier("l"), operation("+"), entier("L"), operation("+"), entier("l")
      ],
      explication:
        "Un rectangle a <strong>deux longueurs</strong> et <strong>deux " +
        "largeurs</strong>. On peut donc écrire plus court : " +
        cle("P = 2 × (L + l)") + "."
    },
    {
      figure: figure(
        "Le périmètre vaut " + perimetre + " centimètres.",
        [dessin, polygone(s, "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("="), entier(2), operation("×"),
        entier("(" + L + " + " + l + ")"), operation("="),
        entier(2), operation("×"), entier(L + l), operation("="),
        entier(perimetre), mot("cm")
      ],
      explication:
        "P = <strong>" + perimetre + " cm</strong>. Le périmètre est une " +
        "<strong>longueur</strong> : son unité est le cm, " +
        cle("sans petit carré") + ".",
      termine: true
    }
  ];
}


function perimetreCarre(niveau) {
  const c = niveau === "facile" ? alea(2, 9) : alea(5, 25);
  const perimetre = 4 * c;

  const s = rectangleSommets(c, c);
  const dessin =
    polygone(s) +
    codage(s[0], s[1], 1) + codage(s[1], s[2], 1) +
    codage(s[2], s[3], 1) + codage(s[3], s[0], 1) +
    cote(s[3], s[2], c + " cm", 24);

  return [
    {
      figure: figure("Un carré de côté " + c + " cm.", [dessin]),
      explication:
        "Calcule le <strong>périmètre</strong> de ce carré. " +
        "<strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure(
        "Les quatre côtés du carré portent le même codage.",
        [dessin, polygone(s, "fig-forte")]
      ),
      explication:
        "Les <strong>quatre</strong> côtés d'un carré ont la " +
        cle("même longueur") + " : le codage le rappelle. Faire le tour, " +
        "c'est donc parcourir 4 fois le même côté."
    },
    {
      figure: figure(
        "Le périmètre vaut " + perimetre + " centimètres.",
        [dessin, polygone(s, "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("="), entier(4), operation("×"), entier(c),
        operation("="), entier(perimetre), mot("cm")
      ],
      explication:
        "P = <strong>" + perimetre + " cm</strong>. À retenir : " +
        cle("P = 4 × côté") + ".",
      termine: true
    }
  ];
}


function perimetreTriangle(niveau) {
  const a = alea(3, 12);
  const b = alea(3, 12);
  const c = alea(Math.max(3, Math.abs(a - b) + 1), a + b - 1);
  const perimetre = a + b + c;

  const A = P(90, 200);
  const B = P(330, 200);
  const C = P(190, 60);

  const dessin =
    polygone([A, B, C]) +
    sommetNomme(A, B, C, "A") +
    sommetNomme(B, A, C, "B") +
    sommetNomme(C, A, B, "C") +
    mesure(A, B, a + " cm", 26) +
    mesure(B, C, b + " cm", 26) +
    mesure(A, C, c + " cm", -26);

  return [
    {
      figure: figure(
        "Un triangle ABC de côtés " + a + " cm, " + b + " cm et " + c + " cm.",
        [dessin],
        "Figure à main levée : les longueurs ne sont pas à l'échelle."
      ),
      explication:
        "Calcule le <strong>périmètre</strong> de ce triangle. " +
        "<strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure(
        "Le contour du triangle est mis en valeur.",
        [dessin, polygone([A, B, C], "fig-forte")],
        "Figure à main levée : les longueurs ne sont pas à l'échelle."
      ),
      explication:
        "Aucune formule à connaître ici : le périmètre d'un triangle, " +
        "c'est simplement <strong>la somme de ses trois côtés</strong>."
    },
    {
      figure: figure(
        "Le périmètre vaut " + perimetre + " centimètres.",
        [dessin, polygone([A, B, C], "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("="), entier(a), operation("+"), entier(b),
        operation("+"), entier(c), operation("="), entier(perimetre),
        mot("cm")
      ],
      explication:
        "P = <strong>" + perimetre + " cm</strong>. On additionne, " +
        "on n'oublie aucun côté, et on écrit l'unité.",
      termine: true
    }
  ];
}


function perimetreCercle(niveau) {
  const rayon = alea(2, 9);
  const diametre = rayon * 2;
  const perimetre = arrondi(PI * diametre, 2);

  const O = P(200, 125);
  const rDessin = 88;
  const A = surLeCercle(O, rDessin, 40);

  const dessin =
    cercle(O, rDessin) + point(O) + nom(O, "O", "bas-gauche") +
    trait(O, A, "fig-construction") + mesure(O, A, rayon + " cm", -20);

  return [
    {
      figure: figure("Un cercle de rayon " + rayon + " cm.", [dessin]),
      explication:
        "Calcule le <strong>périmètre</strong> de ce cercle (on dit aussi " +
        "sa <strong>circonférence</strong>). On prendra π ≈ 3,14."
    },
    {
      figure: figure(
        "Le cercle lui-même est mis en valeur : c'est lui, le périmètre.",
        [dessin, cercle(O, rDessin, "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("="), entier("2"), operation("×"),
        entier("π"), operation("×"), entier("r")
      ],
      explication:
        "La formule : " + cle("P = 2 × π × r") + ". Le nombre " +
        "<strong>π</strong> (« pi ») vaut à peu près 3,14 : c'est le " +
        "nombre de fois que le diamètre tient dans le tour du cercle."
    },
    {
      figure: figure(
        "Le périmètre vaut environ " + nombreFrancais(perimetre) +
        " centimètres.",
        [dessin, cercle(O, rDessin, "fig-forte")]
      ),
      calcul: [
        entier("P"), operation("≈"), entier(2), operation("×"),
        entier("3,14"), operation("×"), entier(rayon), operation("≈"),
        entier(nombreFrancais(perimetre)), mot("cm")
      ],
      explication:
        "P ≈ <strong>" + nombreFrancais(perimetre) + " cm</strong>. " +
        "On écrit <strong>≈</strong> et pas <strong>=</strong> : 3,14 " +
        "n'est qu'une valeur " + cle("approchée") + " de π.",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 10 : L'AIRE

   L'aire, c'est la place occupée À L'INTÉRIEUR : le nombre de petits
   carrés de 1 cm de côté qu'on peut y ranger. D'où l'unité cm², avec
   son petit 2.
   ======================================================================= */
function genererAire(niveau) {
  const formes = ["carre", "rectangle"];

  if (niveau !== "facile") {
    formes.push("triangle");
  }
  if (niveau === "costaud") {
    formes.push("disque");
    formes.push("composee");
  }

  const forme = choix(formes);

  if (forme === "carre") {
    return aireCarre(niveau);
  }
  if (forme === "triangle") {
    return aireTriangle(niveau);
  }
  if (forme === "disque") {
    return aireDisque();
  }
  if (forme === "composee") {
    return aireComposee();
  }
  return aireRectangle(niveau);
}


function aireRectangle(niveau) {
  const L = niveau === "facile" ? alea(3, 8) : alea(5, 15);
  const l = niveau === "facile" ? alea(2, 4) : alea(3, 9);
  const aire = L * l;

  const s = rectangleSommets(L, l);
  const u = echelle(L, l);

  /* Le quadrillage intérieur : UN carré par centimètre carré. C'est
     l'image qui fait comprendre la formule — on peut vraiment compter
     les carreaux. */
  let carreaux = "";

  for (let i = 1; i < L; i++) {
    carreaux += trait(P(s[0].x + i * u, s[0].y), P(s[0].x + i * u, s[3].y),
                      "fig-quadrillage");
  }
  for (let j = 1; j < l; j++) {
    carreaux += trait(P(s[0].x, s[0].y + j * u), P(s[1].x, s[0].y + j * u),
                      "fig-quadrillage");
  }

  const dessin =
    surface(s) + polygone(s) +
    cote(s[3], s[2], L + " cm", 24) +
    cote(s[1], s[2], l + " cm", -24);

  return [
    {
      figure: figure(
        "Un rectangle de " + L + " cm sur " + l + " cm, l'intérieur colorié.",
        [dessin]
      ),
      explication:
        "Calcule l'<strong>aire</strong> de ce rectangle, c'est-à-dire la " +
        "place <strong>à l'intérieur</strong>."
    },
    {
      figure: figure(
        "Le rectangle est découpé en carrés de 1 cm de côté.",
        [surface(s), carreaux, polygone(s),
         cote(s[3], s[2], L + " cm", 24),
         cote(s[1], s[2], l + " cm", -24)]
      ),
      explication:
        "On le découpe en carrés de <strong>1 cm de côté</strong>. " +
        "Chaque carreau vaut <strong>1 cm²</strong> : il suffit de les " +
        "compter. Il y a " + l + " rangée" + (l > 1 ? "s" : "") + " de " +
        L + " carreaux."
    },
    {
      figure: figure(
        "L'aire vaut " + aire + " centimètres carrés.",
        [surface(s), carreaux, polygone(s),
         cote(s[3], s[2], L + " cm", 24),
         cote(s[1], s[2], l + " cm", -24)]
      ),
      calcul: [
        entier("A"), operation("="), entier(L), operation("×"), entier(l),
        operation("="), entier(aire), mot("cm²")
      ],
      explication:
        "A = <strong>" + aire + " cm²</strong>. Inutile de compter un par " +
        "un : " + cle("A = L × l") + ". Et l'unité porte un " +
        cle("petit 2") + ", parce qu'on a multiplié deux longueurs.",
      termine: true
    }
  ];
}


function aireCarre(niveau) {
  const c = niveau === "facile" ? alea(2, 7) : alea(4, 12);
  const aire = c * c;

  const s = rectangleSommets(c, c);
  const u = echelle(c, c);

  let carreaux = "";

  for (let i = 1; i < c; i++) {
    carreaux += trait(P(s[0].x + i * u, s[0].y), P(s[0].x + i * u, s[3].y),
                      "fig-quadrillage");
    carreaux += trait(P(s[0].x, s[0].y + i * u), P(s[1].x, s[0].y + i * u),
                      "fig-quadrillage");
  }

  const dessin =
    surface(s) + polygone(s) +
    codage(s[0], s[1], 1) + codage(s[1], s[2], 1) +
    codage(s[2], s[3], 1) + codage(s[3], s[0], 1) +
    cote(s[3], s[2], c + " cm", 24);

  return [
    {
      figure: figure("Un carré de côté " + c + " cm.", [dessin]),
      explication:
        "Calcule l'<strong>aire</strong> de ce carré. <strong>Clique</strong> " +
        "pour la méthode."
    },
    {
      figure: figure(
        "Le carré est découpé en carreaux de 1 cm de côté.",
        [surface(s), carreaux, polygone(s),
         cote(s[3], s[2], c + " cm", 24)]
      ),
      explication:
        "Un carré est un rectangle dont <strong>les deux côtés sont " +
        "égaux</strong> : il y a " + c + " rangées de " + c + " carreaux."
    },
    {
      figure: figure(
        "L'aire vaut " + aire + " centimètres carrés.",
        [surface(s), carreaux, polygone(s),
         cote(s[3], s[2], c + " cm", 24)]
      ),
      calcul: [
        entier("A"), operation("="), entier(c), operation("×"), entier(c),
        operation("="), entier(aire), mot("cm²")
      ],
      explication:
        "A = <strong>" + aire + " cm²</strong>. À retenir : " +
        cle("A = côté × côté") + ".",
      termine: true
    }
  ];
}


/* --- L'aire d'un triangle rectangle -----------------------------------
   On le montre comme la MOITIÉ d'un rectangle : c'est la seule façon
   de comprendre d'où sort le « ÷ 2 » de la formule. */
function aireTriangle(niveau) {
  const base = niveau === "costaud" ? alea(4, 14) : alea(2, 9);
  // On tire une hauteur telle que le produit soit pair : le résultat
  // tombe alors sur un nombre entier, plus simple à lire en 6e.
  let hauteur = alea(2, 9);

  if ((base * hauteur) % 2 !== 0) {
    hauteur = hauteur + 1;
  }

  const aire = (base * hauteur) / 2;

  const s = rectangleSommets(base, hauteur);
  const A = s[3]; // le coin de l'angle droit (en bas à gauche)
  const B = s[2]; // en bas à droite
  const C = s[0]; // en haut à gauche

  const dessin =
    surface([A, B, C]) + polygone([A, B, C]) +
    angleDroit(A, B, C, 18) +
    cote(A, B, base + " cm", 24) +
    cote(C, A, hauteur + " cm", 24);

  return [
    {
      figure: figure(
        "Un triangle rectangle de base " + base + " cm et de hauteur " +
        hauteur + " cm.",
        [dessin]
      ),
      explication:
        "Calcule l'<strong>aire</strong> de ce triangle rectangle. " +
        "<strong>Clique</strong> pour voir l'astuce."
    },
    {
      figure: figure(
        "Le triangle est la moitié d'un rectangle.",
        [surface([A, B, C]), polygone(s, "fig-pointille"),
         polygone([A, B, C]), angleDroit(A, B, C, 18),
         cote(A, B, base + " cm", 24),
         cote(C, A, hauteur + " cm", 24)]
      ),
      explication:
        "L'astuce : on complète le triangle pour en faire un " +
        cle("rectangle") + " (en pointillés). Le triangle en est " +
        "exactement la <strong>moitié</strong>."
    },
    {
      figure: figure(
        "L'aire du rectangle entier est " + base * hauteur + " cm carrés.",
        [surface([A, B, C]), polygone(s, "fig-pointille"),
         polygone([A, B, C]),
         cote(A, B, base + " cm", 24),
         cote(C, A, hauteur + " cm", 24)]
      ),
      calcul: [
        entier("A"), operation("="),
        fraction(
          [morceau("base × hauteur")],
          [morceau("2")]
        )
      ],
      explication:
        "Le rectangle entier mesure " + base + " × " + hauteur + " = " +
        base * hauteur + " cm². Le triangle, c'est la moitié : on " +
        "<strong>divise par 2</strong>."
    },
    {
      figure: figure(
        "L'aire du triangle vaut " + aire + " centimètres carrés.",
        [surface([A, B, C]), polygone([A, B, C]),
         angleDroit(A, B, C, 18),
         cote(A, B, base + " cm", 24),
         cote(C, A, hauteur + " cm", 24)]
      ),
      calcul: [
        entier("A"), operation("="),
        fraction(
          [morceau(base + " × " + hauteur)],
          [morceau("2")]
        ),
        operation("="),
        fraction([morceau(base * hauteur)], [morceau("2")]),
        operation("="), entier(aire), mot("cm²")
      ],
      explication:
        "A = <strong>" + aire + " cm²</strong>. À retenir : " +
        cle("A = (base × hauteur) ÷ 2") + ".",
      termine: true
    }
  ];
}


function aireDisque() {
  const rayon = alea(2, 9);
  const aire = arrondi(PI * rayon * rayon, 2);

  const O = P(200, 125);
  const rDessin = 88;
  const A = surLeCercle(O, rDessin, 40);

  const dessin =
    disque(O, rDessin) + cercle(O, rDessin) +
    point(O) + nom(O, "O", "bas-gauche") +
    trait(O, A, "fig-construction") + mesure(O, A, rayon + " cm", -20);

  return [
    {
      figure: figure("Un disque de rayon " + rayon + " cm.", [dessin]),
      explication:
        "Calcule l'<strong>aire</strong> de ce disque. On prendra " +
        "π ≈ 3,14."
    },
    {
      figure: figure(
        "C'est bien l'intérieur, le disque, que l'on mesure.",
        [dessin]
      ),
      calcul: [
        entier("A"), operation("="), entier("π"), operation("×"),
        entier("r"), operation("×"), entier("r")
      ],
      explication:
        "Attention au vocabulaire : le " + cle("cercle") + " est le tour, " +
        "le " + cle("disque") + " est l'intérieur. La formule : " +
        "<strong>A = π × r × r</strong>."
    },
    {
      figure: figure(
        "L'aire vaut environ " + nombreFrancais(aire) + " cm carrés.",
        [dessin]
      ),
      calcul: [
        entier("A"), operation("≈"), entier("3,14"), operation("×"),
        entier(rayon), operation("×"), entier(rayon), operation("≈"),
        entier(nombreFrancais(aire)), mot("cm²")
      ],
      explication:
        "A ≈ <strong>" + nombreFrancais(aire) + " cm²</strong>. Le piège " +
        "classique : multiplier par le diamètre. C'est bien le " +
        cle("rayon") + " qui est utilisé, deux fois.",
      termine: true
    }
  ];
}


/* --- L'aire d'une figure composée --------------------------------------
   La vraie question de contrôle : on ne connaît aucune formule pour
   cette figure-là. Il faut la DÉCOUPER en deux rectangles. */
function aireComposee() {
  const largeurHaut = alea(6, 11);
  const hauteurHaut = alea(2, 4);
  const largeurBas = alea(2, largeurHaut - 2);
  const hauteurBas = alea(2, 5);

  const aireHaut = largeurHaut * hauteurHaut;
  const aireBas = largeurBas * hauteurBas;
  const aireTotale = aireHaut + aireBas;

  const u = echelle(largeurHaut, hauteurHaut + hauteurBas);
  const x = (FIG_LARGEUR - largeurHaut * u) / 2;
  const y = (FIG_HAUTEUR - (hauteurHaut + hauteurBas) * u) / 2 - 8;

  // Les six sommets de la figure en forme de L.
  const A = P(x, y);
  const B = P(x + largeurHaut * u, y);
  const C = P(x + largeurHaut * u, y + hauteurHaut * u);
  const D = P(x + largeurBas * u, y + hauteurHaut * u);
  const E = P(x + largeurBas * u, y + (hauteurHaut + hauteurBas) * u);
  const F = P(x, y + (hauteurHaut + hauteurBas) * u);

  // Le point de coupe, à gauche, sur la ligne de séparation.
  const G = P(x, y + hauteurHaut * u);

  const contour = [A, B, C, D, E, F];

  const cotes =
    cote(A, B, largeurHaut + " cm", -22) +
    cote(B, C, hauteurHaut + " cm", -22) +
    cote(F, E, largeurBas + " cm", 22) +
    cote(G, F, hauteurBas + " cm", 22);

  return [
    {
      figure: figure(
        "Une figure en forme de L.",
        [surface(contour), polygone(contour), cotes]
      ),
      explication:
        "Calcule l'<strong>aire</strong> de cette figure. Problème : on " +
        "ne connaît <strong>aucune formule</strong> pour cette forme-là..."
    },
    {
      figure: figure(
        "La figure est découpée en deux rectangles.",
        [surface(contour), polygone(contour), trait(G, D, "fig-pointille"),
         cotes]
      ),
      explication:
        "... alors on la " + cle("découpe") + " ! Un trait, et voilà " +
        "<strong>deux rectangles</strong>, dont on sait tout calculer."
    },
    {
      figure: figure(
        "Le rectangle du haut mesure " + aireHaut + " cm carrés.",
        [surface([A, B, C, G]), polygone(contour),
         trait(G, D, "fig-pointille"), polygone([A, B, C, G], "fig-forte"),
         cotes]
      ),
      calcul: [
        entier(largeurHaut), operation("×"), entier(hauteurHaut),
        operation("="), entier(aireHaut), mot("cm²")
      ],
      explication:
        "Le rectangle du <strong>haut</strong> : " + largeurHaut + " × " +
        hauteurHaut + " = <strong>" + aireHaut + " cm²</strong>."
    },
    {
      figure: figure(
        "Le rectangle du bas mesure " + aireBas + " cm carrés.",
        [surface([G, D, E, F]), polygone(contour),
         trait(G, D, "fig-pointille"), polygone([G, D, E, F], "fig-forte"),
         cotes]
      ),
      calcul: [
        entier(largeurBas), operation("×"), entier(hauteurBas),
        operation("="), entier(aireBas), mot("cm²")
      ],
      explication:
        "Le rectangle du <strong>bas</strong> : " + largeurBas + " × " +
        hauteurBas + " = <strong>" + aireBas + " cm²</strong>."
    },
    {
      figure: figure(
        "L'aire totale vaut " + aireTotale + " cm carrés.",
        [surface(contour), polygone(contour, "fig-forte"), cotes]
      ),
      calcul: [
        entier("A"), operation("="), entier(aireHaut), operation("+"),
        entier(aireBas), operation("="), entier(aireTotale), mot("cm²")
      ],
      explication:
        "On <strong>additionne</strong> les deux morceaux : A = " +
        "<strong>" + aireTotale + " cm²</strong>. Découper, calculer " +
        "chaque bout, additionner : " + cle("c'est toute la méthode") + ".",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 11 : LES CONVERSIONS

   3,5 m = 350 cm. Pas de tableau à retenir par cœur : on compte les
   RANGS à descendre ou à monter, et chaque rang vaut × 10 (ou ÷ 10).
   ======================================================================= */

const UNITES_LONGUEUR = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
const UNITES_AIRE = ["km²", "hm²", "dam²", "m²", "dm²", "cm²", "mm²"];


/* Dessine la rangée des unités, avec la case de départ et la case
   d'arrivée encadrées, et une flèche de l'une à l'autre. */
function rangeeUnites(unites, depart, arrivee, etiquette) {
  const largeurCase = 52;
  const x0 = (FIG_LARGEUR - unites.length * largeurCase) / 2;
  const yTexte = 110;

  let dessin = "";

  for (let i = 0; i < unites.length; i++) {
    const centre = P(x0 + largeurCase * (i + 0.5), yTexte);
    const estChoisie = i === depart || i === arrivee;

    if (estChoisie) {
      const coin1 = P(centre.x - 24, yTexte - 26);
      const coin2 = P(centre.x + 24, yTexte - 26);
      const coin3 = P(centre.x + 24, yTexte + 12);
      const coin4 = P(centre.x - 24, yTexte + 12);
      dessin += polygone([coin1, coin2, coin3, coin4], "fig-forte");
    }

    dessin += texte(centre, unites[i],
                    estChoisie ? "fig-nom fig-nom-fort" : "fig-nom");
  }

  // La flèche qui va du départ à l'arrivée, sous la rangée.
  const yFleche = 172;
  const xDepart = x0 + largeurCase * (depart + 0.5);
  const xArrivee = x0 + largeurCase * (arrivee + 0.5);

  dessin += trait(P(xDepart, 125), P(xDepart, yFleche), "fig-construction");
  dessin += fleche(P(xDepart, yFleche), P(xArrivee, yFleche));
  dessin += trait(P(xArrivee, yFleche), P(xArrivee, 125), "fig-construction");
  dessin += texte(P((xDepart + xArrivee) / 2, yFleche + 30), etiquette,
                  "fig-mesure");

  return dessin;
}


function genererConversions(niveau) {
  if (niveau === "costaud" && piles()) {
    return conversionAire();
  }
  return conversionLongueur(niveau);
}


function conversionLongueur(niveau) {
  /* Facile : on reste autour du mètre et on descend (× 10, × 100).
     Costaud : on peut aussi remonter (÷ 10, ÷ 100). */
  let depart;
  let rangs;

  if (niveau === "facile") {
    depart = alea(3, 4);              // m ou dm
    rangs = alea(1, 2);               // on descend de 1 ou 2 rangs
  } else if (niveau === "moyen") {
    depart = alea(1, 4);
    rangs = alea(1, 3);
  } else {
    depart = alea(0, 6);
    rangs = alea(-3, 3);
  }

  // On garde l'arrivée dans la rangée, et on interdit « 0 rang ».
  let arrivee = depart + rangs;

  if (arrivee < 0) {
    arrivee = 0;
  }
  if (arrivee > 6) {
    arrivee = 6;
  }
  if (arrivee === depart) {
    arrivee = depart < 6 ? depart + 1 : depart - 1;
  }

  const ecart = arrivee - depart;
  const onDescend = ecart > 0;
  const nombreDeRangs = Math.abs(ecart);
  const facteur = Math.pow(10, nombreDeRangs);

  /* La valeur de départ. Quand on DESCEND, un nombre décimal est plus
     intéressant qu'un entier : c'est justement là que les élèves se
     trompent (3,5 m, et non 3 m).

     Quand on REMONTE, on tire au contraire un multiple du facteur :
     sinon on obtiendrait 0,0007 km, un résultat que personne n'écrit
     jamais en 6e. */
  let valeur;

  if (onDescend) {
    valeur = piles() ? alea(1, 60) / 10 : alea(2, 90);
  } else {
    valeur = alea(2, 9) * facteur;
  }

  const resultat = onDescend ? valeur * facteur : valeur / facteur;

  const etiquette = (onDescend ? "× " : "÷ ") + facteur;

  const depuis = UNITES_LONGUEUR[depart];
  const vers = UNITES_LONGUEUR[arrivee];

  const dessin = rangeeUnites(UNITES_LONGUEUR, depart, arrivee, etiquette);
  const dessinSansFleche = rangeeUnites(UNITES_LONGUEUR, depart, arrivee, "?");

  return [
    {
      figure: figure(
        "La rangée des unités de longueur, de km à mm.",
        [dessinSansFleche]
      ),
      calcul: [
        entier(nombreFrancais(valeur)), mot(depuis), operation("="),
        entier("?"), mot(vers)
      ],
      explication:
        "Convertis <strong>" + nombreFrancais(valeur) + " " + depuis +
        "</strong> en " + vers + ". <strong>Clique</strong> pour compter " +
        "les rangs."
    },
    {
      figure: figure(
        "Une flèche va de " + depuis + " à " + vers + " : " + etiquette + ".",
        [dessin]
      ),
      explication:
        "De " + depuis + " à " + vers + ", il y a <strong>" +
        nombreDeRangs + " rang" + (nombreDeRangs > 1 ? "s" : "") +
        "</strong> à " + (onDescend ? "descendre" : "remonter") +
        ". Chaque rang vaut " + (onDescend ? "× 10" : "÷ 10") + ", donc " +
        "en tout : " + cle(etiquette) + "."
    },
    {
      figure: figure(
        "Le résultat : " + nombreFrancais(resultat) + " " + vers + ".",
        [dessin]
      ),
      calcul: [
        entier(nombreFrancais(valeur)), mot(depuis), operation("="),
        entier(nombreFrancais(resultat)), mot(vers)
      ],
      explication:
        "<strong>" + nombreFrancais(valeur) + " " + depuis + " = " +
        nombreFrancais(resultat) + " " + vers + "</strong>. Le bon " +
        "réflexe : une unité <strong>plus petite</strong> donne un " +
        "nombre <strong>plus grand</strong>, et inversement.",
      termine: true
    }
  ];
}


/* --- Les aires : chaque rang vaut 100, et pas 10 -----------------------
   C'est l'erreur la plus fréquente de toute la 6e. Un carré de 1 m de
   côté contient 100 × 100 = 10 000 carrés de 1 cm. */
function conversionAire() {
  const depart = alea(2, 4);          // dam², m² ou dm²
  const arrivee = depart + alea(1, 2);
  const nombreDeRangs = arrivee - depart;
  const facteur = Math.pow(100, nombreDeRangs);

  const valeur = alea(2, 25);
  const resultat = valeur * facteur;

  const depuis = UNITES_AIRE[depart];
  const vers = UNITES_AIRE[arrivee];
  const etiquette = "× " + facteur;

  const dessin = rangeeUnites(UNITES_AIRE, depart, arrivee, etiquette);

  return [
    {
      figure: figure(
        "La rangée des unités d'aire, de km² à mm².",
        [rangeeUnites(UNITES_AIRE, depart, arrivee, "?")]
      ),
      calcul: [
        entier(valeur), mot(depuis), operation("="), entier("?"), mot(vers)
      ],
      explication:
        "Convertis <strong>" + valeur + " " + depuis + "</strong> en " +
        vers + ". Attention : les aires ne se convertissent " +
        cle("pas comme les longueurs") + "."
    },
    {
      figure: figure(
        "Un carré de 1 unité de côté contient 100 carrés de l'unité d'en dessous.",
        [rangeeUnites(UNITES_AIRE, depart, arrivee, "?"),
         texte(P(210, 232), "1 rang = × 10 × 10 = × 100", "fig-mesure")]
      ),
      explication:
        "Dans un carré, il y a <strong>deux</strong> longueurs. Si chacune " +
        "est multipliée par 10, l'aire est multipliée par <strong>10 × 10 " +
        "= 100</strong>. Un seul rang vaut donc " + cle("× 100") + "."
    },
    {
      figure: figure(
        "Le résultat : " + resultat + " " + vers + ".",
        [dessin]
      ),
      calcul: [
        entier(valeur), mot(depuis), operation("="), entier(resultat),
        mot(vers)
      ],
      explication:
        "<strong>" + valeur + " " + depuis + " = " + resultat + " " + vers +
        "</strong>. " + nombreDeRangs + " rang" +
        (nombreDeRangs > 1 ? "s" : "") + ", donc " + etiquette + ".",
      termine: true
    }
  ];
}


/* =======================================================================
   LA LISTE DES FABRIQUES

   Chaque nom de mode (celui écrit dans data-mode, dans index.html) est
   relié à la fonction qui sait fabriquer cet exercice.

   POUR AJOUTER UN NOUVEL EXERCICE, il suffit de :
     1. écrire une fonction genererMachin(niveau),
     2. ajouter une ligne ici,
     3. ajouter un bouton data-mode="machin" dans index.html.
   Le mode "Mélange" le prendra en compte tout seul.
   ======================================================================= */
const FABRIQUES = {
  vocabulaire: genererVocabulaire,
  droites: genererDroites,
  cercle: genererCercle,
  angles: genererAngles,
  triangles: genererTriangles,
  quadrilateres: genererQuadrilateres,
  symetrie: genererSymetrie,
  solides: genererSolides,
  perimetre: genererPerimetre,
  aire: genererAire,
  conversions: genererConversions
};
