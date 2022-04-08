export class Cart {
  constructor(CountEl) {
    this.$countCart = document.querySelectorAll(CountEl);
    this.storageName = process.env.MIX_STORE
  }

  addToCart(data, addEvent = true) {
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
      this.updateCart(data.id, addEvent);
      return {
        key: isAdd ? "add" : "default",
        message: isAdd ? "Товар добавлен в корзину!" : "Количество товаров изменилось!"
      };
    } else {
      localStorage.setItem(this.storageName, JSON.stringify([data]));
      this.updateCart(data.id, addEvent);
      return {
        key: "add",
        message: "Товар добавлен в корзину!"
      };
    }
  }

  changeToCart(data) {
    if (this.isHasStorage()) {
      let index = -1;
      const cart = JSON.parse(localStorage.getItem(this.storageName));
      index = this.findById(cart, data.id);
      const isAdd = data.amount > 0;
      if (index === -1) {
        return;
      }
      cart[index].amount = data.amount;
      localStorage.setItem(this.storageName, JSON.stringify(cart));
      this.updateCart(data.id);

      return {
        key: isAdd ? "add" : "default",
        message: isAdd ? "Товар добавлен в корзину!" : "Количество товаров изменилось!"
      };
    }
  }

  removeFromCart(id, addEvent = true) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem(this.storageName));
      const filtered = cart.filter(item => +item.id !== +id);
      localStorage.setItem(this.storageName, JSON.stringify(filtered));
      this.updateCart(id, addEvent);
      return {
        key: "remove",
        message: "Товар удален из корзины!"
      };
    }
  }

  updateCart(id = false, addEvent = false) {
    if (this.isHasStorage()) {
      const cart = JSON.parse(localStorage.getItem(this.storageName)),
            cartCount = cart.reduce((sum, el) => sum + el.amount, 0);

      this.$countCart.forEach(count => count.textContent = cartCount);

      if (addEvent) {
        window.dispatchEvent(new CustomEvent('change-cart-storage', {
          detail: {
            changed: id,
            storage: localStorage.getItem(this.storageName)
          }
        }));
      }
    }
  }

  findById(products, id) {
    return products.findIndex(product => +product.id === +id);
  }

  findByOption(products, data) {
    return products.findIndex(product => +product.id === +data.id && +product.optionId === +data.optionId);
  }

  isHasStorage() {
    return localStorage.getItem(this.storageName);
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
