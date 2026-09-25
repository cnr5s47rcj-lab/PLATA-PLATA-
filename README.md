# Plata Plata — Boutique en ligne

Site e-commerce prêt à l'emploi : catalogue, panier, paiement Stripe (carte, Apple Pay, Google Pay), pages légales et espace admin (produits, stock, commandes, chiffre d'affaires).

👉 **Commence par lire [GUIDE.md](GUIDE.md)** : il explique tout, du choix du produit jusqu'aux premières ventes.

## Démarrage rapide

```bash
npm install
cp .env.example .env   # puis modifie ADMIN_PASSWORD, SHOP_NAME…
npm start
```

- Boutique : http://localhost:3000
- Admin : http://localhost:3000/admin.html

Sans `STRIPE_SECRET_KEY`, le site tourne en **mode démo** (paiements simulés).

## Structure

| Fichier | Rôle |
|---|---|
| `server.js` | Serveur Express : API produits, paiement Stripe, webhook, admin |
| `data/products.json` | Catalogue (modifiable depuis l'admin) |
| `data/orders.json` | Commandes enregistrées (créé automatiquement, non versionné) |
| `public/` | Pages du site (boutique, panier, confirmation, admin, pages légales) |
| `test/` | Tests (`npm test`) |

## Sécurité

- Les prix sont toujours recalculés côté serveur à partir du catalogue : un client ne peut pas modifier le prix payé.
- Les commandes réelles sont enregistrées uniquement via le webhook Stripe signé.
- L'admin est protégée par `ADMIN_PASSWORD` : choisis un mot de passe long.
