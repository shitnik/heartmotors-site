// ============================================================
// Корзина: localStorage, количество товаров и оформление заказа.
// ============================================================

const CART_KEY = 'heartmotors_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

// Сохраняет корзину и обновляет интерфейс.
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Обновляет число товаров в иконке корзины.
function updateCartCount() {
  const counter = document.querySelector('#cart-count');

  if (counter) {
    counter.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// Добавляет товар или увеличивает его количество.
function addToCart(product) {
  const item = cart.find((cartItem) => cartItem.sku === product.sku);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({
      sku: product.sku,
      title: product.title,
      price: product.price,
      qty: 1,
    });
  }

  saveCart();
  openCart();
}

// Удаляет товар из корзины.
function removeFromCart(sku) {
  cart = cart.filter((item) => item.sku !== sku);
  saveCart();
}

// Изменяет количество товара.
function changeQty(sku, delta) {
  const item = cart.find((cartItem) => cartItem.sku === sku);

  if (!item) return;

  item.qty += delta;

  if (item.qty < 1) {
    removeFromCart(sku);
  } else {
    saveCart();
  }
}

// Форматирует цену в рублях.
function formatPrice(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

// Защищает динамический текст от вставки HTML.
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character]));
}

// Отрисовывает содержимое боковой корзины.
function renderCart() {
  const container = document.querySelector('#cart-items');
  const total = document.querySelector('#cart-total');

  if (!container) return;

  container.innerHTML = cart.length
    ? cart.map((item) => `
        <div class="cart-line">
          <div>
            <strong>${escapeHtml(item.title)}</strong><br>
            <small>${formatPrice(item.price)} × ${item.qty}</small>
          </div>
          <div class="cart-actions">
            <button data-action="minus" data-sku="${item.sku}">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-sku="${item.sku}">+</button>
            <button class="cart-remove" data-action="remove" data-sku="${item.sku}">×</button>
          </div>
        </div>
      `).join('')
    : '<p class="empty-cart">Корзина пока пуста.</p>';

  if (total) {
    total.textContent = formatPrice(
      cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    );
  }
}

// Открывает и закрывает боковую панель корзины.
function openCart() {
  document.querySelector('#cart-panel')?.classList.add('open');
  document.querySelector('#cart-overlay')?.classList.add('open');
}

function closeCart() {
  document.querySelector('#cart-panel')?.classList.remove('open');
  document.querySelector('#cart-overlay')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();

  document.querySelector('#cart-button')?.addEventListener('click', openCart);
  document.querySelector('#cart-close')?.addEventListener('click', closeCart);
  document.querySelector('#cart-overlay')?.addEventListener('click', closeCart);

  document.querySelector('#cart-clear')?.addEventListener('click', () => {
    cart = [];
    saveCart();
  });

  document.querySelector('#cart-items')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) return;

    if (button.dataset.action === 'remove') {
      removeFromCart(button.dataset.sku);
    }

    if (button.dataset.action === 'plus') {
      changeQty(button.dataset.sku, 1);
    }

    if (button.dataset.action === 'minus') {
      changeQty(button.dataset.sku, -1);
    }
  });
});

// Открывает форму оформления заказа из боковой корзины.
function openCheckout() {
  const dialog = document.querySelector('#checkout-dialog');

  if (!dialog) return;

  if (!cart.length) {
    alert('Добавьте товар в корзину');
    return;
  }

  closeCart();
  dialog.showModal();
}

// Отправляет заказ в API или сохраняет его локально до подключения API.
async function submitCheckout(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = form.querySelector('.form-message');
  const customer = Object.fromEntries(new FormData(form));
  const order = {
    customer,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    createdAt: new Date().toISOString(),
  };

  try {
    if (window.HEARTMOTORS_API_URL) {
      const response = await fetch(window.HEARTMOTORS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('request failed');
    } else {
      const orders = JSON.parse(
        localStorage.getItem('heartmotors_orders') || '[]',
      );

      orders.push(order);
      localStorage.setItem('heartmotors_orders', JSON.stringify(orders));
    }

    message.textContent = 'Заказ успешно добавлен';
    cart = [];
    saveCart();
    form.reset();

    setTimeout(() => {
      document.querySelector('#checkout-dialog')?.close();
    }, 1400);
  } catch (error) {
    console.error(error);
    message.textContent = 'Не удалось отправить заказ. Попробуйте ещё раз.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#checkout-open')?.addEventListener('click', openCheckout);
  document.querySelector('#checkout-close')?.addEventListener('click', () => {
    document.querySelector('#checkout-dialog')?.close();
  });

  document.querySelector('#checkout-dialog')?.addEventListener('click', (event) => {
    if (event.target.id === 'checkout-dialog') event.target.close();
  });

  document.querySelector('#checkout-form')?.addEventListener('submit', submitCheckout);
});
