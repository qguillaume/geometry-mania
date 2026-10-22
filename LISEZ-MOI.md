# Geometry Mania

Un entraîneur de **géométrie de 6e** : la carte affiche une figure, et
**chaque clic révèle une étape** du raisonnement — sur le dessin, pas
seulement dans le texte.

C'est la petite sœur de [Fraction Mania](../fraction-mania) : mêmes
couleurs, même police, même façon de faire. Qui sait se servir de l'une
sait se servir de l'autre.

Sur ordinateur, **double-clic sur `index.html`** : tout fonctionne sans
internet et sans rien installer.

## L'idée : la figure se construit sous les yeux

Dans un cahier, la figure est figée : tout est tracé d'un coup, et on ne
voit pas ce qui compte. Ici, c'est l'inverse.

- **Étape 1** : la figure nue, et la question.
- **Étape 2** : l'élément dont on parle devient **orange et deux fois
  plus épais**, le codage apparaît, un trait de construction en
  pointillés se pose.
- **Étape 3** : la réponse, écrite en gros, avec la propriété à retenir.

Un triangle isocèle, par exemple, ne devient pas isocèle parce que c'est
écrit : ses deux côtés égaux **s'allument** l'un après l'autre.

## Se tromper n'est pas grave

Sous la carte, deux boutons rattrapent une tape malheureuse :

- **◂ Étape précédente** : revient d'un cran dans le raisonnement ;
- **◂◂ Figure précédente** : revient à la figure d'avant, exactement là
  où on l'avait laissée. Les **20 dernières** figures sont gardées en
  mémoire.

Un bouton grisé veut dire qu'il n'y a plus rien derrière. Sur ordinateur,
la touche <kbd>←</kbd> fait la même chose que « Étape précédente ».

## Les onze types d'exercices

**Figures** — reconnaître, décrire, lire le codage :

| Bouton | Exemple | Ce qu'on apprend |
| --- | --- | --- |
| Vocabulaire | [AB], (AB), [AB) | les notations, l'appartenance ∈, l'alignement, le milieu |
| Droites | (d1) ⊥ (d2) | perpendiculaires, parallèles, médiatrice, et leurs propriétés |
| Cercle | rayon, diamètre, corde | d = 2 × r, et où se place un point |
| Angles | aigu, droit, obtus | nommer un angle, reconnaître sa nature, l'angle plat |
| Triangles | isocèle, équilatéral | déduire la nature **du codage**, pas de l'allure |
| Quadrilatères | carré, losange | les propriétés, et celles des diagonales |
| Symétrie | A' symétrique de A | la construction au carreau, les axes d'une figure |
| Solides | cube, pyramide, cône | faces, arêtes, sommets (pointillés compris), volume du pavé |

**Mesures** — calculer :

| Bouton | Exemple | Ce qu'on apprend |
| --- | --- | --- |
| Périmètre | P = 2 × (L + l) | le tour de la figure, jusqu'au cercle (π ≈ 3,14) |
| Aire | A = L × l | la surface, le triangle = la moitié d'un rectangle, la figure composée |
| Conversions | 3,5 m = 350 cm | compter les rangs, et le piège des aires (× 100 par rang) |

**Mélange** pioche dans les onze types.

Trois niveaux : **Facile** (reconnaître, petits nombres), **Moyen** (les
propriétés arrivent), **Costaud** (raisonnement en deux temps, π, aires
composées, conversions dans les deux sens).

### Deux choses sur lesquelles l'application insiste

**Périmètre ou aire ?** C'est la confusion numéro un de la 6e. Pour le
périmètre, c'est le **contour** qui s'allume ; pour l'aire, c'est
l'**intérieur** qui se colorie, et le rectangle est découpé en carreaux
de 1 cm qu'on peut vraiment compter. L'unité est rappelée à chaque fois :
cm pour une longueur, **cm² avec son petit 2** pour une surface.

**Le codage, pas l'allure.** « Ce n'est pas parce que deux côtés ont
l'air égaux qu'ils le sont » : le triangle quelconque est là exprès, et
les figures des exercices de périmètre portent la mention *figure à main
levée* quand elles ne sont pas à l'échelle. Les autres, elles, **sont à
l'échelle** : un rectangle de 8 cm sur 3 cm est bien dessiné deux fois et
demie plus large que haut.

## Installer l'appli sur le téléphone

L'application est une **PWA** : une page web qui s'installe comme une
vraie appli, avec son icône sur l'écran d'accueil, en plein écran, et
qui marche **sans connexion** une fois installée.

- **Android (Chrome)** : ouvrir le lien, puis toucher le bouton
  « ⬇ Installer l'appli ». (Il n'apparaît que si le téléphone propose
  l'installation.) Sinon : menu ⋮ → « Installer l'application ».
- **iPhone (Safari)** : ouvrir le lien, toucher le bouton Partager,
  puis « Sur l'écran d'accueil ». Safari ne montre jamais de bouton
  d'installation : c'est normal, il faut passer par là.

### L'appli suit le verrou de rotation du téléphone

`manifest.webmanifest` ne contient **volontairement aucune ligne
`orientation`**. Ne la remets pas : écrire `"orientation": "any"` est
une demande explicite de « je gère toutes les orientations », et une
appli installée passe alors **par-dessus le verrou de rotation** du
téléphone — elle bascule même quand l'utilisateur a bloqué l'écran.

## Où est rangé quoi ?

