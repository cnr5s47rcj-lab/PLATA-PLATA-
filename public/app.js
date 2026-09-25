// Shared helpers: config, cart stored in the browser, header/footer rendering.
const CART_KEY = 'plata_cart';

const Shop = {
  config: { demoMode: false, currency: 'eur', shopName: 'Plata Plata' },

  async init() {
    try {
      this.config = await fetch('/api/config').then((r) => r.json());
    } catch {}
    document.querySelectorAll('[data-shop-name]').forEach((el) => (el.textContent = this.config.shopName));
    if (this.config.demoMode) {
      const banner = document.createElement('div');
      banner.className = 'demo-banner';
      banner.textContent = 'Mode démo : les paiements sont simulés. Ajoute ta clé Stripe pour encaisser de vraies ventes.';
      document.body.prepend(banner);
    }
    this.updateBadge();
  },

  money(cents) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: this.config.currency.toUpperCase() }).format(cents / 100);
  },

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  setCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
    this.updateBadge();
  },

  add(id, qty = 1) {
    const cart = this.getCart();
    const line = cart.find((l) => l.id === id);
    if (line) line.quantity += qty;
    else cart.push({ id, quantity: qty });
    this.setCart(cart);
    this.toast('Ajouté au panier ✓');
  },

  updateBadge() {
    const count = this.getCart().reduce((n, l) => n + l.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = count));
  },

  toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  },

  escape(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  },
};
