# Guide de A à Z : du choix du produit à la première vente

Ce guide suit l'ordre dans lequel il faut faire les choses. Coche chaque case au fur et à mesure.

---

## ÉTAPE 1 — Choisir le produit (1 à 2 semaines)

C'est l'étape la plus importante : un bon produit sur un site simple vend mieux qu'un mauvais produit sur un site parfait.

### Les critères d'un bon produit à vendre en ligne

| Critère | Idéal | Pourquoi |
|---|---|---|
| Prix de vente | 20 € – 80 € | Assez cher pour faire de la marge, assez bas pour un achat « impulsif » |
| Marge | Prix de vente ≥ 3 × prix d'achat | Il faut payer la pub, les frais Stripe (~1,5 % + 0,25 €), la livraison et les retours |
| Taille / poids | Petit et léger | Livraison moins chère, moins de casse |
| Problème résolu | Clair et visible | « Je vois l'utilité en 3 secondes » = ça se vend sur les réseaux |
| Concurrence | Pas introuvable en supermarché | Sinon le client n'a aucune raison de commander chez toi |
| Fragilité / taille (vêtements) | À éviter au début | Retours fréquents = marge perdue |

### Où trouver des idées

- **TikTok / Instagram** : cherche `#tiktokmademebuyit`, `#amazonfinds` → produits qui cartonnent en ce moment.
- **Amazon** : rubrique « Meilleures ventes » et « Nouveautés en vogue » par catégorie.
- **Google Trends** (trends.google.fr) : vérifie que l'intérêt pour le produit **monte** ou est stable (pas en chute).
- **Tes propres compétences / ta région** : produits artisanaux, locaux, faits main → moins de concurrence, marge plus forte.

### Les 3 modèles d'approvisionnement

