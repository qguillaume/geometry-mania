"""Petit serveur local pour tester l'application, sans mise en cache.

A QUOI CA SERT ?
Ouvrir index.html en double-clic marche tres bien pour jouer. Mais pour
DEVELOPPER, le navigateur garde en memoire les anciens fichiers CSS et
JS : on modifie une couleur, on recharge, et rien ne change. Ce serveur
repond avec "Cache-Control: no-store", ce qui interdit cette mise en
memoire. Chaque rechargement montre donc le vrai fichier du disque.

Ce fichier ne fait PAS partie de l'application : il n'est pas mis en
ligne, et le dossier .claude est ignore par git. On peut le supprimer
sans rien casser.

Pour le lancer a la main :
    py -3 .claude/serveur-test.py
puis ouvrir http://localhost:8125
"""

import http.server
import os

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8125


class SansCache(http.server.SimpleHTTPRequestHandler):
    """Le serveur normal, plus trois en-tetes qui interdisent le cache."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # on ne veut pas une ligne de journal par fichier servi


if __name__ == "__main__":
    os.chdir(RACINE)
    # ThreadingHTTPServer : le navigateur ouvre plusieurs connexions en
    # parallele. Un serveur mono-thread les met en file et se bloque.
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    serveur = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), SansCache)
    print("Serveur de test sur http://localhost:%d" % PORT, flush=True)
    serveur.serve_forever()
