const cart = [];
const drawer = document.querySelector('#cartDrawer');
const backdrop = document.querySelector('#backdrop');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const cartTotal = document.querySelector('#cartTotal');
const detailsPopup = document.querySelector('#detailsPopup');
const detailsBackdrop = document.querySelector('#detailsBackdrop');
const checkoutModal = document.querySelector('#checkoutModal');
const checkoutBackdrop = document.querySelector('#checkoutBackdrop');
const checkoutForm = document.querySelector('#checkoutForm');
const cardFields = document.querySelector('#cardFields');
const checkoutResult = document.querySelector('#checkoutResult');

function toggleCheckout(open) {
  checkoutModal.classList.toggle('open', open);
  checkoutBackdrop.classList.toggle('open', open);
  checkoutModal.setAttribute('aria-hidden', String(!open));
}

function renderCart() {
  cartCount.textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total}`;
  cartItems.innerHTML = cart.length ? cart.map((item, index) => `
    <div class="cart-item"><div>${item.name}<small>$${item.price}</small></div><button class="remove" data-index="${index}">Remove</button></div>
  `).join('') : '<p class="empty-cart">Your cart is waiting for a little voltage.</p>';
  document.querySelectorAll('.remove').forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.index), 1);
    renderCart();
  }));
}

function toggleCart(open) {
  drawer.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
}

function toggleDetails(open) {
  detailsPopup.classList.toggle('open', open);
  detailsBackdrop.classList.toggle('open', open);
  detailsPopup.setAttribute('aria-hidden', String(!open));
}

document.querySelector('#cartOpen').addEventListener('click', () => toggleCart(true));
document.querySelector('#cartClose').addEventListener('click', () => toggleCart(false));
backdrop.addEventListener('click', () => toggleCart(false));
document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.details === 'true') {
    toggleDetails(true);
    return;
  }
  cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
  renderCart();
  toggleCart(true);
}));

document.querySelector('#detailsClose').addEventListener('click', () => toggleDetails(false));
document.querySelector('#detailsDone').addEventListener('click', () => toggleDetails(false));
detailsBackdrop.addEventListener('click', () => toggleDetails(false));

document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active');
  filter.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
  });
}));

document.querySelector('.checkout').addEventListener('click', () => {
  if (!cart.length) return;
  toggleCart(false);
  checkoutResult.hidden = true;
  checkoutForm.hidden = false;
  checkoutForm.reset();
  cardFields.hidden = true;
  toggleCheckout(true);
});

document.querySelector('#checkoutClose').addEventListener('click', () => toggleCheckout(false));
checkoutBackdrop.addEventListener('click', () => toggleCheckout(false));
document.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener('change', () => {
  cardFields.hidden = input.value !== 'card' || !input.checked;
  cardFields.querySelectorAll('input').forEach(field => { field.required = input.value === 'card' && input.checked; });
}));
checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  checkoutForm.reset();
  checkoutForm.hidden = true;
  checkoutResult.hidden = false;
  cart.length = 0;
  renderCart();
});
document.querySelector('#checkoutDone').addEventListener('click', () => toggleCheckout(false));