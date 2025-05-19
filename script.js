// Cart Management
const cartCountElem = document.getElementById("cart-count");
const CART_KEY = "neongrid_cart";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (cartCountElem) {
    cartCountElem.textContent = count;
  }
}

// Add to cart from product pages
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productDiv = e.target.closest(".product");
      if (!productDiv) return;

      const productId = productDiv.dataset.id;
      const productName = productDiv.querySelector("h2").textContent;
      const productPriceText = productDiv.querySelector("p:nth-of-type(2)").textContent;
      const priceMatch = productPriceText.match(/\$([\d\.]+)/);
      const productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

      addProductToCart({ id: productId, name: productName, price: productPrice });
    });
  });

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleContactForm();
    });
  }

  // Cart page load
  if (document.body.classList.contains("cart-page") || window.location.pathname.endsWith("cart.html")) {
    renderCart();
  }
});

function addProductToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`Added "${product.name}" to your cart.`);
}

function renderCart() {
  const cart = getCart();
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    updateCartCount();
    return;
  }

  let tableHtml = `
    <table class="cart-items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  cart.forEach(({ id, name, price, quantity }) => {
    const subtotal = price * quantity;
    total += subtotal;
    tableHtml += `
      <tr data-id="${id}">
        <td>${name}</td>
        <td>$${price.toFixed(2)}</td>
        <td>${quantity}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn">Remove</button></td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
    <p class="cart-total">Total: $${total.toFixed(2)}</p>
  `;

  cartContainer.innerHTML = tableHtml;

  // Add remove event listeners
  const removeButtons = cartContainer.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;
      const productId = row.dataset.id;
      removeFromCart(productId);
      renderCart();
      updateCartCount();
    });
  });

  updateCartCount();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
}

// Contact Form Validation and Submission (simulated)
function handleContactForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formMessage = document.getElementById("form-message");

  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    formMessage.style.color = "red";
    formMessage.textContent = "Please fill in all required fields.";
    return;
  }

  if (!validateEmail(emailInput.value)) {
    formMessage.style.color = "red";
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }

  // Simulate sending message
  formMessage.style.color = "#008f6b";
  formMessage.textContent = "Thank you for your message! We'll get back to you shortly.";

  // Clear form
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
}

function validateEmail(email) {
  // Basic email regex validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
