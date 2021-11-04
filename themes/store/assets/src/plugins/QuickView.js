import axios from 'axios';
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
import { Cart } from './Cart';

export class quickView {
  constructor(productId, output, quickLoading) {
    this.productId = productId;
    this.output = output;
    this.quickLoading = quickLoading;
  }

  fecthProductData() {
    axios.get("/api/product/quick-product/" + this.productId)
    .then(response => {
      const data = response.data;
      this.output.innerHTML = data;
      this.quickLoading.classList.add("loading_hide");
      this.quickViewSlider();
      this.handleQuickView();
      this.setupOptions();
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  quickViewSlider() {
    Swiper.use([Navigation, Pagination, Thumbs]);
    new Swiper('[data-js-slider="product-quick-view"]', {
      spaceBetween: 0,
      slideClass: 'product-quick__slider-item',
      slideActiveClass: 'product-quick__slider-item_active',
      navigation: {
        nextEl: '.product-quick__slider-arrow_next',
        prevEl: '.product-quick__slider-arrow_prev',
      }
    });
  }

  handleQuickView() {
    this.output.addEventListener("click", (e) => {
      if (e.target.dataset.jsAction === "add-to-cart") {
        e.preventDefault();
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
    const id = btn.dataset.productId,
          optionId = btn.dataset.optionId ? Number(btn.dataset.optionId) : null;
    if (!id) return;
    const cart = new Cart(".js-cart", ".js-cart-count");
    cart.addToCart({ id: Number(id), amount: 1, optionId: optionId })
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