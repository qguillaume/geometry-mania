/* =======================================================================
   2-AFFICHAGE.JS  —  Comment on écrit une formule à l'écran.

   Le problème : une formule comme l'aire du triangle s'écrit sur deux
   lignes (base × hauteur au-dessus d'un trait, 2 en dessous). On ne
   peut donc pas juste écrire du texte.

   La solution : on décrit la formule avec des petites boîtes, et ce
   fichier transforme ces boîtes en HTML que le navigateur sait afficher.

   Il y a 5 sortes de boîtes :

     morceau("× 2", true)   un bout de texte, à mettre en évidence ou non
     entier(22)             un nombre ou un mot, écrit en grand
     operation("=")         un signe : + − × ÷ = < > ?
     mot("cm")              une unité ou un mot de liaison, en plus petit
     fraction([...], [...]) une fraction : la liste du haut, celle du bas

   Exemple, pour afficher   A = 6 × 4
                                -----
                                  2

     [
       entier("A"),
       operation("="),
       fraction(
         [ morceau("6 × 4") ],   <- le haut
         [ morceau("2") ]        <- le bas
       )
     ]

   Le "true" de morceau veut dire : ce morceau est important, on le met
   en couleur, en gras, souligné, sur fond pâle (voir la règle .hl dans
   le CSS).

   Le dessin de géométrie, lui, est fabriqué par le fichier suivant,
   3-figures.js.
   ======================================================================= */

"use strict";


/* ========================= FABRIQUER LES BOÎTES ======================== */

/* Un bout de texte. enEvidence = true pour le faire ressortir. */
function morceau(texte, enEvidence) {
  return {
    texte: String(texte),          // String() transforme le nombre en texte
    enEvidence: enEvidence === true // sans 2e argument, c'est false
  };
}

/* Une fraction. haut et bas sont des LISTES de morceaux. */
function fraction(haut, bas) {
  return { type: "fraction", haut: haut, bas: bas };
}

/* Un nombre (ou une lettre comme "A" ou "P"), affiché en grand. */
function entier(valeur) {
  return { type: "entier", valeur: valeur };
}

/* Un signe d'opération : "+", "−", "×", "÷", "=", "≈", "<", ">" ou "?". */
function operation(symbole) {
  return { type: "operation", symbole: symbole };
}

/* Un petit mot : l'unité d'un résultat ("cm", "cm²"), ou un mot de
   liaison. Il s'écrit en plus petit et en gris : c'est du texte, pas un
   nombre, il ne doit pas prendre autant de place qu'un chiffre. */
function mot(texte) {
  return { type: "mot", texte: String(texte) };
}


/* ====================== TRANSFORMER EN HTML =========================== */

/* Sécurité : on remplace les caractères < > & qui ont un sens spécial en
   HTML, pour qu'ils s'affichent comme du texte normal. */
function echapper(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Une liste de morceaux -> du HTML.
   Les morceaux en évidence sont enveloppés dans <span class="hl">. */
function dessinerMorceaux(morceaux) {
  let html = "";

  for (const bout of morceaux) {
    if (bout.enEvidence) {
      html += '<span class="hl">' + echapper(bout.texte) + "</span>";
    } else {
      html += echapper(bout.texte);
    }
  }

  return html;
}

/* Une seule boîte -> du HTML. */
function dessinerBoite(boite) {
  if (boite.type === "operation") {
    return '<span class="op">' + echapper(boite.symbole) + "</span>";
  }

  if (boite.type === "entier") {
    return '<span class="entier">' + echapper(String(boite.valeur)) + "</span>";
  }

  if (boite.type === "mot") {
    return '<span class="mot">' + echapper(boite.texte) + "</span>";
  }

  // Sinon c'est une fraction : le haut, le trait, puis le bas.
  return (
    '<span class="frac">' +
      '<span class="num">' + dessinerMorceaux(boite.haut) + "</span>" +
      '<span class="bar"></span>' +
      '<span class="den">' + dessinerMorceaux(boite.bas) + "</span>" +
    "</span>"
  );
}

/* Toute une ligne de formule (plusieurs boîtes) -> du HTML. */
function dessinerCalcul(boites) {
  let html = "";

  for (const boite of boites) {
    html += dessinerBoite(boite);
  }

  return html;
}
