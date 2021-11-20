import axios from 'axios';
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
import { Cart } from './Cart';
import $ from 'jquery';
window.$ = window.jQuery = $;

export class SingleProduct {
  constructor() {
    this.output = document.getElementById("quick-output");
    this.quickLoading = document.getElementById("quick-loading");
    this.$cart = new Cart(".js-cart", ".js-cart-count");
  }

  fecthProductData(productId) {
    this.output.innerHTML = "";
    this.quickLoading.classList.remove("loading_hide");
    axios.get("/api/product/quick-product/" + productId)
    .then(response => {
      const data = response.data;
      this.output.innerHTML = data;
      this.quickLoading.classList.add("loading_hide");
      this.quickViewSlider();
      this.handleQuickView();
      this.setupOptions();
      this.startQty(productId);
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  quickViewSlider() {
    Swiper.use([Navigation, Pagination, Thumbs]);
    new Swiper('[data-js-slider="product-view"]', {
      spaceBetween: 0,
      slideClass: 'product__slider-item',
      slideActiveClass: 'product__slider-item_active',
      navigation: {
        nextEl: '.product__slider-arrow_next',
        prevEl: '.product__slider-arrow_prev',
      }
    });
  }

  handleQuickView() {
    $(this.output).off().on("click", e => {
      if (e.target.dataset.jsAction === "add-to-cart") {
        e.stopPropagation();
        const btn = e.target;
        this.addToCart(btn);
      }
      if (e.target.dataset.jsAction === "options") {
        e.preventDefault();
        const selected = e.target;
        this.selectOption(selected);
      }
    })
  }


  addToCart(btn) {
    const id = btn.dataset.productId;
    if (!id) return;

    const optionId = btn.dataset.optionId ? Number(btn.dataset.optionId) : null,
          amount = btn.dataset.productAmount ? Number(btn.dataset.productAmount) : 1,
          data = { id: Number(id), amount: amount, optionId: optionId };

      if (btn.dataset.type === "qty") {
        this.changeQty(btn, amount, id);
      } else {
        btn.classList.add("product-card__button_hide");
        btn.nextElementSibling.classList.add("qty_show");
        this.updatePageQty(id, amount)
      }
      this.$cart.addToCart(data);
  }

  changeQty(btn, amount, id) {
    const qty = btn.parentElement;
    if (!qty.classList.contains("qty")) return;
    const qtyValue = qty.querySelector('[data-js-action="qty-val"]');
    qtyValue.textContent = Number(qtyValue.textContent) + amount;
    this.updatePageQty(id, qtyValue.textContent);

    if (Number(qtyValue.textContent) === 0) {
      qty.classList.remove("qty_show");
      qty.previousElementSibling.classList.remove("product-card__button_hide");
      qtyValue.textContent = 1;
    }
  }

  updatePageQty(id, value) {
    const productBtn = document.querySelector(`button[data-product-id="${id}"]`);

    if (!productBtn) return;
    const qtyEl = productBtn.nextElementSibling,
          qtyVal= qtyEl.querySelector('[data-js-action="qty-val"]');

    if (+value === 0) {
      productBtn.classList.remove("product-card__button_hide");
      qtyEl.classList.remove("qty_show");
      qtyVal.textContent = 1;
    } else {
      productBtn.classList.add("product-card__button_hide");
      qtyEl.classList.add("qty_show");
      qtyVal.textContent = value;
    }
  }

  startQty(productId) {
    this.$cart.displaySingleProductQty(productId, this.output);
  }

  setupOptions() {
    const activeOption = this.output.querySelector(".product__options-item_active");
    if (activeOption) {
      this.selectOption(activeOption);
    }
  }

  selectOption(btn) {
    this.removeActiveOptions();
    btn.classList.add("product__options-item_active");
    const DATA_KEYS = ['price', 'salePrice', 'type', 'name', 'optionId'];
    const productData = {};
    DATA_KEYS.forEach(key => productData[key] = btn.dataset[key]);
    this.updateProductPrice(productData.price, productData.salePrice);
    this.updateAddToCart(productData.optionId);
  }

  removeActiveOptions() {
    const buttons = this.output.querySelectorAll('[data-js-action="options"]');
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("product__options-item_active");
    }
  }

  updateAddToCart(optionId) {
    const addToCart = this.output.querySelector('[data-js-action="add-to-cart"]');
    addToCart.setAttribute('data-option-id', optionId);
  }

  updateProductPrice(price, salePrice) {
    const $currentPrice = this.output.querySelector('[data-js="price-current"]'),
          $oldPrice = this.output.querySelector('[data-js="price-old"]');
    if (+salePrice > 0) {
      $currentPrice.textContent = this.preparePrice(salePrice);
      $oldPrice.textContent = this.preparePrice(price);
      $oldPrice.classList.remove("product__price-old_hide");
      return;
    }
    $currentPrice.textContent = this.preparePrice(price);
    $oldPrice.classList.add("product__price-old_hide");
  }

  preparePrice (price) {
    return price.toLocaleString('ru') + ' ₽';
  }

}