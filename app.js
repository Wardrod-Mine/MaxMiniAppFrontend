// webapp/app.js

const tg = window.Telegram.WebApp;
tg.expand(); tg.ready();
const productsArray = [
  { id: 1, name: 'Джинсы', desc: 'Синего цвета, прямые', price: 5000, image: 'img/jeans.jpg' },
  { id: 2, name: 'Куртка', desc: 'Зеленая, теплая', price: 12000, image: 'img/jacket.jpg' },
  // …другие товары…
];

// Ключ для хранения корзины
const CART_KEY = 'tg_cart';

// 1) Работа с localStorage
let cart = [];
function loadCart() {
  const stored = localStorage.getItem(CART_KEY);
  cart = stored ? JSON.parse(stored) : [];
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// 2) Подсчёт суммы и обновление MainButton
function getTotalPrice() {
  return cart.reduce((sum, p) => sum + p.price, 0);
}
function updateMainButton() {
  const total = getTotalPrice();
  if (total > 0) {
    tg.MainButton.setText(`Купить ${total} ₽`);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

function renderCheckoutPage() {
  // MainButton текст “Отправить заказ”
  updateMainButton(); // чтобы кнопка показывалась
}


// 3) Обработчик клика по MainButton
tg.MainButton.onClick(() => {
  const path = window.location.pathname.split('/').pop();
  if (path === '' || path === 'index.html') {
    // перед уходом в корзину сохраняем текущий cart
    saveCart();
    window.location.href = 'cart.html';
  } else if (path === 'cart.html') {
    // на странице корзины шлём данные боту
    console.log('sendData', cart);
    tg.sendData(JSON.stringify({
      products: cart,
      totalPrice: getTotalPrice()
    }));
  }
});

// 4) Рендер каталога
function renderCatalog(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <b>${p.price} ₽</b>
      <button class="btn-add">Добавить в корзину</button>
    `;
    card.querySelector('.btn-add').addEventListener('click', () => {
      cart.push(p);      // добавляем товар
      saveCart();        // сохраняем в localStorage
      updateMainButton();
    });
    container.append(card);
  });
}

// 5) Рендер корзины
function renderCartPage() {
  const container = document.getElementById('cart');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Корзина пуста</p>';
    return;
  }

  cart.forEach(p => {
    const row = document.createElement('div');
    row.innerHTML = `
      <span>${p.name} — ${p.price}₽</span>
    `;
    container.append(row);
  });

  const totalEl = document.createElement('p');
  totalEl.innerHTML = `<b>Итого: ${getTotalPrice()} ₽</b>`;
  container.append(totalEl);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  const path = window.location.pathname.split('/').pop(); // точное определение страницы

  if (path === '' || path === 'index.html') {
    renderCatalog(productsArray);
  } else if (path === 'cart.html') {
    renderCartPage();
  } else if (path === 'checkout.html') {
    renderCheckoutPage();
  }

  updateMainButton();
});
