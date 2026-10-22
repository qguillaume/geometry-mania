/* =======================================================================
   4-EXERCICES-FIGURES.JS  —  Les exercices qui parlent des FIGURES.

   Huit familles, qui suivent le programme de 6e :

     genererVocabulaire()    -> point, segment [AB], droite (AB), milieu
     genererDroites()        -> perpendiculaires, parallèles, médiatrice
     genererCercle()         -> centre, rayon, diamètre, corde
     genererAngles()         -> nommer, reconnaître, mesurer
     genererTriangles()      -> isocèle, équilatéral, rectangle
     genererQuadrilateres()  -> carré, rectangle, losange, parallélogramme
     genererSymetrie()       -> axe de symétrie, symétrique d'un point
     genererSolides()        -> faces, arêtes, sommets, volume

   Les exercices de MESURE (périmètre, aire, conversions) sont dans le
   fichier suivant, 5-exercices-mesures.js.

   CHACUNE RENVOIE UNE LISTE D'ÉTAPES. Une étape ressemble à ceci :

     {
       figure: figure("...", [ ...les traits à dessiner... ]),
       calcul: [ ...les boîtes de la formule... ],   (facultatif)
       explication: "la phrase affichée sous le dessin",
       termine: true                                 (dernière étape)
     }

   Un clic sur la carte = on passe à l'étape suivante de la liste.
   La figure CHANGE d'une étape à l'autre : c'est tout l'intérêt. On
   redessine la même figure en mettant en avant l'élément dont on parle.

   Le "niveau" ("facile", "moyen" ou "costaud") choisit des questions
   plus ou moins exigeantes, et des nombres plus ou moins gros.
   ======================================================================= */

"use strict";


/* Un raccourci très utilisé : met un mot en valeur dans une phrase
   d'explication (orange, gras, souligné en pointillés). */
function cle(texte) {
  return '<span class="mot-cle">' + texte + "</span>";
}


/* =======================================================================
   EXERCICE 1 : LE VOCABULAIRE ET LES NOTATIONS

   C'est la base de tout : si « [AB] » et « (AB) » se ressemblent, rien
   ne peut suivre. Quatre questions possibles, tirées au sort.
   ======================================================================= */
function genererVocabulaire(niveau) {
  const questions = ["notation", "milieu"];

  if (niveau !== "facile") {
    questions.push("appartenance");
  }
  if (niveau === "costaud") {
    questions.push("alignement");
  }

  const question = choix(questions);

  if (question === "notation") {
    return vocabulaireNotation();
  }
  if (question === "appartenance") {
    return vocabulaireAppartenance();
  }
  if (question === "alignement") {
    return vocabulaireAlignement();
  }
  return vocabulaireMilieu(niveau);
}


/* --- Segment, droite ou demi-droite ? ---------------------------------
   Les trois objets se dessinent presque pareil. La SEULE différence est
   ce qui se passe aux extrémités : le segment s'arrête des deux côtés,
   la demi-droite d'un seul, la droite jamais. */
function vocabulaireNotation() {
  const A = P(100, 175);
  const B = P(320, 95);

  const sorte = choix(["segment", "droite", "demiDroite"]);

  let traitSimple;
  let traitFort;
  let notation;
  let nomObjet;
  let pourquoi;

  if (sorte === "segment") {
    traitSimple = trait(A, B);
    traitFort = trait(A, B, "fig-forte");
    notation = "[AB]";
    nomObjet = "segment";
    pourquoi =
      "Le trait <strong>s'arrête aux deux points</strong> : c'est un " +
      cle("segment") + ". On écrit un crochet de chaque côté.";
  } else if (sorte === "droite") {
    traitSimple = droite(A, B);
    traitFort = droite(A, B, "fig-forte");
    notation = "(AB)";
    nomObjet = "droite";
    pourquoi =
      "Le trait <strong>dépasse des deux côtés</strong> et ne s'arrête " +
      "jamais : c'est une " + cle("droite") + ". On écrit des parenthèses.";
  } else {
    traitSimple = demiDroite(A, B);
    traitFort = demiDroite(A, B, "fig-forte");
    notation = "[AB)";
    nomObjet = "demi-droite";
    pourquoi =
      "Le trait <strong>part de A</strong> et ne s'arrête plus après B : " +
      "c'est une " + cle("demi-droite") + ". Crochet du côté où ça " +
      "s'arrête, parenthèse du côté où ça continue.";
  }

  const noms = pointNomme(A, "A", "bas-gauche") + pointNomme(B, "B", "haut-droite");

  return [
    {
      figure: figure(
        "Deux points A et B reliés par un trait.",
        [traitSimple, noms]
      ),
      explication:
        "Comment note-t-on cet objet ? <strong>Clique</strong> pour " +
        "regarder les extrémités."
    },
    {
      figure: figure(
        "Le trait est mis en valeur entre A et B.",
        [traitFort, noms]
      ),
      explication: pourquoi
    },
    {
      figure: figure(
        "Le " + nomObjet + " " + notation + ".",
        [traitFort, noms]
      ),
      calcul: [entier(notation)],
      explication:
        "On lit : « le " + nomObjet + " " + notation + " ». " +
        "Attention, " + cle("[AB]") + ", " + cle("(AB)") + " et " +
        cle("[AB)") + " ne désignent pas la même chose !",
      termine: true
    }
  ];
}


/* --- Le point appartient-il à la droite ? ------------------------------
   Le symbole ∈ se lit « appartient à ». C'est le premier symbole
   d'ensemble rencontré au collège. */
function vocabulaireAppartenance() {
  const A = P(70, 190);
  const B = P(350, 80);

  // C est pris SUR la droite : on avance de 65 % du chemin de A vers B.
  const C = P(A.x + 0.65 * (B.x - A.x), A.y + 0.65 * (B.y - A.y));
  const D = P(140, 70);

  const laDroite = droite(A, B);
  const lesNoms =
    pointNomme(A, "A", "bas-gauche") +
    pointNomme(B, "B", "haut-droite") +
    nomDroite(A, B, "(AB)");

  return [
    {
      figure: figure(
        "La droite (AB), le point C posé dessus et le point D à côté.",
        [laDroite, lesNoms, pointNomme(C, "C", "bas-droite"),
         pointNomme(D, "D", "haut")]
      ),
      explication:
        "Que peut-on écrire pour le point <strong>C</strong>, et pour le " +
        "point <strong>D</strong> ? <strong>Clique</strong> pour la suite."
    },
    {
      figure: figure(
        "Le point C est sur la droite (AB).",
        [laDroite, lesNoms, pointNomme(C, "C", "bas-droite", true),
         pointNomme(D, "D", "haut")]
      ),
      calcul: [entier("C"), operation("∈"), entier("(AB)")],
      explication:
        "C est <strong>posé sur</strong> la droite : on écrit C ∈ (AB), " +
        "et on lit « C " + cle("appartient à") + " la droite AB »."
    },
    {
      figure: figure(
        "Le point D n'est pas sur la droite (AB).",
        [laDroite, lesNoms, pointNomme(C, "C", "bas-droite"),
         pointNomme(D, "D", "haut", true)]
      ),
      calcul: [entier("D"), operation("∉"), entier("(AB)")],
      explication:
        "D est <strong>à côté</strong> de la droite : on écrit D ∉ (AB). " +
        "La barre sur le symbole veut dire « n'appartient pas ».",
      termine: true
    }
  ];
}


/* --- Ces trois points sont-ils alignés ? -------------------------------
   Seule façon de répondre : poser la règle. L'application fait pareil,
   en traçant la droite qui passe par les deux points extrêmes. */
