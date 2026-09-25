require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CURRENCY = (process.env.CURRENCY || 'eur').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = STRIPE_SECRET_KEY ? require('stripe')(STRIPE_SECRET_KEY) : null;
const DEMO_MODE = !stripe;

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SEED_PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// On a fresh persistent disk, start from the bundled example catalog.
if (!fs.existsSync(PRODUCTS_FILE) && fs.existsSync(SEED_PRODUCTS_FILE)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.copyFileSync(SEED_PRODUCTS_FILE, PRODUCTS_FILE);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

const getProducts = () => readJson(PRODUCTS_FILE, []);
const getOrders = () => readJson(ORDERS_FILE, []);

function saveOrder(order) {
  const orders = getOrders();
  if (orders.some((o) => o.id === order.id)) return;
  orders.unshift(order);
  writeJson(ORDERS_FILE, orders);
}

// Prices always come from the server catalog — never trust prices sent by the browser.
function buildLineItems(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error('Le panier est vide.');
  }
  const products = getProducts();
  return cart.map(({ id, quantity }) => {
    const product = products.find((p) => p.id === id);
    const qty = Number.parseInt(quantity, 10);
    if (!product) throw new Error(`Produit introuvable : ${id}`);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new Error(`Quantité invalide pour ${product.name}`);
    }
    if (product.stock !== undefined && qty > product.stock) {
      throw new Error(`Stock insuffisant pour ${product.name}`);
    }
    return { product, quantity: qty };
  });
}

function decrementStock(items) {
  const products = getProducts();
  let changed = false;
  for (const { id, quantity } of items) {
    const p = products.find((x) => x.id === id);
    if (p && p.stock !== undefined) {
      p.stock = Math.max(0, p.stock - quantity);
      changed = true;
    }
  }
  if (changed) writeJson(PRODUCTS_FILE, products);
}

function recordPaidOrder({ id, email, name, items, total, shipping }) {
  if (getOrders().some((o) => o.id === id)) return;
  saveOrder({
    id,
    createdAt: new Date().toISOString(),
    email: email || null,
    name: name || null,
    shipping: shipping || null,
    items,
    total,
    currency: CURRENCY,
    status: 'payée',
  });
  decrementStock(items);
}

const app = express();

// Stripe webhook needs the raw body to verify the signature, so it is registered before express.json().
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) return res.status(400).send('Webhook non configuré');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Signature invalide : ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });
      recordPaidOrder({
        id: session.id,
        email: session.customer_details?.email,
        name: session.customer_details?.name,
        shipping: session.collected_information?.shipping_details || session.shipping_details || null,
        total: session.amount_total,
        items: lineItems.data.map((li) => ({
          id: li.price.product.metadata?.product_id || li.price.product.id,
          name: li.description,
          quantity: li.quantity,
          amount: li.amount_total,
        })),
      });
    } catch (err) {
      console.error('Erreur enregistrement commande :', err);
      return res.status(500).send('Erreur serveur');
    }
  }
  res.json({ received: true });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  res.json({
    demoMode: DEMO_MODE,
    currency: CURRENCY,
    shopName: process.env.SHOP_NAME || 'Plata Plata',
  });
});

app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/checkout', async (req, res) => {
  let items;
  try {
    items = buildLineItems(req.body.cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (DEMO_MODE) {
    // No Stripe key configured: simulate a successful payment so the shop can be tried out locally.
    const id = `demo_${crypto.randomUUID()}`;
    recordPaidOrder({
      id,
      email: 'client-demo@example.com',
      name: 'Client démo',
      total: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        amount: i.product.price * i.quantity,
      })),
    });
    return res.json({ url: `/success.html?session_id=${encodeURIComponent(id)}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: CURRENCY,
          unit_amount: product.price,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.image?.startsWith('http') ? [product.image] : undefined,
            metadata: { product_id: product.id },
          },
        },
      })),
      shipping_address_collection: {
        allowed_countries: (process.env.SHIPPING_COUNTRIES || 'FR,BE,CH,LU,MA,SN,CI,CA')
          .split(',')
          .map((c) => c.trim()),
      },
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cart.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe :', err);
    res.status(500).json({ error: 'Impossible de créer le paiement.' });
  }
});

// --- Admin -----------------------------------------------------------------

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Définis ADMIN_PASSWORD dans le fichier .env pour activer l\'admin.' });
  }
  const given = Buffer.from(req.get('x-admin-password') || '');
  const expected = Buffer.from(ADMIN_PASSWORD);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }
  next();
}

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const orders = getOrders();
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  res.json({ orders, revenue, count: orders.length, currency: CURRENCY });
});

function validateProduct(body) {
  const name = String(body.name || '').trim();
  const price = Math.round(Number(body.price) * 100);
  if (!name) throw new Error('Le nom est obligatoire.');
  if (!Number.isFinite(price) || price < 50) throw new Error('Le prix doit être d\'au moins 0,50.');
  const product = {
    name,
    price,
    description: String(body.description || '').trim(),
    image: String(body.image || '').trim(),
    category: String(body.category || '').trim(),
  };
  if (body.stock !== '' && body.stock !== undefined && body.stock !== null) {
    const stock = Number.parseInt(body.stock, 10);
    if (!Number.isInteger(stock) || stock < 0) throw new Error('Stock invalide.');
    product.stock = stock;
  }
  return product;
}

app.post('/api/admin/products', requireAdmin, (req, res) => {
  try {
    const product = { id: crypto.randomUUID().slice(0, 8), ...validateProduct(req.body) };
    const products = getProducts();
    products.push(product);
    writeJson(PRODUCTS_FILE, products);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Produit introuvable.' });
  try {
    products[index] = { id: products[index].id, ...validateProduct(req.body) };
    writeJson(PRODUCTS_FILE, products);
    res.json(products[index]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const products = getProducts();
  const remaining = products.filter((p) => p.id !== req.params.id);
  if (remaining.length === products.length) return res.status(404).json({ error: 'Produit introuvable.' });
  writeJson(PRODUCTS_FILE, remaining);
  res.status(204).end();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Boutique en ligne sur ${BASE_URL}`);
    if (DEMO_MODE) {
      console.log('Mode DÉMO : aucun vrai paiement. Ajoute STRIPE_SECRET_KEY dans .env pour encaisser.');
    }
  });
}

module.exports = app;
