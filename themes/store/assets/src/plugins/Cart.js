
export class Cart {
  constructor(cartEl, CountEl) {
    this.$cart = document.querySelectorAll(cartEl);
    this.$countCart = document.querySelectorAll(CountEl);
  }

  addToCart(data) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem('shop_cart'));
      const index = cart.findIndex(el => el.id === +data.id);
      const isAdd = data.amount > 0;
      if (index === -1) {
        cart.push(data);
      } else {
        cart[index].amount = Number(cart[index].amount) + Number(data.amount);
      }
      localStorage.setItem('shop_cart', JSON.stringify(cart));
      this.alertCart(isAdd ? "add" : "default", isAdd ? "Товар добавлен в корзину!" : "Количество товаров изменилось!");
    } else {
      localStorage.setItem('shop_cart', JSON.stringify([data]));
      this.alertCart("add", "Товар добален в корзину!");
    }
    this.updateCart();
  }

  removeFromCart(data) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem('shop_cart'));
      const productIndex = cart.findIndex(el => el.id === +data);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem('shop_cart', JSON.stringify(cart));
        this.updateCart();
        this.alertCart("remove", "Товар удален из корзины!");
      }
    }
  }

  updateCart() {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem('shop_cart')),
            cartCount = cart.reduce((sum, el) => sum + el.amount, 0);

      this.$countCart.forEach(count => count.textContent = cartCount);
      if (cartCount > 0) {
        this.$cart.forEach(cart => {
          cart.removeAttribute("data-js-action");
          cart.href = "/checkout";
        })
      } else {
        this.$cart.forEach(cart => {
          cart.setAttribute("data-js-action", "open-modal");
          cart.href = "#!";
        })
      }
    }
  }

  isHasStorage() {
    return localStorage.getItem('shop_cart');
  }

  alertCart(classname, message) {
    const alert = document.createElement("div");
    alert.classList.add("alert", `alert_${classname}`);
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 1500)
  }

}

