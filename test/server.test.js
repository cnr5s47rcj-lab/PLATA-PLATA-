const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'plata-'));
fs.copyFileSync(path.join(__dirname, '..', 'data', 'products.json'), path.join(dir, 'products.json'));
process.env.DATA_DIR = dir;
process.env.ADMIN_PASSWORD = 'secret';
process.env.STRIPE_SECRET_KEY = '';

const app = require('../server');
let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const post = (url, body, headers = {}) =>
  fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });

test('lists products', async () => {
  const products = await fetch(`${base}/api/products`).then((r) => r.json());
  assert.ok(products.length > 0);
});

test('rejects empty cart and unknown products', async () => {
  assert.strictEqual((await post('/api/checkout', { cart: [] })).status, 400);
  assert.strictEqual((await post('/api/checkout', { cart: [{ id: 'nope', quantity: 1 }] })).status, 400);
  assert.strictEqual((await post('/api/checkout', { cart: [{ id: 'montre-01', quantity: 0 }] })).status, 400);
});

test('demo checkout records order with server-side price and decrements stock', async () => {
  const res = await post('/api/checkout', { cart: [{ id: 'montre-01', quantity: 2, price: 1 }] });
  assert.strictEqual(res.status, 200);
  const orders = await fetch(`${base}/api/admin/orders`, { headers: { 'x-admin-password': 'secret' } }).then((r) => r.json());
  assert.strictEqual(orders.count, 1);
  assert.strictEqual(orders.revenue, 4990 * 2);
  const products = await fetch(`${base}/api/products`).then((r) => r.json());
  assert.strictEqual(products.find((p) => p.id === 'montre-01').stock, 23);
});

test('admin endpoints require the password', async () => {
  assert.strictEqual((await fetch(`${base}/api/admin/orders`)).status, 401);
  assert.strictEqual((await post('/api/admin/products', { name: 'X', price: 10 }, { 'x-admin-password': 'bad' })).status, 401);
});

test('admin can add a product', async () => {
  const res = await post('/api/admin/products', { name: 'T-shirt', price: '19.90', stock: '10' }, { 'x-admin-password': 'secret' });
  assert.strictEqual(res.status, 201);
  const p = await res.json();
  assert.strictEqual(p.price, 1990);
  assert.strictEqual(p.stock, 10);
});