```
index.html                  le squelette de la page
manifest.webmanifest        la carte d'identité de l'appli (nom, icônes, couleurs)
sw.js                       le "service worker" : la copie hors ligne
icones/                     les icônes de l'appli

css/1-couleurs.css          TOUTES les couleurs (le seul fichier à modifier
                            pour changer les couleurs)
css/2-mise-en-page.css      les tailles, les positions, les formes

js/1-outils.js              le hasard, les nombres, et les points (milieu,
                            distance, rotation)
js/2-affichage.js           comment écrire une formule, y compris sur deux
                            lignes comme (base × hauteur) ÷ 2
js/3-figures.js             LA BOÎTE À OUTILS DU DESSINATEUR : traits, points,
                            cercles, angles droits, codage, solides
js/4-exercices-figures.js   les huit exercices sur les figures
js/5-exercices-mesures.js   périmètre, aire, conversions, + la liste FABRIQUES
js/6-application.js         le chef d'orchestre : clics, clavier, boutons
js/7-installation.js        l'installation sur le téléphone
```

Les fichiers sont **numérotés dans l'ordre où le navigateur les charge** :
le 2 se sert du 1, le 3 se sert du 2, et ainsi de suite.

Le fichier à ouvrir en premier, si tu veux comprendre comment ça marche,
est **`js/3-figures.js`** : tout le reste n'est qu'une suite d'appels à
ses fonctions.

## ⚠️ Après avoir modifié un fichier

Les téléphones gardent une copie de l'appli pour marcher hors ligne. Si
on modifie quelque chose, il faut leur dire que la copie est périmée :

**ouvrir `sw.js` et monter le numéro de version** (`geometry-mania-v1`
devient `geometry-mania-v2`).

Sans ça, l'ancienne version reste affichée sur les appareils qui ont
déjà ouvert l'appli — et on peut même se retrouver avec un mélange : la
nouvelle page, mais l'ancien code derrière. **Cela vaut aussi pendant le
développement** : si tu modifies un fichier et que rien ne change à
l'écran, c'est presque toujours ça.

Une fois le numéro monté, la mise à jour s'applique **toute seule** au
lancement suivant : `js/7-installation.js` détecte le changement et
recharge la page une fois, pour que tout vienne de la même version.

### Si un appareil semble bloqué sur une vieille version

1. fermer complètement l'appli (pas juste la réduire) et la rouvrir ;
2. sur ordinateur : <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>R</kbd> ;
3. en dernier recours, Android : appui long sur l'icône → Infos sur
   l'appli → Stockage → Effacer les données.

## La règle importante pour les couleurs

L'application est faite pour être lisible quand on est daltonien. La
règle tenue partout dans le code :

> **La couleur n'est jamais la seule information.**

En géométrie, c'est même facile : le langage de la matière est déjà fait
pour ça.

| Sur la figure | Ce qui porte l'information |
| --- | --- |
| Un angle droit | le **petit carré**, pas la couleur |
| Deux côtés égaux | le **même nombre de petits traits** |
| Deux droites parallèles | les **mêmes flèches** |
| L'élément dont on parle | il est **deux fois plus épais** (et orange) |
| Un trait d'aide | il est **en pointillés** (axe, report, découpe) |
| Une figure terminée | bordure **double et plus épaisse** |

Les couleurs viennent de la palette « Okabe-Ito », conçue pour rester
distinguable. Si tu ajoutes quelque chose, garde cette règle.

### Toute l'application est orange

Le vert est le réflexe habituel pour dire « c'est bon ». Mais c'est
justement la teinte la plus risquée pour la forme la plus courante de
daltonisme, le rouge-vert : sur fond sombre, un vert-turquoise se
confond avec du gris, et le sens est perdu. L'orange reste franchement
visible.

**Le bleu ne subsiste qu'à un seul endroit** : les points de progression
en bas de la carte. C'est voulu — ils ne disent pas « c'est important »,
ils disent « tu en es là ».

## Envie de bricoler le code ?

Quelques idées faciles pour commencer :

- changer la teinte de toute l'appli : une seule ligne, `--orange` dans
  `css/1-couleurs.css` ;
- écrire une nouvelle phrase d'explication : elles sont toutes en clair
  dans les fichiers 4 et 5 ;
- rendre le niveau « Costaud » plus dur : les `alea(...)` en haut de
  chaque fonction donnent les nombres tirés au sort ;
- **ajouter un type d'exercice** : écrire une fonction
  `genererMachin(niveau)` qui renvoie une liste d'étapes, l'ajouter à la
  liste `FABRIQUES` en bas de `js/5-exercices-mesures.js`, et poser un
  bouton `data-mode="machin"` dans `index.html`. Le mode « Mélange » le
  prendra en compte tout seul ;
- **dessiner une nouvelle figure** : tout est dans `js/3-figures.js`.
  Une figure, c'est une description (pour les lecteurs d'écran) et une
  liste de traits :

  ```js
  figure("Un triangle ABC rectangle en A", [
    polygone([A, B, C]),
    angleDroit(A, B, C),
    sommetNomme(A, B, C, "A"),
    sommetNomme(B, A, C, "B"),
    sommetNomme(C, A, B, "C")
  ])
  ```

  `sommetNomme` place le nom **tout seul du bon côté**, même si on
  tourne la figure : inutile de deviner « en haut à gauche ».

## Pour tester pendant le développement

Un petit serveur local est fourni (il ne fait pas partie de l'appli et
n'est pas mis en ligne) :

```bash
py -3 .claude/serveur-test.py
```

puis ouvrir <http://localhost:8125>. Il répond avec `Cache-Control:
no-store`, donc chaque rechargement montre le vrai fichier du disque —
à condition d'avoir monté la version dans `sw.js`, voir plus haut.
