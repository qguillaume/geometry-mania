/* =======================================================================
   1-OUTILS.JS  —  Les petites fonctions dont on se sert partout.

   Une "fonction", c'est une machine : on lui donne des nombres, elle
   renvoie un résultat. On l'écrit une seule fois, puis on la réutilise
   autant de fois qu'on veut.

   Ce fichier est chargé EN PREMIER, car tous les autres s'en servent.

   Il contient deux familles d'outils :
     - le hasard et les nombres (alea, choix, arrondi, nombreFrancais)
     - la géométrie des points (distance, milieu, tourner, perpendiculaire)
   ======================================================================= */

/* "use strict" demande au navigateur d'être sévère : il signale les
   erreurs au lieu de les laisser passer en silence. */
"use strict";


/* =========================== LE HASARD =============================== */

/* -----------------------------------------------------------------------
   alea(min, max)  ->  un nombre entier au hasard entre min et max
                       (min et max compris)

   Exemple :  alea(2, 6)  peut donner  2, 3, 4, 5 ou 6.

   Math.random() donne un nombre à virgule entre 0 et 1 (par ex. 0.734).
   On l'étale sur la bonne longueur, puis Math.floor arrondit vers le bas.
   ----------------------------------------------------------------------- */
function alea(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}


/* -----------------------------------------------------------------------
   choix(liste)  ->  un élément au hasard dans une liste

   Exemple :  choix(["carré", "losange"])  donne l'un des deux mots.
   ----------------------------------------------------------------------- */
function choix(liste) {
  return liste[alea(0, liste.length - 1)];
}


/* -----------------------------------------------------------------------
   piles()  ->  true une fois sur deux, false l'autre fois.
   Pratique pour tirer au sort entre deux façons de poser une question.
   ----------------------------------------------------------------------- */
function piles() {
  return Math.random() < 0.5;
}


/* ========================== LES NOMBRES ============================== */

/* -----------------------------------------------------------------------
   arrondi(12.3456, 2)  ->  12.35

   On multiplie, on arrondit à l'entier, puis on redivise. C'est la
   méthode classique pour arrondir à un nombre de décimales choisi.
   ----------------------------------------------------------------------- */
function arrondi(nombre, decimales) {
  const facteur = Math.pow(10, decimales);
  return Math.round(nombre * facteur) / facteur;
}


/* -----------------------------------------------------------------------
   nombreFrancais(0.75)  ->  "0,75"

   Deux corrections d'un coup :

   1. LA VIRGULE. En France on écrit 0,75 ; l'ordinateur écrit 0.75.

   2. LES DÉCIMALES FANTÔMES. Un ordinateur range les nombres à virgule
      en binaire, et certains ne tombent pas juste : 3 × 3,14 donne
      9.420000000000002. On arrondit donc à 6 décimales, puis on
      enlève les zéros inutiles à la fin.

   ATTENTION au piège : on ne coupe les zéros QUE dans la partie après
   la virgule. Sinon "10" deviendrait "1" !
   ----------------------------------------------------------------------- */
function nombreFrancais(nombre) {
  // split(".") coupe "10.500000" en deux morceaux : "10" et "500000".
  const morceaux = nombre.toFixed(6).split(".");
  const decimales = morceaux[1].replace(/0+$/, ""); // "500000" -> "5"

  if (decimales === "") {
    return morceaux[0]; // un nombre entier : pas de virgule du tout
  }
  return morceaux[0] + "," + decimales;
}


/* -----------------------------------------------------------------------
   LA VALEUR DE PI QU'ON UTILISE EN CLASSE

   π est un nombre qui ne s'arrête jamais : 3,14159265...
   En 6e, on utilise la valeur approchée 3,14, et on écrit "≈"
   (« environ ») au lieu de "=" dans le résultat. C'est exactement ce
   que fait l'application : elle calcule avec 3,14, comme au tableau.
   ----------------------------------------------------------------------- */
const PI = 3.14;


