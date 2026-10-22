/* =======================================================================
   6-APPLICATION.JS  —  Le chef d'orchestre.

   Ce fichier est chargé juste avant la fin. Son travail :
     1. se souvenir de l'exercice en cours et de l'étape affichée
     2. mettre l'écran à jour
     3. écouter les clics, le clavier et les boutons

   Il utilise les fonctions des cinq fichiers précédents.
   ======================================================================= */

"use strict";


/* ====================== CE DONT ON SE SOUVIENT ======================== */

/* Combien d'exercices on garde en mémoire pour pouvoir revenir dessus.
   Au-delà, le plus ancien est oublié : inutile d'encombrer le
   téléphone avec des figures vieilles d'une demi-heure. */
const MEMOIRE = 20;

/* Un seul objet contient tout ce que l'application doit retenir.
   On appelle ça "l'état". Quand l'état change, on redessine l'écran.

   historique est la pile des exercices déjà tirés, du plus ancien au
   plus récent. Chaque case ressemble à ceci :

       { etapes: [ ...les étapes du raisonnement... ], etape: 2 }

   On y range AUSSI l'étape où on en était : en revenant sur une
   figure, on la retrouve exactement là où on l'avait laissée. */
const etat = {
  mode: "melange",     // "vocabulaire", "aire", ... ou "melange"
  niveau: "facile",    // "facile", "moyen" ou "costaud"
  historique: [],      // tous les exercices tirés, dans l'ordre
  numeroExercice: -1   // lequel on regarde (-1 = aucun, tout au départ)
};

/* Raccourci : l'exercice actuellement affiché. */
function exerciceAffiche() {
  return etat.historique[etat.numeroExercice];
}


/* ================= LES MORCEAUX DE PAGE QU'ON MODIFIE ================= */

/* document.getElementById va chercher un élément grâce à son id, écrit
   dans index.html. On les range dans des variables une fois pour toutes,
   pour ne pas avoir à les rechercher à chaque clic. */
const zoneCarte = document.getElementById("scene");
const zoneFigure = document.getElementById("figure");
const zoneCalcul = document.getElementById("expr");
const zoneExplication = document.getElementById("note");
const zonePoints = document.getElementById("points");
const zoneCompteur = document.getElementById("compteur");
const zoneIndice = document.getElementById("indice");
const boutonEtapePrecedente = document.getElementById("etape-precedente");
const boutonFigurePrecedente = document.getElementById("figure-precedente");


/* ======================= FABRIQUER UN EXERCICE ======================== */

function nouvelExercice() {
  /* En mode "mélange", on tire au sort parmi TOUS les types connus.
     Object.keys donne la liste des noms rangés dans FABRIQUES
     (voir 5-exercices-mesures.js) : ajouter un exercice là-bas suffit,
     il entrera dans le mélange sans rien changer ici. */
  const type =
    etat.mode === "melange" ? choix(Object.keys(FABRIQUES)) : etat.mode;

  // On appelle la fonction correspondante.
  const etapes = FABRIQUES[type](etat.niveau);

  /* Si on était revenu en arrière, les exercices "d'après" sont
     abandonnés : le nouveau prend leur place. C'est le même principe
     que le bouton Retour d'un navigateur. */
  etat.historique = etat.historique.slice(0, etat.numeroExercice + 1);
  etat.historique.push({ etapes: etapes, etape: 0 });

  // On ne garde que les MEMOIRE derniers : shift enlève le plus ancien.
  while (etat.historique.length > MEMOIRE) {
    etat.historique.shift();
  }

  etat.numeroExercice = etat.historique.length - 1;
  afficher();
}


/* ==================== METTRE L'ÉCRAN À JOUR =========================== */

function afficher() {
  const exercice = exerciceAffiche();
  const etape = exercice.etapes[exercice.etape];
  const estLaDerniere = exercice.etape === exercice.etapes.length - 1;

  /* 1) LA FIGURE. C'est elle qui change le plus : à chaque étape, on
        redessine la même figure en mettant en valeur l'élément dont on
        parle. Une étape sans figure (c'est rare) laisse simplement la
        zone vide et cachée. */
  if (etape.figure) {
    zoneFigure.innerHTML = dessinerFigure(etape.figure);
    zoneFigure.hidden = false;
  } else {
    zoneFigure.innerHTML = "";
    zoneFigure.hidden = true;
  }

  /* 2) La formule, quand il y en a une, et l'explication.
        innerHTML = "remplace tout le contenu de cet élément par ceci". */
  zoneCalcul.innerHTML = etape.calcul ? dessinerCalcul(etape.calcul) : "";
  zoneExplication.innerHTML = etape.explication;

  /* Les lignes longues (P = 2 × (7 + 4) = 2 × 11 = 22 cm) passent en
     caractères plus petits : à la taille normale, elles déborderaient
     sur un téléphone. */
  zoneCalcul.classList.toggle(
    "dense",
    etape.calcul !== undefined && etape.calcul.length > 4
  );

  // 3) La bordure double quand le raisonnement est terminé.
  //    classList.toggle ajoute la classe si le 2e argument est vrai,
  //    et l'enlève sinon.
  zoneCarte.classList.toggle("termine", etape.termine === true || estLaDerniere);

  // 4) Les petits ronds de progression, un par étape.
  let htmlDesPoints = "";

  for (let i = 0; i < exercice.etapes.length; i++) {
    let classe = "point"; // rond vide : étape pas encore atteinte

    if (i === exercice.etape) {
      classe = "point active"; // rond entouré d'un halo : étape en cours
    } else if (i < exercice.etape) {
      classe = "point faite";  // rond plein : étape déjà vue
    }

    htmlDesPoints += '<span class="' + classe + '"></span>';
  }

  zonePoints.innerHTML = htmlDesPoints;

  // 5) Le compteur et le petit texte "clique ici".
  zoneCompteur.textContent =
    "Étape " + (exercice.etape + 1) + " / " + exercice.etapes.length;

  zoneIndice.textContent = estLaDerniere
    ? "✔ Terminé — clique pour une nouvelle ▸"
    : "Clique ici ▸";

  // 6) Les deux boutons de retour : grisés s'il n'y a rien derrière.
  boutonEtapePrecedente.disabled = exercice.etape === 0;
  boutonFigurePrecedente.disabled = etat.numeroExercice === 0;
}


