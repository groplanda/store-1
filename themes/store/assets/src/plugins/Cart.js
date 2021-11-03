
export class Cart {
  constructor(cartEl, CountEl) {
    this.$cart = document.querySelectorAll(cartEl);
    this.$countCart = document.querySelectorAll(CountEl);
    this.storageName = "shop_cart"
  }

  addToCart(data) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem(this.storageName));
      let index = -1;
      if (data.optionId) {
        index = this.findByOption(cart, data);
      } else {
        index = this.findById(cart, data.id);
      }
      const isAdd = data.amount > 0;
      if (index === -1) {
        cart.push(data);
      } else {
        cart[index].amount = Number(cart[index].amount) + Number(data.amount);
      }
      localStorage.setItem(this.storageName, JSON.stringify(cart));
      this.alertCart(isAdd ? "add" : "default", isAdd ? "Товар добавлен в корзину!" : "Количество товаров изменилось!");
    } else {
      localStorage.setItem(this.storageName, JSON.stringify([data]));
      this.alertCart("add", "Товар добален в корзину!");
    }
    this.updateCart();
  }

  removeFromCart(index) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem(this.storageName));
      cart.splice(index, 1);
      localStorage.setItem(this.storageName, JSON.stringify(cart));
      this.updateCart();
      this.alertCart("remove", "Товар удален из корзины!");
    }
  }

  updateCart() {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem(this.storageName)),
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

  findById(products, id) {
    return products.findIndex(product => product.id === id);
  }

  findByOption(products, data) {
    return products.findIndex(product => product.id === data.id && product.optionId === data.optionId);
  }

  isHasStorage() {
    return localStorage.getItem(this.storageName);
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

  clearStorage() {
    if (this.isHasStorage()) {
      localStorage.removeItem(this.storageName);
    }
  }

  fillStorage(data) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }

}

