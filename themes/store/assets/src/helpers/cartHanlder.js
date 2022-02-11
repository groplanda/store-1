
import { Cart } from '@/src/plugins/Cart';
export function cartHanlder() {
  addToCart();
  changeProductQty();
}

function addToCart() {
  let addBtns = document.querySelectorAll('[data-js-action="add-to-cart"]');
  const cart = new Cart(".js-cart", ".js-cart-count");

  cart.updateCart();

  if (addBtns.length > 0) {
    addBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const id = this.dataset.productId;
        if (!id) return;
        const optionId = this.dataset.optionId ? Number(this.dataset.optionId) : null,
              amount = this.dataset.productAmount ? Number(this.dataset.productAmount) : 1,
              data = { id: Number(id), amount: amount, optionId: optionId };

        cart.addToCart(data);
        resetProductAmount(id);
      })
    })
  }

}

function changeProductQty() {
  const productAmount = document.querySelectorAll('[data-js-action="update-qty"]');

  if (productAmount) {
    productAmount.forEach(amount => {
      amount.addEventListener("click", e => {
        const target = e.target,
              amountVal = amount.querySelector('[data-js-action="qty-val"]'),
              productEl = amount.closest('[data-product-index]'),
              addToCart = productEl.querySelectorAll('[data-js-action="add-to-cart"]');

        if (target && target.tagName.toLowerCase() === "button") {
          if (target.classList.contains("js-remove-cart")) {
            if (Number(amountVal.value) === 1) return;
            amountVal.value = Number(amountVal.value) - 1;
          } else {
            amountVal.value = Number(amountVal.value) + 1;
          }
          addToCart.forEach(btn => {
            setProductAmount(amountVal.value, btn)
          })
        }
      })
    })
  }
}

function setProductAmount(value, addToCart) {
  addToCart.dataset.productAmount = value;
}

function resetProductAmount(id) {
  const productEl = document.querySelector(`[data-product-index="${id}"]`);

  if(!productEl) return;

  const amount = productEl.querySelectorAll('[data-js-action="qty-val"]'),
        addToCart = productEl.querySelectorAll('[data-js-action="add-to-cart"]');

        amount.forEach(a => a.value = 1);
        addToCart.forEach(btn => btn.dataset.productAmount = 1);
}