/* ====================== LA GÉOMÉTRIE DES POINTS =======================

   Un point est rangé dans une petite boîte à deux cases : { x: ..., y: ... }
   x = la distance depuis le bord GAUCHE du dessin
   y = la distance depuis le bord du HAUT

   ATTENTION : dans un dessin d'ordinateur, y augmente vers le BAS.
   C'est l'inverse du repère des mathématiques. Pour monter dans le
   dessin, il faut donc DIMINUER y.
   ======================================================================= */

/* P(x, y) -> un point. Écrit court, parce qu'on s'en sert partout. */
function P(x, y) {
  return { x: x, y: y };
}


/* distance(a, b) -> la longueur du segment [AB], en unités du dessin.

   C'est le théorème de Pythagore (vu en 4e) : on construit un triangle
   rectangle dont [AB] est l'hypoténuse. Ici il sert seulement à
   l'ordinateur pour placer les étiquettes ; l'élève, lui, n'en a pas
   besoin. */
function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}


/* milieu(a, b) -> le point situé au milieu exact de [AB].
   On fait la moyenne des x, et la moyenne des y. */
function milieu(a, b) {
  return P((a.x + b.x) / 2, (a.y + b.y) / 2);
}


/* deplacer(point, dx, dy) -> le même point, poussé de dx et de dy.
   Sert à écrire un nom "un peu à côté" du point, pour qu'il ne se
   superpose pas au dessin. */
function deplacer(point, dx, dy) {
  return P(point.x + dx, point.y + dy);
}


/* tourner(point, centre, angle) -> le point après rotation autour du
   centre, de l'angle donné EN DEGRÉS (sens des aiguilles d'une montre,
   puisque y descend).

   Sert à construire des polygones réguliers (le triangle équilatéral,
   l'hexagone) ou à placer un point sur un cercle. */
function tourner(point, centre, angle) {
  const radians = (angle * Math.PI) / 180;
  const dx = point.x - centre.x;
  const dy = point.y - centre.y;

  return P(
    centre.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    centre.y + dx * Math.sin(radians) + dy * Math.cos(radians)
  );
}


/* surLeCercle(centre, rayon, angle) -> un point du cercle.
   L'angle est en degrés, compté comme en classe : 0° à droite, et on
   tourne dans le sens inverse des aiguilles d'une montre (d'où le
   signe moins sur y, puisque y descend dans un dessin). */
function surLeCercle(centre, rayon, angle) {
  const radians = (angle * Math.PI) / 180;
  return P(
    centre.x + rayon * Math.cos(radians),
    centre.y - rayon * Math.sin(radians)
  );
}


/* -----------------------------------------------------------------------
   versLExterieur(sommet, voisin1, voisin2, longueur)

   Rend un point situé à "longueur" du sommet, du côté OPPOSÉ à la
   figure. C'est là qu'on écrit le nom d'un sommet pour qu'il ne tombe
   jamais sur un côté du polygone.

   Comment ? On regarde les deux directions qui partent du sommet vers
   ses voisins, on les additionne (ça donne la direction "vers
   l'intérieur"), et on part dans l'autre sens.
   ----------------------------------------------------------------------- */
function versLExterieur(sommet, voisin1, voisin2, longueur) {
  const dx1 = (voisin1.x - sommet.x) / distance(sommet, voisin1);
  const dy1 = (voisin1.y - sommet.y) / distance(sommet, voisin1);
  const dx2 = (voisin2.x - sommet.x) / distance(sommet, voisin2);
  const dy2 = (voisin2.y - sommet.y) / distance(sommet, voisin2);

  let dx = dx1 + dx2;
  let dy = dy1 + dy2;
  const taille = Math.sqrt(dx * dx + dy * dy);

  /* Cas rare : les deux voisins sont exactement opposés, la somme vaut
     zéro et on ne peut pas choisir de direction. On monte alors tout
     droit, ce qui est toujours acceptable. */
  if (taille < 0.001) {
    return P(sommet.x, sommet.y - longueur);
  }

  dx = dx / taille;
  dy = dy / taille;

  // Le signe moins : on part dans le sens contraire de l'intérieur.
  return P(sommet.x - dx * longueur, sommet.y - dy * longueur);
}
