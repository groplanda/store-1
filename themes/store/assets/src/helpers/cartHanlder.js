
import { Cart } from '@/src/plugins/Cart';
import { createMessage } from '@/src/utils/index';
export function cartHanlder() {
  addToCart();
  changeProductQty();
}

function addToCart() {
  let addBtns = document.querySelectorAll('[data-js-action="add-to-cart"]');
  const cart = new Cart(".js-cart-count");

  cart.updateCart();

  if (addBtns.length > 0) {
    addBtns.forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopImmediatePropagation();
        const id = this.dataset.productId;
        if (!id) return;
        const optionId = this.dataset.optionId ? Number(this.dataset.optionId) : null,
              amount = this.dataset.productAmount ? Number(this.dataset.productAmount) : 1,
              data = { id: Number(id), amount: amount, optionId: optionId };

        const result = cart.addToCart(data);
        createMessage(result);
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
        e.stopImmediatePropagation();
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
  const productEl = document.querySelectorAll(`[data-product-index="${id}"]`);

  if(!productEl) return;

  productEl.forEach(product => {
    const amount = product.querySelectorAll('[data-js-action="qty-val"]'),
    addToCart = product.querySelectorAll('[data-js-action="add-to-cart"]');

    amount.forEach(a => a.value = 1);
    addToCart.forEach(btn => btn.dataset.productAmount = 1);
  })


}
