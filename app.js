const products = [
    { id: 1, name: 'Футболка', price: 500 },
    { id: 2, name: 'Кепка', price: 300 },
];

const cart = [];

function renderProducts() {
    const container = document.getElementById('products');
    products.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = `${p.name} - ${p.price}₽ <button onclick="addToCart(${p.id})">+</button>`;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    alert(`${product.name} добавлен в корзину`);
}

function sendOrder() {
    const tg = window.Telegram.WebApp;
    tg.sendData(JSON.stringify(cart));
    tg.close();
}

renderProducts();