/* ============== AVANCER ET RECULER DANS LE RAISONNEMENT =============== */

function etapeSuivante() {
  const exercice = exerciceAffiche();

  if (exercice.etape < exercice.etapes.length - 1) {
    exercice.etape = exercice.etape + 1;
    afficher();
  } else {
    // On était déjà à la fin : on passe à l'exercice suivant.
    exerciceSuivant();
  }
}

function etapePrecedente() {
  const exercice = exerciceAffiche();

  if (exercice.etape > 0) {
    exercice.etape = exercice.etape - 1;
    afficher();
  }
}


/* ================ CHANGER D'EXERCICE (SANS RIEN PERDRE) ============== */

function exercicePrecedent() {
  if (etat.numeroExercice > 0) {
    etat.numeroExercice = etat.numeroExercice - 1;
    afficher();
  }
}

function exerciceSuivant() {
  /* Si on est revenu en arrière, "suivant" veut dire : reprendre la
     figure qu'on avait déjà vue. Sinon, on en tire une nouvelle. */
  if (etat.numeroExercice < etat.historique.length - 1) {
    etat.numeroExercice = etat.numeroExercice + 1;
    afficher();
  } else {
    nouvelExercice();
  }
}


/* ======================== ÉCOUTER L'UTILISATEUR ======================= */

/* addEventListener veut dire : "quand ceci arrive, exécute cette fonction". */

// Un clic n'importe où sur la grande carte.
zoneCarte.addEventListener("click", etapeSuivante);

// Le clavier, quand la carte est sélectionnée (touche Tab).
zoneCarte.addEventListener("keydown", function (evenement) {
  if (evenement.key === " " || evenement.key === "Enter") {
    evenement.preventDefault(); // empêche la page de défiler
    etapeSuivante();
  }
});

// Les raccourcis clavier utilisables partout dans la page.
document.addEventListener("keydown", function (evenement) {
  // Si on est en train d'utiliser un bouton, on ne fait rien :
  // c'est le bouton qui doit répondre.
  if (evenement.target.tagName === "BUTTON") {
    return;
  }

  if (evenement.key === "ArrowLeft") {
    etapePrecedente();
  }
  if (evenement.key === "ArrowRight") {
    etapeSuivante();
  }
  if (evenement.key === "n" || evenement.key === "N") {
    nouvelExercice();
  }
});

// Les deux boutons de retour en arrière, sous la carte.
boutonEtapePrecedente.addEventListener("click", etapePrecedente);
boutonFigurePrecedente.addEventListener("click", exercicePrecedent);

// Le bouton orange "Nouvelle figure".
document.getElementById("nouvelle").addEventListener("click", nouvelExercice);

/* Les boutons de réglage (type d'exercice et niveau).
   Ils portent un attribut data-mode ou data-niveau dans index.html :
   on récupère sa valeur pour savoir sur quoi l'utilisateur a cliqué.
   aria-pressed="true" marque le bouton choisi, à la fois pour le CSS
   et pour les lecteurs d'écran. */
function brancherLesBoutons(attribut, quandOnClique) {
  const boutons = document.querySelectorAll("[" + attribut + "]");

  for (const bouton of boutons) {
    bouton.addEventListener("click", function () {
      quandOnClique(bouton.getAttribute(attribut));

      // Un seul bouton du groupe peut être choisi à la fois.
      for (const autre of boutons) {
        autre.setAttribute("aria-pressed", autre === bouton ? "true" : "false");
      }

      nouvelExercice();
    });
  }
}

brancherLesBoutons("data-mode", function (valeur) {
  etat.mode = valeur;
});

brancherLesBoutons("data-niveau", function (valeur) {
  etat.niveau = valeur;
});


/* ============================== DÉPART =============================== */

/* Tout est prêt : on affiche le premier exercice. */
nouvelExercice();