1. **Dropshipping** (ex. fournisseurs AliExpress, CJ Dropshipping, BigBuy pour l'Europe)
   - ✅ Aucun stock à acheter, démarrage avec ~100 €
   - ❌ Marge plus faible, délais de livraison parfois longs, qualité moins contrôlée
   - 👉 Privilégie des **fournisseurs avec entrepôt en Europe** (livraison 3–7 jours).
2. **Achat en gros** (Alibaba, grossistes locaux)
   - ✅ Meilleure marge, contrôle de la qualité, livraison rapide
   - ❌ Il faut investir dans un stock (souvent 300 € – 2 000 €)
3. **Fabrication maison / artisanat / produits digitaux**
   - ✅ Produit unique, marge maximale
   - ❌ Demande du temps de production

### ✅ Checklist étape 1
- [ ] J'ai listé 10 idées de produits
- [ ] J'ai calculé la marge de chacune (tableau ci-dessous)
- [ ] J'ai commandé **un échantillon** des 2–3 meilleures idées pour vérifier la qualité
- [ ] J'ai choisi **1 produit principal** (+ 2–5 produits complémentaires maximum)

### Calcul de marge (exemple)

| | Montant |
|---|---|
| Prix de vente | 39,90 € |
| Prix d'achat fournisseur | – 9,00 € |
| Livraison au client | – 5,00 € |
| Frais Stripe (1,5 % + 0,25 €) | – 0,85 € |
| Budget pub par vente (estimation) | – 12,00 € |
| **Bénéfice net par vente** | **≈ 13 €** |

Si le bénéfice est inférieur à 5 € par vente, le produit n'est pas viable → choisis-en un autre ou monte le prix.

---

## ÉTAPE 2 — Le cadre légal (1 semaine)

> Les indications ci-dessous concernent la **France**. Si tu vends depuis un autre pays (Belgique, Maroc, Sénégal, Canada…), les démarches sont différentes : dis-le-moi et j'adapterai.

- [ ] **Créer une micro-entreprise** gratuitement sur [formalites.entreprises.gouv.fr](https://formalites.entreprises.gouv.fr) — activité « vente de marchandises ». Tu reçois un **SIRET** en 1 à 4 semaines.
- [ ] Ouvrir un **compte bancaire dédié** (obligatoire au-delà de 10 000 € de CA/an deux années de suite ; conseillé dès le début). Une banque en ligne suffit.
- [ ] **TVA** : en micro-entreprise, tu es en « franchise en base de TVA » jusqu'à un certain seuil de chiffre d'affaires → tu écris « TVA non applicable, art. 293 B du CGI » dans tes CGV. Vérifie le seuil en vigueur sur impots.gouv.fr.
- [ ] Adhérer à un **médiateur de la consommation** (obligatoire pour vendre aux particuliers, ~50–100 €/an).
- [ ] Compléter les 3 pages légales déjà présentes dans le site :
  - `public/mentions-legales.html`
  - `public/cgv.html`
  - `public/confidentialite.html`

  Remplace tout ce qui est entre `[crochets]`. Ces modèles sont une base ; fais-les relire si tu as un doute.

---

## ÉTAPE 3 — Personnaliser la boutique (1 à 3 jours)

Le site est déjà codé. Il faut juste y mettre **tes** produits et **ton** nom.

### 3.1 Installer et lancer le site sur ton ordinateur
1. Installe **Node.js** (version LTS) depuis [nodejs.org](https://nodejs.org).
2. Télécharge le projet, ouvre un terminal dans le dossier et tape :
   ```bash
   npm install
   cp .env.example .env
   npm start
   ```
3. Ouvre **http://localhost:3000** → ta boutique s'affiche (en mode démo, les paiements sont simulés).

### 3.2 Changer le nom et les réglages
Ouvre le fichier `.env` et modifie :
- `SHOP_NAME` → le nom de ta boutique
- `ADMIN_PASSWORD` → un mot de passe **long et secret**
- `CURRENCY` → `eur`, `usd`, `cad`, `chf`, `mad`, `xof`…
- `SHIPPING_COUNTRIES` → les pays où tu livres

### 3.3 Ajouter tes produits
1. Va sur **http://localhost:3000/admin.html** et connecte-toi avec `ADMIN_PASSWORD`.
2. Supprime les produits d'exemple et ajoute les tiens (nom, description, prix, photo, stock).

### Conseils pour des fiches produits qui vendent
- **Photos** : 4 à 6 photos nettes, fond clair + photos « en situation ». C'est le facteur n°1 de conversion. Pour l'URL de l'image, tu peux héberger tes photos sur un service comme Cloudinary ou ImgBB (gratuit) et coller le lien.
- **Titre** : clair, avec le bénéfice (« Gourde isotherme 24 h – 750 ml » plutôt que « Gourde modèle X »).
- **Description** : commence par le problème résolu, puis 3 à 5 points forts, puis les caractéristiques.
- **Prix psychologique** : 39,90 € plutôt que 40 €.

---

## ÉTAPE 4 — Brancher les vrais paiements avec Stripe (1 heure)

1. Crée un compte sur [stripe.com](https://stripe.com) (gratuit, tu ne paies que des frais par vente).
2. Renseigne ton SIRET et ton compte bancaire pour recevoir les virements.
3. Dans **Développeurs → Clés API**, copie la **clé secrète** (`sk_test_…` pour tester).
4. Colle-la dans `.env` : `STRIPE_SECRET_KEY=sk_test_...`
5. Relance le site et fais un achat test avec la carte `4242 4242 4242 4242`, date future, CVC `123`.
6. Quand tout marche, remplace par la clé **live** (`sk_live_…`).

Les clients paient par carte, Apple Pay et Google Pay. Stripe vire l'argent sur ton compte bancaire automatiquement (en général sous 7 jours au début, puis 2–3 jours).

---

## ÉTAPE 5 — Mettre le site en ligne (1 heure)

### Option recommandée : Render (simple, offre gratuite pour commencer)
1. Crée un compte sur [github.com](https://github.com) et mets-y le projet (il y est déjà si tu utilises ce dépôt).
2. Crée un compte sur [render.com](https://render.com) → **New → Web Service** → choisis ce dépôt.
3. Réglages :
   - Build command : `npm install`
   - Start command : `npm start`
4. Dans **Environment**, ajoute les mêmes variables que dans ton `.env` (`SHOP_NAME`, `ADMIN_PASSWORD`, `STRIPE_SECRET_KEY`, `BASE_URL`=l'adresse fournie par Render…).
5. ⚠️ **Important** : ajoute un **Persistent Disk** (menu *Disks*, quelques € par mois), monté sur `/var/data`, et ajoute la variable `DATA_DIR=/var/data`. Sans ça, tes produits ajoutés et tes commandes seraient effacés à chaque redémarrage. Au premier lancement, les produits d'exemple y sont copiés automatiquement ; tu les remplaces ensuite depuis l'admin.

### Nom de domaine
- Achète un nom de domaine (`maboutique.fr`, ~10 €/an) chez OVH, Gandi ou Namecheap.
- Relie-le à Render (*Settings → Custom Domains*) puis mets à jour `BASE_URL=https://maboutique.fr`.

### Webhook Stripe (pour enregistrer les commandes)
1. Stripe → **Développeurs → Webhooks → Ajouter un endpoint**.
2. URL : `https://maboutique.fr/webhook` · Événement : `checkout.session.completed`.
3. Copie le **secret de signature** (`whsec_…`) dans la variable `STRIPE_WEBHOOK_SECRET`.
4. Chaque paiement apparaît maintenant dans `/admin.html` avec l'adresse de livraison, et le stock baisse automatiquement.

### ✅ Checklist avant ouverture
- [ ] Achat test réussi de bout en bout avec la vraie URL
- [ ] La commande test apparaît dans l'admin
- [ ] Pages légales complétées (plus aucun `[crochet]`)
- [ ] Site testé sur téléphone (80 % des visiteurs y seront)
- [ ] Adresse e-mail de contact qui fonctionne

---

## ÉTAPE 6 — Trouver les premiers clients (en continu)

Un site sans visiteurs ne vend rien. Voici les leviers, du moins cher au plus cher :

### Gratuit (commence par là)
1. **TikTok / Instagram Reels / YouTube Shorts** : 1 à 3 vidéos courtes par jour montrant le produit en action (déballage, avant/après, problème → solution). Mets le lien de la boutique en bio. C'est le levier gratuit le plus puissant aujourd'hui.
2. **Ton entourage** : annonce l'ouverture à tes proches, sur WhatsApp, Facebook, avec un code « lancement ».
3. **Groupes Facebook / forums** de ta niche (sans spammer : apporte de la valeur d'abord).
4. **Google** : crée une fiche Google Business et soigne les titres/descriptions de tes produits (SEO).

### Payant (une fois que tu as vérifié que le produit plaît)
5. **Micro-influenceurs** (5 000 – 50 000 abonnés) : envoie-leur le produit gratuitement ou paye 50–200 € par vidéo.
6. **Publicité Meta (Facebook/Instagram) ou TikTok Ads** : commence avec **10–20 €/jour** sur 3–4 vidéos différentes, garde celles qui vendent, coupe les autres après 3 jours.

### Les chiffres à surveiller
- **Taux de conversion** : ventes ÷ visiteurs. Normal : 1 à 3 %. En dessous de 1 % → améliore les photos, le prix ou la description.
- **Coût d'acquisition** : dépense pub ÷ nombre de ventes. Il doit rester **inférieur** à ta marge par vente (voir étape 1).
- **Panier moyen** : affiché dans ton admin. Augmente-le en proposant des lots (« 2 achetés = -15 % »).

---

## ÉTAPE 7 — Gérer les commandes au quotidien

1. Tu reçois un e-mail de Stripe à chaque vente (active-le dans Stripe → Paramètres → Notifications).
2. Ouvre `/admin.html` → tu vois le client, les articles et l'adresse.
3. Expédie (ou passe la commande chez ton fournisseur en dropshipping) et envoie le numéro de suivi au client par e-mail.
4. Réponds aux messages clients en moins de 24 h : c'est ce qui crée les avis positifs et les clients fidèles.
5. Tiens un tableau de tes recettes (le Dashboard Stripe te donne un export) et déclare ton chiffre d'affaires à l'URSSAF (mensuel ou trimestriel).

---

## Planning réaliste

| Semaine | Objectif |
|---|---|
| 1–2 | Recherche produit, échantillons, création de la micro-entreprise |
| 3 | Photos, fiches produits, pages légales, compte Stripe |
| 4 | Mise en ligne, tests, premières vidéos sur les réseaux |
| 5+ | Contenu quotidien, puis pub payante sur ce qui marche |

Personne ne peut te garantir des ventes : ça dépend surtout du produit et de ta régularité à le faire connaître. Mais avec un bon produit, une vraie marge et du contenu régulier, les premières ventes arrivent souvent dans le premier mois.

**Besoin d'aide pour une étape ?** Donne-moi ton idée de produit et je t'aide à calculer la marge, rédiger les fiches, compléter les pages légales ou ajouter des fonctionnalités (codes promo, e-mails automatiques, avis clients…).