function vocabulaireAlignement() {
  const alignes = piles();

  const A = P(70, 195);
  const C = P(350, 65);
  // B est sur [AC] ... ou décalé de 22 vers le bas si on veut un piège.
  const B = P(210, alignes ? 130 : 160);

  const lesPoints =
    pointNomme(A, "A", "bas-gauche") +
    pointNomme(B, "B", alignes ? "haut-gauche" : "bas") +
    pointNomme(C, "C", "haut-droite");

  const laRegle = droite(A, C, "fig-pointille");

  return [
    {
      figure: figure("Trois points A, B et C.", [lesPoints]),
      explication:
        "Les points A, B et C sont-ils <strong>alignés</strong> ? " +
        "À l'œil, on ne peut pas le savoir : <strong>clique</strong> pour " +
        "poser la règle."
    },
    {
      figure: figure(
        "Une droite en pointillés passe par A et C.",
        [laRegle, lesPoints]
      ),
      explication:
        "On trace la droite (AC), comme on poserait la règle sur A et C. " +
        "Reste à regarder <strong>où tombe B</strong>."
    },
    {
      figure: figure(
        alignes
          ? "Le point B est sur la droite (AC)."
          : "Le point B est à côté de la droite (AC).",
        [laRegle, lesPoints, point(B, true)]
      ),
      calcul: alignes
        ? [entier("alignés")]
        : [entier("non alignés")],
      explication: alignes
        ? "B est <strong>sur</strong> la droite (AC) : les trois points " +
          "sont " + cle("alignés") + ". On peut écrire B ∈ (AC)."
        : "B est <strong>à côté</strong> de la droite (AC) : les trois " +
          "points ne sont " + cle("pas alignés") + ".",
      termine: true
    }
  ];
}


/* --- Le milieu d'un segment -------------------------------------------
   Deux questions dans une : la longueur d'une moitié, ou la longueur
   totale. La deuxième est nettement plus difficile. */
