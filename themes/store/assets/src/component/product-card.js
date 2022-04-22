import Sticky from 'sticky-js';
import { Wish } from '@/src/plugins/Wish';
import { cartHanlder } from '@/src/helpers/cartHanlder';
import $ from 'jquery';
import { updatePrices } from '@/src/utils/index';
window.$ = window.jQuery = $;

export function productCard() {

  const productWrap = document.getElementById('partialSingleProduct'),
        preloader = document.getElementById("preloader");

  if (productWrap) {
    productWrap.addEventListener("click", handleProduct);

    new Sticky('[data-js="sticky"]');
    setupOptions();

  }

  function handleProduct(e) {
    const target = e.target;

    if (target.dataset.featured) {
      e.preventDefault();
      const id = target.dataset.featured;
      selectFeatured(id)
    }

    if (target.dataset.jsAction === "options") {
      e.preventDefault();
      selectOption(target);
    }

    if (target.dataset.jsAction === "toggle-wish") {
      e.preventDefault();
      const target = target;
      target.classList.toggle("product__wish_active");

      new Wish().toggeWish({
        product_id: target.dataset.productId,
        user_id: target.dataset.userId
      });
    }

  }

  function setupOptions() {
    const activeOptionBtn = document.querySelector(".product__options-item_active");

    if (activeOptionBtn) {
      selectOption(activeOptionBtn)
    }
  }

  function selectOption(btn) {
    removeActiveOptions();
    btn.classList.add("product__options-item_active");
    const DATA_KEYS = ['price', 'salePrice', 'type', 'name', 'optionId'];
    const productData = {};
    DATA_KEYS.forEach(key => productData[key] = btn.dataset[key]);
    updateProductPrice(productData.price, productData.salePrice);
    updateAddToCart(productData.optionId);
  }

  function removeActiveOptions() {
    const buttons = document.querySelectorAll('[data-js-action="options"]');
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("product__options-item_active");
    }
  }

  function updateAddToCart(optionId) {
    const addToCart = document.querySelector('[data-js-action="add-to-cart"]');
    addToCart.setAttribute('data-option-id', optionId);
  }

  function updateProductPrice(price, salePrice) {
    const $currentPrice = document.querySelector('[data-js="price-current"]'),
          $oldPrice = document.querySelector('[data-js="price-old"]');
    if (+salePrice > 0) {
      $currentPrice.textContent = preparePrice(salePrice);
      $oldPrice.textContent = preparePrice(price);
      $oldPrice.classList.remove("product__price-old_hide");
      return;
    }
    $currentPrice.textContent = preparePrice(price);
    $oldPrice.classList.add("product__price-old_hide");
  }

  function preparePrice (price) {
    return price.toLocaleString('ru') + ' ₽';
  }

  function selectFeatured(id) {
    if (!id) return;

    updateHistoryProduct(id);

    $.request('onFeature', {
      beforeUpdate() {
        preloader.classList.add("loading_active");
      },
      data: {
        'page': id,
      },
      update: {
        '@product.htm' : '#partialSingleProduct'
      },
    })
    .done(() => {
      cartHanlder();
      new Sticky('[data-sticky]');
      setupOptions();
      productWrap.addEventListener("click", handleProduct);
      updatePrices();
      setTimeout(() => {
        preloader.classList.remove("loading_active");
      }, 400)

    });
  }

  function updateHistoryProduct(id) {
    const locStr = location.href;
    const locStrSlash = locStr.lastIndexOf('/');
    const fullLoc = locStr.substring(0, locStrSlash + 1);
    const getParams = location.search;
    history.pushState({id: id}, null, fullLoc + id + getParams);
  }

}