function vocabulaireMilieu(niveau) {
  // On tire une longueur PAIRE, pour que la moitié tombe juste.
  const moitie = niveau === "facile" ? alea(2, 8) : alea(4, 15);
  const total = moitie * 2;

  const A = P(70, 150);
  const B = P(350, 150);
  const M = milieu(A, B);

  const onDonneLeTotal = niveau !== "costaud" || piles();

  const base =
    trait(A, B) +
    pointNomme(A, "A", "bas") +
    pointNomme(B, "B", "bas") +
    pointNomme(M, "M", "bas", true);

  const avecCodage = base + codage(A, M, 1) + codage(M, B, 1);

  if (onDonneLeTotal) {
    return [
      {
        figure: figure(
          "Le segment [AB] et son milieu M.",
          [base, cote(A, B, total + " cm", -30)]
        ),
        explication:
          "M est le " + cle("milieu") + " de [AB], et AB = <strong>" +
          total + " cm</strong>. Combien mesure AM ?"
      },
      {
        figure: figure(
          "Les deux moitiés du segment portent le même codage.",
          [avecCodage, cote(A, B, total + " cm", -30)]
        ),
        explication:
          "Le milieu coupe le segment en <strong>deux morceaux de même " +
          "longueur</strong> : c'est ce que disent les deux petits traits " +
          "du codage. Il suffit donc de partager en 2."
      },
      {
        figure: figure(
          "AM mesure " + moitie + " cm.",
          [avecCodage, cote(A, M, moitie + " cm", 30),
           cote(A, B, total + " cm", -30)]
        ),
        calcul: [
          entier("AM"), operation("="), entier(total), operation("÷"),
          entier(2), operation("="), entier(moitie), mot("cm")
        ],
        explication:
          "AM = MB = <strong>" + moitie + " cm</strong>. Et bien sûr, " +
          moitie + " + " + moitie + " = " + total + " : on retombe sur AB.",
        termine: true
      }
    ];
  }

  // Version plus difficile : on connaît la moitié, on cherche le tout.
  return [
    {
      figure: figure(
        "Le segment [AB], son milieu M, et AM = " + moitie + " cm.",
        [base, cote(A, M, moitie + " cm", 30)]
      ),
      explication:
        "M est le " + cle("milieu") + " de [AB], et AM = <strong>" +
        moitie + " cm</strong>. Combien mesure AB ?"
    },
    {
      figure: figure(
        "Les deux moitiés sont égales : MB mesure aussi " + moitie + " cm.",
        [avecCodage, cote(A, M, moitie + " cm", 30),
         cote(M, B, moitie + " cm", 30)]
      ),
      explication:
        "Si M est le milieu, alors <strong>MB = AM</strong> = " + moitie +
        " cm. Le segment entier, c'est les deux morceaux mis bout à bout."
    },
    {
      figure: figure(
        "AB mesure " + total + " cm.",
        [avecCodage, cote(A, B, total + " cm", -32)]
      ),
      calcul: [
        entier("AB"), operation("="), entier(moitie), operation("×"),
        entier(2), operation("="), entier(total), mot("cm")
      ],
      explication:
        "AB = <strong>" + total + " cm</strong>. Le piège serait de " +
        "répondre " + moitie + " : on cherchait le segment " + cle("entier") +
        ".",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 2 : LES DROITES PERPENDICULAIRES ET PARALLÈLES

   Au programme de 6e, avec les deux propriétés qui servent toute
   l'année (et encore en 5e, en 4e...).
   ======================================================================= */
function genererDroites(niveau) {
  const questions = ["reconnaitre", "mediatrice"];

  if (niveau !== "facile") {
    questions.push("proprieteParallele");
  }
  if (niveau === "costaud") {
    questions.push("proprieteTransitive");
  }

  const question = choix(questions);

  if (question === "reconnaitre") {
    return droitesReconnaitre();
  }
  if (question === "proprieteParallele") {
    return droitesProprieteParallele();
  }
  if (question === "proprieteTransitive") {
    return droitesProprieteTransitive();
  }
  return droitesMediatrice();
}


/* --- Perpendiculaires ou parallèles ? --------------------------------- */
function droitesReconnaitre() {
  const perpendiculaires = piles();

  let dessin;
  let dessinFort;
  let notation;
  let nomRelation;
  let phrase;

  if (perpendiculaires) {
    const A = P(50, 150);
    const B = P(370, 150);
    const C = P(220, 40);
    const D = P(220, 215);
    const croisement = P(220, 150);

    dessin =
      droite(A, B) + droite(C, D) +
      texte(P(330, 136), "(d1)") + texte(P(250, 48), "(d2)");
    dessinFort = dessin + angleDroit(croisement, B, C, 20);

    notation = "(d1) ⊥ (d2)";
    nomRelation = "perpendiculaires";
    phrase =
      "Les deux droites se croisent en formant un " + cle("angle droit") +
      " : le petit carré le dit. Elles sont perpendiculaires.";
  } else {
    const A = P(50, 95);
    const B = P(370, 95);
    const C = P(50, 185);
    const D = P(370, 185);

    dessin =
      droite(A, B) + droite(C, D) +
      texte(P(345, 78), "(d1)") + texte(P(345, 168), "(d2)");
    dessinFort =
      dessin + codageParallele(A, B, 1) + codageParallele(C, D, 1);

    notation = "(d1) // (d2)";
    nomRelation = "parallèles";
    phrase =
      "Les deux droites gardent <strong>toujours le même écart</strong> : " +
      "elles ne se croiseront jamais, même prolongées très loin. Elles " +
      "sont " + cle("parallèles") + ". Les flèches du codage le disent.";
  }

  return [
    {
      figure: figure("Deux droites (d1) et (d2).", [dessin]),
      explication:
        "Quelle est la position de ces deux droites l'une par rapport à " +
        "l'autre ? <strong>Clique</strong> pour le codage."
    },
    {
      figure: figure("Le codage apparaît sur la figure.", [dessinFort]),
      explication: phrase
    },
    {
      figure: figure("Les droites sont " + nomRelation + ".", [dessinFort]),
      calcul: [entier(notation)],
      explication:
        "On écrit <strong>" + notation + "</strong>, et on lit « (d1) est " +
        nomRelation.slice(0, -1) + " à (d2) ».",
      termine: true
    }
  ];
}


/* --- La propriété : perpendiculaire à l'une, perpendiculaire à l'autre -
   Si deux droites sont parallèles, toute droite perpendiculaire à l'une
   est perpendiculaire à l'autre. C'est LA propriété qui permet de
   tracer des parallèles à l'équerre. */
function droitesProprieteParallele() {
  const d1Gauche = P(50, 85);
  const d1Droite = P(370, 85);
  const d2Gauche = P(50, 190);
  const d2Droite = P(370, 190);
  const d3Haut = P(235, 40);
  const d3Bas = P(235, 230);

  const croisement1 = P(235, 85);
  const croisement2 = P(235, 190);

  const base =
    droite(d1Gauche, d1Droite) +
    droite(d2Gauche, d2Droite) +
    droite(d3Haut, d3Bas) +
    codageParallele(d1Gauche, P(160, 85), 1) +
    codageParallele(d2Gauche, P(160, 190), 1) +
    texte(P(345, 70), "(d1)") + texte(P(345, 175), "(d2)") +
    texte(P(268, 46), "(d3)");

  const angleHaut = angleDroit(croisement1, d1Droite, d3Haut, 18);
  const angleBas = angleDroit(croisement2, d2Droite, d3Bas, 18);

  return [
    {
      figure: figure(
        "Les droites (d1) et (d2) sont parallèles ; (d3) coupe (d1) à angle droit.",
        [base, angleHaut]
      ),
      explication:
        "On sait que <strong>(d1) // (d2)</strong> et que <strong>(d3) ⊥ " +
        "(d1)</strong>. Que peut-on dire de (d3) et (d2) ?"
    },
    {
      figure: figure(
        "Les deux droites parallèles sont mises en valeur.",
        [base, angleHaut,
         droite(d1Gauche, d1Droite, "fig-forte"),
         droite(d2Gauche, d2Droite, "fig-forte")]
      ),
      explication:
        "(d1) et (d2) sont parallèles : elles ont exactement la " +
        "<strong>même direction</strong>. Une droite qui tombe droit sur " +
        "l'une tombe donc droit sur l'autre."
    },
    {
      figure: figure(
        "(d3) coupe aussi (d2) à angle droit.",
        [base, angleHaut, angleBas,
         droite(d3Haut, d3Bas, "fig-forte")]
      ),
      calcul: [entier("(d3)"), operation("⊥"), entier("(d2)")],
      explication:
        "Donc <strong>(d3) ⊥ (d2)</strong>. C'est la " + cle("propriété") +
        " : si deux droites sont parallèles, toute perpendiculaire à " +
        "l'une est perpendiculaire à l'autre.",
      termine: true
    }
  ];
}


/* --- La propriété : parallèle à la même droite ------------------------ */
function droitesProprieteTransitive() {
  const hauteurs = [70, 140, 210];
  const gauche = 55;
  const droiteX = 350;

  let base = "";

  for (let i = 0; i < 3; i++) {
    const a = P(gauche, hauteurs[i]);
    const b = P(droiteX, hauteurs[i]);
    base += droite(a, b);
    base += codageParallele(P(130, hauteurs[i]), P(190, hauteurs[i]), 1);
    base += texte(P(330, hauteurs[i] - 14), "(d" + (i + 1) + ")");
  }

  function ligneForte(i) {
    return droite(P(gauche, hauteurs[i]), P(droiteX, hauteurs[i]),
                  "fig-forte");
  }

  return [
    {
      figure: figure("Trois droites parallèles (d1), (d2) et (d3).", [base]),
      explication:
        "On sait que <strong>(d1) // (d2)</strong> et que <strong>(d2) // " +
        "(d3)</strong>. Que peut-on dire de (d1) et (d3) ?"
    },
    {
      figure: figure(
        "(d1) et (d2) sont mises en valeur, puis (d2) et (d3).",
        [base, ligneForte(0), ligneForte(1)]
      ),
      explication:
        "(d1) a la même direction que (d2)... et (d2) a la même direction " +
        "que (d3). Les trois ont donc <strong>la même direction</strong>."
    },
    {
      figure: figure(
        "(d1) et (d3) sont parallèles.",
        [base, ligneForte(0), ligneForte(2)]
      ),
      calcul: [entier("(d1)"), operation("//"), entier("(d3)")],
      explication:
        "Donc <strong>(d1) // (d3)</strong>. " + cle("Propriété") + " : " +
        "deux droites parallèles à une même troisième sont parallèles " +
        "entre elles.",
      termine: true
    }
  ];
}


/* --- La médiatrice ---------------------------------------------------- */
function droitesMediatrice() {
  const A = P(110, 175);
  const B = P(310, 175);
  const M = milieu(A, B);
  const hautAxe = P(210, 45);
  const basAxe = P(210, 230);

  // Un point quelconque de la médiatrice, pour la propriété.
  const K = P(210, 80);

  const base =
    trait(A, B) +
    pointNomme(A, "A", "bas-gauche") +
    pointNomme(B, "B", "bas-droite");

  const axe = droite(hautAxe, basAxe, "fig-forte");
  const marques = codage(A, M, 1) + codage(M, B, 1) +
                  angleDroit(M, B, hautAxe, 18);

  return [
    {
      figure: figure(
        "Le segment [AB] et une droite qui le coupe en son milieu.",
        [base, droite(hautAxe, basAxe, "fig-ligne"),
         pointNomme(M, "M", "bas-droite")]
      ),
      explication:
        "Cette droite passe par le <strong>milieu</strong> de [AB] et le " +
        "coupe à <strong>angle droit</strong>. Comment s'appelle-t-elle ?"
    },
    {
      figure: figure(
        "Le codage montre le milieu et l'angle droit.",
        [base, axe, marques, pointNomme(M, "M", "bas-droite", true)]
      ),
      calcul: [entier("médiatrice")],
      explication:
        "C'est la " + cle("médiatrice") + " du segment [AB] : la droite " +
        "<strong>perpendiculaire</strong> à [AB] qui passe par son " +
        "<strong>milieu</strong>. Les deux conditions comptent."
    },
    {
      figure: figure(
        "Un point K de la médiatrice est à égale distance de A et de B.",
        [base, axe, marques, pointNomme(M, "M", "bas-droite"),
         trait(K, A, "fig-pointille"), trait(K, B, "fig-pointille"),
         pointNomme(K, "K", "haut-droite", true),
         codage(K, A, 2), codage(K, B, 2)]
      ),
      calcul: [entier("KA"), operation("="), entier("KB")],
      explication:
        "Et voilà à quoi elle sert : <strong>tout point de la médiatrice " +
        "est à la même distance de A et de B</strong>. Ici KA = KB — les " +
        "deux petits traits doubles le disent.",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 3 : LE CERCLE

   Centre, rayon, diamètre, corde. Et le piège classique : le rayon est
   un SEGMENT, mais aussi la LONGUEUR de ce segment.
   ======================================================================= */
function genererCercle(niveau) {
  const questions = ["vocabulaire", "rayonDiametre"];

  if (niveau === "costaud") {
    questions.push("position");
  }

  const question = choix(questions);

  if (question === "vocabulaire") {
    return cercleVocabulaire();
  }
  if (question === "position") {
    return cerclePosition();
  }
  return cercleRayonDiametre(niveau);
}


function cercleVocabulaire() {
  const O = P(195, 130);
  const r = 82;

  const A = surLeCercle(O, r, 55);                 // l'extrémité d'un rayon
  const B = surLeCercle(O, r, 180);                // un bout du diamètre
  const C = surLeCercle(O, r, 0);                  // l'autre bout
  const D = surLeCercle(O, r, 250);                // une corde
  const E = surLeCercle(O, r, 310);

  const base =
    cercle(O, r) +
    point(O) + nom(O, "O", "haut-gauche") +
    pointNomme(A, "A", "haut-droite") +
    pointNomme(B, "B", "gauche") +
    pointNomme(C, "C", "droite") +
    pointNomme(D, "D", "bas-gauche") +
    pointNomme(E, "E", "bas-droite");

  return [
    {
      figure: figure(
        "Un cercle de centre O, avec les points A, B, C, D et E.",
        [base]
      ),
      explication:
        "Un cercle de <strong>centre O</strong>. <strong>Clique</strong> " +
        "pour revoir le nom de chacun de ses segments."
    },
    {
      figure: figure(
        "Le segment [OA] relie le centre au cercle : c'est un rayon.",
        [base, trait(O, A, "fig-forte")]
      ),
      calcul: [entier("[OA]"), mot("rayon")],
      explication:
        "[OA] va du <strong>centre</strong> jusqu'au cercle : c'est un " +
        cle("rayon") + ". Tous les rayons d'un même cercle ont la même " +
        "longueur."
    },
    {
      figure: figure(
        "Le segment [BC] traverse le cercle en passant par O : c'est un diamètre.",
        [base, trait(B, C, "fig-forte")]
      ),
      calcul: [entier("[BC]"), mot("diamètre")],
      explication:
        "[BC] traverse le cercle <strong>en passant par le centre</strong> : " +
        "c'est un " + cle("diamètre") + ". Il vaut deux rayons mis bout à " +
        "bout."
    },
    {
      figure: figure(
        "Le segment [DE] relie deux points du cercle sans passer par O.",
        [base, trait(D, E, "fig-forte")]
      ),
      calcul: [entier("[DE]"), mot("corde")],
      explication:
        "[DE] relie deux points du cercle, mais <strong>ne passe pas par " +
        "le centre</strong> : c'est une " + cle("corde") + ". Le diamètre " +
        "est la plus grande corde possible.",
      termine: true
    }
  ];
}


function cercleRayonDiametre(niveau) {
  const O = P(195, 128);
  const rDessin = 85;

  const rayon = niveau === "facile" ? alea(2, 9) : alea(10, 45);
  const diametre = rayon * 2;
  const onDonneLeRayon = piles();

  const A = surLeCercle(O, rDessin, 35);
  const B = surLeCercle(O, rDessin, 215);

  const base = cercle(O, rDessin) + point(O) + nom(O, "O", "bas-gauche");

  if (onDonneLeRayon) {
    return [
      {
        figure: figure(
          "Un cercle de centre O et de rayon " + rayon + " cm.",
          [base, trait(O, A, "fig-forte"), mesure(O, A, rayon + " cm", -22),
           pointNomme(A, "A", "haut-droite")]
        ),
        explication:
          "Ce cercle a pour rayon <strong>" + rayon + " cm</strong>. " +
          "Combien mesure son diamètre ?"
      },
      {
        figure: figure(
          "Le diamètre est formé de deux rayons bout à bout.",
          [base, trait(B, O, "fig-forte"), trait(O, A, "fig-forte"),
           codage(O, A, 1), codage(O, B, 1),
           pointNomme(A, "A", "haut-droite"),
           pointNomme(B, "B", "bas-gauche")]
        ),
        explication:
          "Un diamètre, c'est <strong>deux rayons</strong> mis bout à " +
          "bout : [BO] et [OA] ont la même longueur."
      },
      {
        figure: figure(
          "Le diamètre mesure " + diametre + " cm.",
          [base, trait(B, A, "fig-forte"),
           mesure(B, A, diametre + " cm", -22),
           pointNomme(A, "A", "haut-droite"),
           pointNomme(B, "B", "bas-gauche")]
        ),
        calcul: [
          entier("d"), operation("="), entier(rayon), operation("×"),
          entier(2), operation("="), entier(diametre), mot("cm")
        ],
        explication:
          "Le diamètre mesure <strong>" + diametre + " cm</strong>. " +
          "À retenir : " + cle("d = 2 × r") + ".",
        termine: true
      }
    ];
  }

  return [
    {
      figure: figure(
        "Un cercle de centre O et de diamètre " + diametre + " cm.",
        [base, trait(B, A, "fig-forte"),
         mesure(B, A, diametre + " cm", -22),
         pointNomme(A, "A", "haut-droite"),
         pointNomme(B, "B", "bas-gauche")]
      ),
      explication:
        "Ce cercle a pour diamètre <strong>" + diametre + " cm</strong>. " +
        "Combien mesure son rayon ?"
    },
    {
      figure: figure(
        "Le diamètre est coupé en deux par le centre.",
        [base, trait(B, O, "fig-forte"), trait(O, A, "fig-forte"),
         codage(O, A, 1), codage(O, B, 1),
         pointNomme(A, "A", "haut-droite"),
         pointNomme(B, "B", "bas-gauche")]
      ),
      explication:
        "Le centre O est le <strong>milieu</strong> du diamètre : il le " +
        "partage en deux rayons égaux. Il faut donc diviser par 2."
    },
    {
      figure: figure(
        "Le rayon mesure " + rayon + " cm.",
        [base, trait(O, A, "fig-forte"), mesure(O, A, rayon + " cm", -22),
         pointNomme(A, "A", "haut-droite")]
      ),
      calcul: [
        entier("r"), operation("="), entier(diametre), operation("÷"),
        entier(2), operation("="), entier(rayon), mot("cm")
      ],
      explication:
        "Le rayon mesure <strong>" + rayon + " cm</strong>. " +
        "À retenir : " + cle("r = d ÷ 2") + ".",
      termine: true
    }
  ];
}


/* --- Le point est-il dans le cercle, dessus, ou dehors ? --------------- */
function cerclePosition() {
  const rayon = alea(3, 7);
  const ecart = choix([-2, -1, 0, 1, 2]);
  const distanceOM = rayon + ecart;

  const O = P(185, 128);
  const rDessin = 80;
  // On place M à la bonne distance, à l'échelle du dessin.
  const M = surLeCercle(O, (rDessin * distanceOM) / rayon, 35);

  const A = surLeCercle(O, rDessin, 160);

  const base =
    cercle(O, rDessin) + point(O) + nom(O, "O", "bas-gauche") +
    trait(O, A, "fig-ligne") + mesure(O, A, rayon + " cm", -20);

  let reponse;
  let phrase;

  if (ecart === 0) {
    reponse = "M est sur le cercle";
    phrase =
      "OM est <strong>égal</strong> au rayon : M est " + cle("sur") +
      " le cercle.";
  } else if (ecart < 0) {
    reponse = "M est à l'intérieur";
    phrase =
      "OM est <strong>plus petit</strong> que le rayon : M est " +
      cle("à l'intérieur") + " du disque.";
  } else {
    reponse = "M est à l'extérieur";
    phrase =
      "OM est <strong>plus grand</strong> que le rayon : M est " +
      cle("à l'extérieur") + " du cercle.";
  }

  const signe = ecart === 0 ? "=" : ecart < 0 ? "<" : ">";

  return [
    {
      figure: figure(
        "Un cercle de centre O et de rayon " + rayon +
        " cm, et un point M tel que OM = " + distanceOM + " cm.",
        [base, pointNomme(M, "M", "haut-droite")]
      ),
      explication:
        "Le cercle a un rayon de <strong>" + rayon + " cm</strong>, et " +
        "<strong>OM = " + distanceOM + " cm</strong>. Où se trouve M ?"
    },
    {
      figure: figure(
        "On compare la distance OM au rayon.",
        [base, trait(O, M, "fig-forte"), mesure(O, M, distanceOM + " cm", -20),
         pointNomme(M, "M", "haut-droite", true)]
      ),
      calcul: [
        entier("OM"), operation(signe), entier("r"), mot("c'est-à-dire"),
        entier(distanceOM), operation(signe), entier(rayon)
      ],
      explication:
        "Pour savoir où est un point, on compare sa distance au centre " +
        "avec le <strong>rayon</strong>. Ici " + distanceOM + " " + signe +
        " " + rayon + "."
    },
    {
      figure: figure(
        reponse + ".",
        [base, trait(O, M, "fig-forte"),
         pointNomme(M, "M", "haut-droite", true)]
      ),
      calcul: [entier(reponse)],
      explication: phrase,
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 4 : LES ANGLES

   Nommer un angle, puis reconnaître sa nature. Le repère de tout, c'est
   l'angle droit : 90°.
   ======================================================================= */
function genererAngles(niveau) {
  const questions = ["nature", "nommer"];

  if (niveau === "costaud") {
    questions.push("plat");
  }

  const question = choix(questions);

  if (question === "nommer") {
    return anglesNommer();
  }
  if (question === "plat") {
    return anglesPlat();
  }
  return anglesNature(niveau);
}


/* Dessine un angle de sommet S, dont un côté part à l'horizontale vers
   la droite et l'autre monte de "degres". Renvoie les morceaux utiles. */
function angleDessine(degres) {
  const longueur = 158;
  const S = P(200, 205);
  const A = P(S.x + longueur, S.y);
  const B = surLeCercle(S, longueur, degres);

  /* Où écrire le nom de B ? Si le côté monte vers la droite, le nom va
     à droite ; s'il part vers la gauche, le nom passe de l'autre côté,
     sinon il tomberait sur le trait. */
  let placeB = "haut-droite";

  if (degres > 110) {
    placeB = "haut-gauche";
  } else if (degres > 75) {
    placeB = "haut";
  }

  return {
    S: S,
    A: A,
    B: B,
    traits:
      demiDroite(S, A, "fig-ligne", 12) + demiDroite(S, B, "fig-ligne", 12) +
      pointNomme(S, "S", "bas-gauche") +
      pointNomme(A, "A", "bas-droite") +
      pointNomme(B, "B", placeB)
  };
}


function anglesNature(niveau) {
  /* On évite les mesures trop proches de 90° : à 88°, même un adulte
     hésite à l'œil, et ce n'est pas ce qu'on travaille ici. */
  const sortes = ["aigu", "droit", "obtus"];
  const sorte = choix(niveau === "facile" ? ["aigu", "droit"] : sortes);

  let degres;

  if (sorte === "aigu") {
    degres = alea(25, 70);
  } else if (sorte === "droit") {
    degres = 90;
  } else {
    degres = alea(105, 160);
  }

  const a = angleDessine(degres);

  const marque =
    sorte === "droit"
      ? angleDroit(a.S, a.A, a.B, 26)
      : marqueAngle(a.S, a.A, a.B, 46, degres + "°");

  // Le repère de l'angle droit, tracé en pointillés pour comparer.
  const repere = demiDroite(a.S, P(a.S.x, a.S.y - 180), "fig-construction", 6);

  let phrase;
  let nomNature;

  if (sorte === "aigu") {
    nomNature = "angle aigu";
    phrase =
      "Il est <strong>plus fermé</strong> que l'angle droit : " + degres +
      "° < 90°. C'est un " + cle("angle aigu") + ".";
  } else if (sorte === "droit") {
    nomNature = "angle droit";
    phrase =
      "Il tombe <strong>pile</strong> sur l'angle droit : 90°. C'est un " +
      cle("angle droit") + ", et on le code avec un petit carré.";
  } else {
    nomNature = "angle obtus";
    phrase =
      "Il est <strong>plus ouvert</strong> que l'angle droit : " + degres +
      "° > 90°. C'est un " + cle("angle obtus") + ".";
  }

  return [
    {
      figure: figure(
        "Un angle de sommet S, de côtés [SA) et [SB).",
        [a.traits]
      ),
      explication:
        "Quelle est la <strong>nature</strong> de cet angle ? " +
        "<strong>Clique</strong> pour le comparer à l'angle droit."
    },
    {
      figure: figure(
        "L'angle droit est tracé en pointillés pour comparer.",
        [a.traits, repere, marque]
      ),
      explication:
        "On place le repère : l'<strong>angle droit</strong> (90°), en " +
        "pointillés. Tout se compare à lui."
    },
    {
      figure: figure(
        "C'est un " + nomNature + ".",
        [a.traits, marque]
      ),
      calcul: [entier(nomNature)],
      explication: phrase,
      termine: true
    }
  ];
}


function anglesNommer() {
  const degres = alea(35, 125);
  const a = angleDessine(degres);

  return [
    {
      figure: figure(
        "Un angle de sommet S, de côtés [SA) et [SB).",
        [a.traits, marqueAngle(a.S, a.A, a.B, 46)]
      ),
      explication:
        "Comment <strong>nomme-t-on</strong> cet angle ? " +
        "<strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure(
        "Le sommet de l'angle est le point S.",
        [a.traits, marqueAngle(a.S, a.A, a.B, 46),
         point(a.S, true), nom(a.S, "S", "bas-gauche", true)]
      ),
      explication:
        "Le point où les deux côtés se rejoignent est le " + cle("sommet") +
        " : ici <strong>S</strong>. Il s'écrit toujours " +
        "<strong>au milieu</strong> du nom."
    },
    {
      figure: figure(
        "L'angle se nomme ASB.",
        [a.traits, marqueAngle(a.S, a.A, a.B, 46)]
      ),
      calcul: [entier("ASB")],
      explication:
        "On écrit l'angle <strong>ASB</strong> (avec un petit chapeau " +
        "au-dessus dans le cahier). On aurait aussi pu écrire BSA : " +
        "l'important, c'est que le " + cle("sommet soit au milieu") + ".",
      termine: true
    }
  ];
}


/* --- Deux angles qui forment un angle plat ---------------------------- */
function anglesPlat() {
  const connu = alea(25, 155);
  const cherche = 180 - connu;

  const S = P(210, 185);
  const A = P(380, 185);
  const B = P(40, 185);
  const C = surLeCercle(S, 155, connu);

  const base =
    trait(B, A) +
    trait(S, C) +
    pointNomme(S, "S", "bas") +
    pointNomme(A, "A", "bas-droite") +
    pointNomme(B, "B", "bas-gauche") +
    pointNomme(C, "C", "haut");

  return [
    {
      figure: figure(
        "Les points B, S et A sont alignés, et [SC) part du point S.",
        [base, marqueAngle(S, A, C, 42, connu + "°"),
         marqueAngle(S, C, B, 62, "?")]
      ),
      explication:
        "B, S et A sont <strong>alignés</strong>, et l'angle ASC mesure " +
        "<strong>" + connu + "°</strong>. Combien mesure l'angle CSB ?"
    },
    {
      figure: figure(
        "L'angle BSA est un angle plat : il mesure 180°.",
        [base, trait(B, A, "fig-forte"),
         marqueAngle(S, A, B, 78, "180°")]
      ),
      explication:
        "B, S et A alignés : l'angle BSA est un " + cle("angle plat") +
        ", il mesure <strong>180°</strong>. Les deux angles ensemble le " +
        "remplissent entièrement."
    },
    {
      figure: figure(
        "L'angle CSB mesure " + cherche + " degrés.",
        [base, marqueAngle(S, A, C, 42, connu + "°"),
         marqueAngle(S, C, B, 62, cherche + "°")]
      ),
      calcul: [
        entier(180), operation("−"), entier(connu), operation("="),
        entier(cherche), mot("degrés")
      ],
      explication:
        "L'angle CSB mesure <strong>" + cherche + "°</strong>. " +
        "On dit que les deux angles sont " + cle("supplémentaires") + " : " +
        "leur somme fait 180°.",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 5 : LES TRIANGLES PARTICULIERS

   On ne demande PAS de mesurer : on apprend à LIRE LE CODAGE. C'est
   exactement ce qui est attendu en 6e, et c'est ce qui bloque le plus
   souvent.
   ======================================================================= */
function genererTriangles(niveau) {
  if (niveau !== "facile" && piles()) {
    return triangleIsocelePropriete();
  }
  return triangleNature(niveau);
}


function triangleNature(niveau) {
  const sortes =
    niveau === "facile"
      ? ["isocele", "equilateral", "rectangle"]
      : ["isocele", "equilateral", "rectangle", "rectangleIsocele",
         "quelconque"];

  const sorte = choix(sortes);

  let A;
  let B;
  let C;
  let marques = "";
  let indice;
  let conclusion;
  let nomTriangle;

  if (sorte === "isocele") {
    A = P(210, 50);
    B = P(110, 200);
    C = P(310, 200);
    marques = codage(A, B, 1) + codage(A, C, 1);
    nomTriangle = "triangle isocèle en A";
    indice =
      "[AB] et [AC] portent <strong>le même codage</strong> : ils ont " +
      "donc la même longueur.";
    conclusion =
      "Deux côtés égaux : c'est un " + cle("triangle isocèle") + ". Le " +
      "sommet où ils se rejoignent, A, est le <strong>sommet " +
      "principal</strong> ; le côté d'en face, [BC], est la " +
      "<strong>base</strong>.";
  } else if (sorte === "equilateral") {
    const centre = P(210, 135);
    A = P(210, 40);
    B = tourner(A, centre, 120);
    C = tourner(A, centre, 240);
    marques = codage(A, B, 1) + codage(B, C, 1) + codage(C, A, 1);
    nomTriangle = "triangle équilatéral";
    indice =
      "Les <strong>trois</strong> côtés portent le même codage : ils ont " +
      "tous les trois la même longueur.";
    conclusion =
      "Trois côtés égaux : c'est un " + cle("triangle équilatéral") +
      ". C'est aussi un triangle isocèle... mais trois fois à la fois !";
  } else if (sorte === "rectangle") {
    A = P(110, 200);
    B = P(340, 200);
    C = P(110, 70);
    marques = angleDroit(A, B, C, 20);
    nomTriangle = "triangle rectangle en A";
    indice =
      "Le <strong>petit carré</strong> au sommet A signale un angle droit.";
    conclusion =
      "Un angle droit : c'est un " + cle("triangle rectangle") + " en A. " +
      "Le côté d'en face, [BC], s'appelle l'<strong>hypoténuse</strong> : " +
      "c'est toujours le plus long.";
  } else if (sorte === "rectangleIsocele") {
    A = P(130, 205);
    B = P(290, 205);
    C = P(130, 45);
    marques = angleDroit(A, B, C, 20) + codage(A, B, 1) + codage(A, C, 1);
    nomTriangle = "triangle rectangle isocèle en A";
    indice =
      "Il y a <strong>deux</strong> informations : un petit carré en A, " +
      "et deux côtés au même codage.";
    conclusion =
      "Les deux à la fois : c'est un " + cle("triangle rectangle isocèle") +
      " en A. Rien n'interdit à un triangle d'être les deux.";
  } else {
    A = P(80, 195);
    B = P(345, 165);
    C = P(240, 55);
    nomTriangle = "triangle quelconque";
    indice =
      "Aucun petit carré, aucun codage de longueur : la figure ne dit " +
      "<strong>rien de spécial</strong>.";
    conclusion =
      "Pas de codage, donc rien à en déduire : c'est un " +
      cle("triangle quelconque") + ". Attention au piège : ce n'est pas " +
      "parce que deux côtés <em>ont l'air</em> égaux qu'ils le sont.";
  }

  const base =
    polygone([A, B, C]) +
    sommetNomme(A, B, C, "A") +
    sommetNomme(B, A, C, "B") +
    sommetNomme(C, A, B, "C");

  return [
    {
      figure: figure("Un triangle ABC.", [base + marques]),
      explication:
        "Quelle est la <strong>nature</strong> de ce triangle ? " +
        "<strong>Clique</strong> pour lire le codage."
    },
    {
      figure: figure("Le codage du triangle est mis en valeur.",
                     [base + marques]),
      explication: indice
    },
    {
      figure: figure("C'est un " + nomTriangle + ".", [base + marques]),
      calcul: [entier(nomTriangle)],
      explication: conclusion,
      termine: true
    }
  ];
}


/* --- La propriété du triangle isocèle ---------------------------------
   Si on connaît un côté, on connaît l'autre. C'est ce qui permet de
   calculer un périmètre à partir de deux nombres seulement. */
function triangleIsocelePropriete() {
  const coteEgal = alea(4, 12);
  const base = alea(3, 9);

  const A = P(210, 50);
  const B = P(110, 200);
  const C = P(310, 200);

  const dessin =
    polygone([A, B, C]) +
    sommetNomme(A, B, C, "A") +
    sommetNomme(B, A, C, "B") +
    sommetNomme(C, A, B, "C") +
    codage(A, B, 1) + codage(A, C, 1);

  return [
    {
      figure: figure(
        "Un triangle isocèle en A, avec AB = " + coteEgal + " cm.",
        [dessin, mesure(A, B, coteEgal + " cm", 26),
         mesure(B, C, base + " cm", 26)]
      ),
      explication:
        "ABC est isocèle en A, AB = <strong>" + coteEgal + " cm</strong> et " +
        "BC = <strong>" + base + " cm</strong>. Combien mesure AC ?"
    },
    {
      figure: figure(
        "Les deux côtés [AB] et [AC] portent le même codage.",
        [dessin, trait(A, B, "fig-forte"), trait(A, C, "fig-forte"),
         codage(A, B, 1), codage(A, C, 1),
         mesure(A, B, coteEgal + " cm", 26)]
      ),
      explication:
        "« Isocèle en A » veut dire que les deux côtés qui " +
        "<strong>partent de A</strong> ont la même longueur : AB = AC."
    },
    {
      figure: figure(
        "AC mesure aussi " + coteEgal + " cm.",
        [dessin, mesure(A, B, coteEgal + " cm", 26),
         mesure(A, C, coteEgal + " cm", -26),
         mesure(B, C, base + " cm", 26)]
      ),
      calcul: [entier("AC"), operation("="), entier(coteEgal), mot("cm")],
      explication:
        "AC = <strong>" + coteEgal + " cm</strong>. Le piège : répondre " +
        base + " cm. Mais [BC] est la " + cle("base") + ", pas un des " +
        "deux côtés égaux.",
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 6 : LES QUADRILATÈRES PARTICULIERS
   ======================================================================= */
function genererQuadrilateres(niveau) {
  if (niveau === "costaud" && piles()) {
    return quadrilatereDiagonales();
  }
  return quadrilatereNature(niveau);
}


/* Les quatre quadrilatères du programme, avec leurs sommets et leur
   codage. Écrits une seule fois ici, deux exercices s'en servent. */
function formeQuadrilatere(sorte) {
  let sommets;
  let marques = "";
  let nomForme;
  let indice;
  let proprietes;

  if (sorte === "carre") {
    sommets = [P(135, 55), P(275, 55), P(275, 195), P(135, 195)];
    nomForme = "carré";
    indice =
      "Quatre <strong>angles droits</strong> et quatre côtés au " +
      "<strong>même codage</strong>.";
    proprietes =
      "C'est un " + cle("carré") + " : 4 angles droits ET 4 côtés égaux. " +
      "Il est à la fois rectangle et losange.";
  } else if (sorte === "rectangle") {
    sommets = [P(85, 70), P(335, 70), P(335, 190), P(85, 190)];
    nomForme = "rectangle";
    indice =
      "Quatre <strong>angles droits</strong>, mais les côtés n'ont pas " +
      "tous le même codage : les longueurs vont deux par deux.";
    proprietes =
      "C'est un " + cle("rectangle") + " : 4 angles droits, et les côtés " +
      "opposés égaux deux à deux.";
  } else if (sorte === "losange") {
    sommets = [P(100, 128), P(210, 58), P(320, 128), P(210, 198)];
    nomForme = "losange";
    indice =
      "Les quatre côtés portent le <strong>même codage</strong>, mais " +
      "aucun petit carré : les angles ne sont pas droits.";
    proprietes =
      "C'est un " + cle("losange") + " : 4 côtés égaux. Ses côtés opposés " +
      "sont parallèles, mais ses angles ne sont pas droits.";
  } else {
    sommets = [P(80, 195), P(240, 195), P(340, 80), P(180, 80)];
    nomForme = "parallélogramme";
    indice =
      "Les côtés <strong>opposés</strong> sont parallèles : ils portent " +
      "les mêmes flèches, une simple et une double.";
    proprietes =
      "C'est un " + cle("parallélogramme") + " : les côtés opposés sont " +
      "parallèles deux à deux (et du coup de même longueur).";
  }

  const A = sommets[0];
  const B = sommets[1];
  const C = sommets[2];
  const D = sommets[3];

  if (sorte === "carre") {
    marques =
      codage(A, B, 1) + codage(B, C, 1) + codage(C, D, 1) + codage(D, A, 1) +
      angleDroit(A, B, D, 16) + angleDroit(B, C, A, 16) +
      angleDroit(C, D, B, 16) + angleDroit(D, A, C, 16);
  } else if (sorte === "rectangle") {
    marques =
      codage(A, B, 1) + codage(C, D, 1) + codage(B, C, 2) + codage(D, A, 2) +
      angleDroit(A, B, D, 16) + angleDroit(B, C, A, 16) +
      angleDroit(C, D, B, 16) + angleDroit(D, A, C, 16);
  } else if (sorte === "losange") {
    marques =
      codage(A, B, 1) + codage(B, C, 1) + codage(C, D, 1) + codage(D, A, 1);
  } else {
    marques =
      codageParallele(A, B, 1) + codageParallele(D, C, 1) +
      codageParallele(B, C, 2) + codageParallele(A, D, 2);
  }

  const dessin =
    polygone(sommets) +
    sommetNomme(A, B, D, "A") +
    sommetNomme(B, A, C, "B") +
    sommetNomme(C, B, D, "C") +
    sommetNomme(D, A, C, "D");

  return {
    sommets: sommets,
    dessin: dessin,
    marques: marques,
    nom: nomForme,
    indice: indice,
    proprietes: proprietes
  };
}


function quadrilatereNature(niveau) {
  const sortes =
    niveau === "facile"
      ? ["carre", "rectangle"]
      : ["carre", "rectangle", "losange", "parallelogramme"];

  const q = formeQuadrilatere(choix(sortes));

  return [
    {
      figure: figure("Un quadrilatère ABCD.", [q.dessin + q.marques]),
      explication:
        "Quelle est la <strong>nature</strong> de ce quadrilatère ? " +
        "<strong>Clique</strong> pour lire le codage."
    },
    {
      figure: figure("Le codage du quadrilatère est mis en valeur.",
                     [q.dessin + q.marques]),
      explication: q.indice
    },
    {
      figure: figure("C'est un " + q.nom + ".", [q.dessin + q.marques]),
      calcul: [entier(q.nom)],
      explication: q.proprietes,
      termine: true
    }
  ];
}


/* --- Que sait-on des diagonales ? -------------------------------------
   La question qui revient en contrôle, et qui distingue vraiment le
   rectangle du losange. */
function quadrilatereDiagonales() {
  const sorte = choix(["carre", "rectangle", "losange"]);
  const q = formeQuadrilatere(sorte);

  const A = q.sommets[0];
  const B = q.sommets[1];
  const C = q.sommets[2];
  const D = q.sommets[3];
  const centre = milieu(A, C);

  let marquesDiagonales;
  let conclusion;

  if (sorte === "rectangle") {
    marquesDiagonales = codage(A, centre, 1) + codage(centre, C, 1) +
                        codage(B, centre, 1) + codage(centre, D, 1);
    conclusion =
      "Dans un " + cle("rectangle") + ", les diagonales ont la " +
      "<strong>même longueur</strong> et se coupent en leur " +
      "<strong>milieu</strong>. Mais elles ne sont pas perpendiculaires.";
  } else if (sorte === "losange") {
    marquesDiagonales = angleDroit(centre, C, B, 15);
    conclusion =
      "Dans un " + cle("losange") + ", les diagonales sont " +
      "<strong>perpendiculaires</strong> et se coupent en leur " +
      "<strong>milieu</strong>. Mais elles n'ont pas la même longueur.";
  } else {
    marquesDiagonales = angleDroit(centre, C, B, 15) +
                        codage(A, centre, 1) + codage(centre, C, 1) +
                        codage(B, centre, 1) + codage(centre, D, 1);
    conclusion =
      "Dans un " + cle("carré") + ", les diagonales ont <strong>tout</strong> " +
      "à la fois : même longueur, perpendiculaires, et elles se coupent " +
      "en leur milieu. Normal : le carré est rectangle ET losange.";
  }

  return [
    {
      figure: figure("Un " + q.nom + " ABCD.", [q.dessin + q.marques]),
      explication:
        "ABCD est un <strong>" + q.nom + "</strong>. Que peut-on dire de " +
        "ses <strong>diagonales</strong> ?"
    },
    {
      figure: figure(
        "Les deux diagonales [AC] et [BD] sont tracées.",
        [q.dessin, trait(A, C, "fig-forte"), trait(B, D, "fig-forte"),
         point(centre, true)]
      ),
      explication:
        "Les " + cle("diagonales") + " relient les sommets opposés : " +
        "[AC] et [BD]. Elles se croisent au centre de la figure."
    },
    {
      figure: figure(
        "Le codage des diagonales apparaît.",
        [q.dessin, trait(A, C, "fig-forte"), trait(B, D, "fig-forte"),
         marquesDiagonales, point(centre, true)]
      ),
      explication: conclusion,
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 7 : LA SYMÉTRIE AXIALE

   Sur du papier quadrillé : on COMPTE les carreaux. Sans carreaux,
   « à la même distance de l'axe » reste une phrase en l'air.
   ======================================================================= */
function genererSymetrie(niveau) {
  if (niveau !== "facile" && piles()) {
    return symetrieAxes();
  }
  return symetriePoint(niveau);
}


function symetriePoint(niveau) {
  const pas = 28;
  const x0 = 35;
  const y0 = 25;
  const colonnes = 12;
  const lignes = 7;

  /* L'axe est vertical (plus facile) ou horizontal. Au niveau costaud,
     le point n'est pas sur la même ligne que l'axe, ce qui oblige à
     compter dans les deux directions. */
  const vertical = niveau === "facile" ? true : piles();

  const grille = quadrillage(pas, x0, y0, colonnes, lignes);

  function cellule(col, ligne) {
    return P(x0 + col * pas, y0 + ligne * pas);
  }

  let axeDebut;
  let axeFin;
  let A;
  let APrime;
  let carreaux;

  if (vertical) {
    const colonneAxe = 6;
    carreaux = alea(2, 4);
    const ligneA = alea(1, lignes - 1);

    axeDebut = cellule(colonneAxe, 0);
    axeFin = cellule(colonneAxe, lignes);
    A = cellule(colonneAxe - carreaux, ligneA);
    APrime = cellule(colonneAxe + carreaux, ligneA);
  } else {
    const ligneAxe = 3;
    carreaux = alea(1, 2);
    const colonneA = alea(2, colonnes - 2);

    axeDebut = cellule(0, ligneAxe);
    axeFin = cellule(colonnes, ligneAxe);
    A = cellule(colonneA, ligneAxe - carreaux);
    APrime = cellule(colonneA, ligneAxe + carreaux);
  }

  const pied = vertical ? P(axeDebut.x, A.y) : P(A.x, axeDebut.y);

  const base =
    grille +
    trait(axeDebut, axeFin, "fig-forte") +
    texte(vertical ? P(axeDebut.x + 24, y0 + 14) : P(x0 + 18, axeDebut.y - 10),
          "(d)");

  return [
    {
      figure: figure(
        "Un quadrillage, un axe (d) et un point A.",
        [base, pointNomme(A, "A", vertical ? "haut-gauche" : "haut")]
      ),
      explication:
        "Place <strong>A'</strong>, le " + cle("symétrique") + " de A par " +
        "rapport à la droite (d). <strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure(
        "On compte les carreaux entre A et l'axe.",
        [base, trait(A, pied, "fig-pointille"),
         angleDroit(pied, A, axeFin, 14),
         pointNomme(A, "A", vertical ? "haut-gauche" : "haut", true),
         mesure(A, pied, carreaux + (carreaux > 1 ? " carreaux" : " carreau"),
                vertical ? -18 : 20)]
      ),
      explication:
        "On va de A <strong>perpendiculairement</strong> à l'axe (le " +
        "petit carré le rappelle) et on compte : <strong>" + carreaux +
        "</strong> carreau" + (carreaux > 1 ? "x" : "") + "."
    },
    {
      figure: figure(
        "Le point A' est placé de l'autre côté, à la même distance.",
        [base, trait(A, pied, "fig-pointille"),
         trait(pied, APrime, "fig-pointille"),
         angleDroit(pied, A, axeFin, 14),
         mesure(A, pied, carreaux + "", vertical ? -14 : 16),
         mesure(pied, APrime, carreaux + "", vertical ? -14 : 16),
         pointNomme(A, "A", vertical ? "haut-gauche" : "haut"),
         pointNomme(APrime, "A'", vertical ? "haut-droite" : "bas", true)]
      ),
      explication:
        "On repart de l'autre côté de l'axe en comptant <strong>le même " +
        "nombre de carreaux</strong> : voilà A'. L'axe est la " +
        cle("médiatrice") + " de [AA'].",
      termine: true
    }
  ];
}


/* --- Combien d'axes de symétrie ? ------------------------------------- */
function symetrieAxes() {
  const sorte = choix(["carre", "rectangle", "losange", "triangleEquilateral",
                       "cercle", "parallelogramme"]);

  let dessin;
  let axes;
  let combien;
  let nomForme;
  let phrase;

  if (sorte === "carre") {
    const s = [P(140, 58), P(280, 58), P(280, 198), P(140, 198)];
    nomForme = "carré";
    dessin = polygone(s);
    combien = 4;
    axes =
      trait(P(210, 38), P(210, 218), "fig-pointille") +
      trait(P(120, 128), P(300, 128), "fig-pointille") +
      trait(P(120, 38), P(300, 218), "fig-pointille") +
      trait(P(300, 38), P(120, 218), "fig-pointille");
    phrase =
      "Le carré a <strong>4 axes</strong> : les deux médiatrices de ses " +
      "côtés, et ses deux diagonales.";
  } else if (sorte === "rectangle") {
    const s = [P(85, 75), P(335, 75), P(335, 185), P(85, 185)];
    nomForme = "rectangle";
    dessin = polygone(s);
    combien = 2;
    axes =
      trait(P(210, 55), P(210, 205), "fig-pointille") +
      trait(P(65, 130), P(355, 130), "fig-pointille");
    phrase =
      "Le rectangle a <strong>2 axes</strong> : les médiatrices de ses " +
      "côtés. Attention, <strong>ses diagonales ne sont pas des axes</strong> " +
      "— en pliant le long d'une diagonale, les deux moitiés ne se " +
      "superposent pas.";
  } else if (sorte === "losange") {
    const s = [P(100, 128), P(210, 58), P(320, 128), P(210, 198)];
    nomForme = "losange";
    dessin = polygone(s);
    combien = 2;
    axes =
      trait(P(80, 128), P(340, 128), "fig-pointille") +
      trait(P(210, 38), P(210, 218), "fig-pointille");
    phrase =
      "Le losange a <strong>2 axes</strong> : ses deux " +
      cle("diagonales") + ".";
  } else if (sorte === "triangleEquilateral") {
    const centre = P(210, 135);
    const A = P(210, 45);
    const B = tourner(A, centre, 120);
    const C = tourner(A, centre, 240);
    nomForme = "triangle équilatéral";
    dessin = polygone([A, B, C]) + codage(A, B, 1) + codage(B, C, 1) +
             codage(C, A, 1);
    combien = 3;

    /* Chaque axe part d'un sommet et file jusqu'au MILIEU du côté
       d'en face. On le prolonge un peu des deux bords pour qu'il
       dépasse joliment de la figure. */
    const axeDuSommet = function (sommet, cote1, cote2) {
      const m = milieu(cote1, cote2);
      const d = direction(sommet, m);
      return trait(avancer(sommet, d, -16), avancer(m, d, 16),
                   "fig-pointille");
    };

    axes =
      axeDuSommet(A, B, C) + axeDuSommet(B, A, C) + axeDuSommet(C, A, B);
    phrase =
      "Le triangle équilatéral a <strong>3 axes</strong> : un par sommet. " +
      "Chacun passe par un sommet et le milieu du côté d'en face.";
  } else if (sorte === "cercle") {
    const O = P(210, 128);
    nomForme = "cercle";
    dessin = cercle(O, 85) + point(O) + nom(O, "O", "bas-droite");
    combien = "une infinité d'";
    axes =
      trait(P(125, 128), P(295, 128), "fig-pointille") +
      trait(P(210, 43), P(210, 213), "fig-pointille") +
      trait(surLeCercle(O, 85, 45), surLeCercle(O, 85, 225), "fig-pointille") +
      trait(surLeCercle(O, 85, 135), surLeCercle(O, 85, 315), "fig-pointille");
    phrase =
      "Le cercle a une <strong>infinité</strong> d'axes : " +
      "<strong>toute droite qui passe par le centre</strong> en est un. " +
      "On n'en a dessiné que quatre, il y en a autant qu'on veut.";
  } else {
    const s = [P(80, 190), P(240, 190), P(340, 85), P(180, 85)];
    nomForme = "parallélogramme";
    dessin = polygone(s) + codageParallele(s[0], s[1], 1) +
             codageParallele(s[3], s[2], 1);
    combien = 0;
    axes = "";
    phrase =
      "Le parallélogramme (qui n'est ni un losange ni un rectangle) n'a " +
      "<strong>aucun axe de symétrie</strong>. En le pliant, les deux " +
      "moitiés ne se superposent jamais. C'est le piège classique.";
  }

  const reponse =
    combien === 0
      ? "aucun axe"
      : combien === "une infinité d'"
      ? "une infinité"
      : combien + (combien > 1 ? " axes" : " axe");

  return [
    {
      figure: figure("Un " + nomForme + ".", [dessin]),
      explication:
        "Combien ce " + nomForme + " a-t-il d'<strong>axes de " +
        "symétrie</strong> ? <strong>Clique</strong> pour la méthode."
    },
    {
      figure: figure("La figure, avant le pliage.", [dessin]),
      explication:
        "Un " + cle("axe de symétrie") + ", c'est un trait de pliage : " +
        "si on plie la figure le long de cet axe, <strong>les deux " +
        "moitiés se superposent exactement</strong>."
    },
    {
      figure: figure(
        "Les axes de symétrie sont tracés en pointillés.",
        [dessin, axes]
      ),
      calcul: [entier(reponse)],
      explication: phrase,
      termine: true
    }
  ];
}


/* =======================================================================
   EXERCICE 8 : LES SOLIDES

   Reconnaître un solide, puis compter ses faces, ses arêtes et ses
   sommets — y compris ceux qu'on ne voit pas (dessinés en pointillés).
   ======================================================================= */
function genererSolides(niveau) {
  const solides = [
    {
      nom: "cube",
      dessin: pave(P(130, 75), 130, 130, 75),
      faces: 6, aretes: 12, sommets: 8,
      detail: "6 faces carrées, toutes identiques"
    },
    {
      nom: "pavé droit",
      dessin: pave(P(105, 90), 180, 105, 70),
      faces: 6, aretes: 12, sommets: 8,
      detail: "6 faces rectangulaires"
    },
    {
      nom: "pyramide à base carrée",
      dessin: pyramide(P(185, 205), 85, 150),
      faces: 5, aretes: 8, sommets: 5,
      detail: "1 base carrée et 4 faces triangulaires"
    },
    {
      nom: "prisme droit à base triangulaire",
      dessin: prisme(P(85, 100), 145, 110, 68),
      faces: 5, aretes: 9, sommets: 6,
      detail: "2 bases triangulaires et 3 faces rectangulaires"
    },
    {
      nom: "cylindre",
      dessin: cylindre(P(200, 80), 70, 110),
      faces: null, aretes: null, sommets: null,
      detail: "2 disques et une surface courbe : il roule"
    },
    {
      nom: "cône",
      dessin: cone(P(205, 200), 75, 140),
      faces: null, aretes: null, sommets: null,
      detail: "1 disque, une pointe, et une surface courbe"
    },
    {
      nom: "boule",
      dessin: boule(P(205, 128), 85),
      faces: null, aretes: null, sommets: null,
      detail: "aucun sommet, aucune arête : tout est courbe"
    }
  ];

  const solide = choix(
    niveau === "facile" ? solides.slice(0, 3) : solides
  );

  // Au niveau costaud, on calcule plutôt le volume d'un pavé.
  if (niveau === "costaud" && piles()) {
    return solideVolume();
  }

  const etapes = [
    {
      figure: figure("Un solide en perspective.", [solide.dessin]),
      explication:
        "Quel est ce <strong>solide</strong> ? Les traits en pointillés " +
        "sont les arêtes <strong>cachées</strong>, celles qu'on ne verrait " +
        "pas en vrai."
    },
    {
      figure: figure("Le solide est un " + solide.nom + ".",
                     [solide.dessin]),
      calcul: [entier(solide.nom)],
      explication:
        "C'est un " + cle(solide.nom) + " : " + solide.detail + "."
    }
  ];

  if (solide.faces === null) {
    etapes[etapes.length - 1].termine = true;
    return etapes;
  }

  etapes.push({
    figure: figure("On compte les faces, les arêtes et les sommets.",
                   [solide.dessin]),
    calcul: [
      entier(solide.faces), mot("faces"),
      entier(solide.aretes), mot("arêtes"),
      entier(solide.sommets), mot("sommets")
    ],
    explication:
      "Un " + solide.nom + " a <strong>" + solide.faces + " faces</strong>, " +
      "<strong>" + solide.aretes + " arêtes</strong> (les traits) et " +
      "<strong>" + solide.sommets + " sommets</strong> (les coins). " +
      "Sans compter les pointillés, on se tromperait.",
    termine: true
  });

  return etapes;
}


/* --- Le volume d'un pavé droit ---------------------------------------- */
function solideVolume() {
  const L = alea(3, 9);
  const l = alea(2, 6);
  const h = alea(2, 7);
  const volume = L * l * h;

  const dessin = pave(P(110, 90), 170, 100, 70);

  return [
    {
      figure: figure(
        "Un pavé droit de " + L + " cm sur " + l + " cm sur " + h + " cm.",
        [dessin,
         texte(P(195, 225), L + " cm", "fig-mesure"),
         texte(P(72, 148), h + " cm", "fig-mesure"),
         texte(P(338, 68), l + " cm", "fig-mesure")]
      ),
      explication:
        "Calcule le <strong>volume</strong> de ce pavé droit : " + L +
        " cm, " + l + " cm et " + h + " cm."
    },
    {
      figure: figure("La formule du volume du pavé droit.", [dessin]),
      calcul: [
        entier("V"), operation("="), entier("L"), operation("×"),
        entier("l"), operation("×"), entier("h")
      ],
      explication:
        "Le " + cle("volume") + " d'un pavé droit, c'est le produit de ses " +
        "<strong>trois</strong> dimensions."
    },
    {
      figure: figure("Le volume vaut " + volume + " cm cubes.", [dessin]),
      calcul: [
        entier("V"), operation("="), entier(L), operation("×"), entier(l),
        operation("×"), entier(h), operation("="), entier(volume), mot("cm³")
      ],
      explication:
        "V = <strong>" + volume + " cm³</strong>. L'unité porte un petit " +
        cle("3") + " parce qu'on a multiplié <strong>trois</strong> " +
        "longueurs : ce sont des centimètres cubes.",
      termine: true
    }
  ];
}
