import $ from 'jquery';
window.$ = window.jQuery = $;
import 'swiper/css/bundle';
import './plugins/UserAuth';
import './plugins/AddComment';
import './helpers/show-more';
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
import Sticky from 'sticky-js';
import { Cart } from './plugins/Cart';
import './helpers/modal';
import { Tabs } from './plugins/Tabs';
import noUiSlider from 'nouislider';
import { Wish } from './plugins/Wish';
import { SingleProduct } from './plugins/SingleProduct';
import { SelectCity } from './plugins/SelectCity';
import Inputmask from "inputmask";
import { ContactForm } from './plugins/ContactForm';
import { menu } from './module/menu';

document.addEventListener("DOMContentLoaded", () => {

  async function supportsWebp() {
    if (!self.createImageBitmap) return false;

    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  }

  (async () => {
    const bodyEl = document.body;
    if(await supportsWebp()) {
      bodyEl.classList.add("webp")
    }
    else {
      bodyEl.classList.add("no-webp")
    }
  })();

  const phones = document.querySelectorAll('[data-mask="phone"]');
  const im = new Inputmask("+7 (999) 999-99-99");
  phones.forEach(phone => {
    im.mask(phone);
  })

  Swiper.use([Navigation, Pagination, Thumbs]);

  new ContactForm('[data-form="send-message"]');

  // isMobile
  const IS_MOBILE = window.innerWidth < 767;

  if ( IS_MOBILE ) {
    $('[data-js-action="open-sort"]').on("click", toggleSort)
  }

  // home slider

  const homeSlider = document.querySelector('[data-js-slider="home-slider"]');

  if (homeSlider) {

    new Swiper('[data-js-slider="home-slider"]', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      slideClass: 'theme-slider__item',
      slideActiveClass: 'theme-slider__item_active',
    })
  }

  // home categories
  const homeCategories = document.querySelectorAll(".js-category");
  if (homeCategories) {
    calcCategories(homeCategories);

    const mediaQuery = [
      '(min-width: 1340px)',
      '(max-width: 1339px)',
      '(min-width: 1200px)',
      '(max-width: 1199px)',
      '(min-width: 900px)',
      '(max-width: 899px)'
    ];

    mediaQuery.forEach(query => {
      const size = window.matchMedia(query);
      size.addListener(handleChange)
    })
  }

  function handleChange(e) {
    if (e.matches) {
      calcCategories(homeCategories);
    }
  }

  function calcCategories(categories) {

    if (!categories) return;
    let skip = 0;
    const pageWidth = window.innerWidth;

    for(let i = skip; i < categories.length; i++) {
      categories[i].classList.remove("home-category__item_hide")
    }

    if (pageWidth >= 1340) return;

    if (pageWidth < 1340) {
      skip = 7;
    }
    if (pageWidth < 1200) {
      skip = 6;
    }
    if (pageWidth < 900) {
      skip = 5;
    }
    for(let i = skip; i < categories.length; i++) {
      categories[i].classList.add("home-category__item_hide")
    }
  }

  // toggle sort dropdown
  function toggleSort() {
    const activeClass = "category__sort-label_active",
          nextClass = ".category__sort-dropdown";
    $(this).toggleClass(activeClass);
    if ($(this).hasClass(activeClass)) {
      $(this).next(nextClass).slideDown();
    } else {
      $(this).next(nextClass).slideUp();
    }
  }


  // tabs
  new Tabs(".modal__tabs", "modal__tabs-title_active", "modal__tabs-item_active").init();

  // add cart
  function addToCart() {
    let addBtns = document.querySelectorAll('[data-js-action="add-to-cart"]');
    const cart = new Cart(".js-cart", ".js-cart-count");
    cart.updateCart();
    cart.displayProductQty();
    if (addBtns.length > 0) {
      addBtns.forEach(btn => {
        btn.addEventListener("click", function() {
          const id = this.dataset.productId;
          if (!id) return;

          const optionId = this.dataset.optionId ? Number(this.dataset.optionId) : null,
                amount = this.dataset.productAmount ? Number(this.dataset.productAmount) : 1;

          const data = { id: Number(id), amount: amount, optionId: optionId };

          if (this.dataset.type === "qty") {
            changeQty(this, amount);
          } else if (this.dataset.type === "product-page") {
            setProductPageAmount(1, this);
            document.querySelector('[data-js-action="qty-val"]').textContent = 1;
          } else {
            this.classList.add("product-card__button_hide");
            this.nextElementSibling.classList.add("qty_show");
          }
          cart.addToCart(data);
        })
      })
    }
  }

  addToCart();

  function changeQty(btn, amount) {
    const qty = btn.parentElement;
    if (!qty.classList.contains("qty")) return;
    const qtyValue = qty.querySelector('[data-js-action="qty-val"]')
    qtyValue.textContent = Number(qtyValue.textContent) + amount;

    if (Number(qtyValue.textContent) === 0) {
      qty.classList.remove("qty_show");
      qty.previousElementSibling.classList.remove("product-card__button_hide");
      qtyValue.textContent = 1;
    }
  }

  productPageQty();

  function productPageQty() {
    const qtyEl = document.querySelector('[data-js-action="update-qty"]'),
          buttonEl = document.querySelector('[data-js-action="add-to-cart"]');

    if (qtyEl) {
      qtyEl.addEventListener("click", e => {
        const target = e.target;
        const qtyVal = qtyEl.querySelector('[data-js-action="qty-val"]');
        if (target && target.tagName.toLowerCase() === "button") {

          if (target.classList.contains("js-remove-cart")) {
            if (Number(qtyVal.textContent) === 1) return;
            qtyVal.textContent = Number(qtyVal.textContent) - 1;
          } else {
            qtyVal.textContent = Number(qtyVal.textContent) + 1;
          }
          setProductPageAmount(qtyVal.textContent, buttonEl)
        }
      })
    }
  }

  function setProductPageAmount(value, buttonEl) {
    buttonEl.dataset.productAmount = value;
  }

  // mobile menu
  menu();

  // catalog filters

  const catalogPaginate = document.getElementById("partialPaginate"),
        categorySection = document.getElementById("categorySection"),
        catalogSort = document.getElementById("partialSort"),
        preloader = document.getElementById("preloader"),
        checkboxBrands = document.querySelectorAll('[data-js-action="checkbox-brand"]'),
        resetFilter = document.querySelector('[data-js-action="reset-filter"]'),
        priceSlider = document.getElementById("priceFilter"),
        priceValues = [
          document.querySelector('[data-price="start"]'),
          document.querySelector('[data-price="end"]'),
        ];

  if (catalogPaginate) {
    catalogPaginate.addEventListener("click", function (e) {
      if (e.target.dataset.jsAction === "paginate" ) {
        productFilter(e);
      }
    })
  }

  if (catalogSort) {
    catalogSort.addEventListener("click", function (e) {
      if (e.target.dataset.jsAction === "sort-products" ) {
        const sorted = catalogSort.querySelectorAll('[data-js-action="sort-products"]');
        sorted.forEach(s => s.classList.remove("category__sort-item_active"));
        e.target.classList.add("category__sort-item_active");
        $('[data-js-action="open-sort"]').trigger("click")
        productFilter(e);
      }
    })
  }

  if (checkboxBrands) {
    checkboxBrands.forEach(checkbox => checkbox.addEventListener("change", productFilter));
  }

  if (resetFilter) {
    resetFilter.addEventListener("click", productFilter);
  }

  if (priceSlider) {
    createRange();
  }

  openMobileFilter('[data-js-action="toggle-mobile-filter"]');

  function openMobileFilter(trigger) {
    const triggerEl = document.querySelector(trigger),
          activeFilterClass = "filter_active";

    if (triggerEl) {
      triggerEl.addEventListener("click", () => {
        const filterEl = triggerEl.nextElementSibling;
        filterEl.classList.toggle(activeFilterClass);

        filterEl.classList.contains(activeFilterClass)
        ? filterEl.style.minHeight = filterEl.scrollHeight + "px"
        : filterEl.style.minHeight = 0;
      })
    }
  }

  function createRange() {
    const maxPrice = priceSlider.dataset.max,
          minPrice = priceSlider.dataset.min;

    noUiSlider.create(priceSlider, {
      start: [+minPrice, +maxPrice],
      connect: true,
      range: {
      'min': +minPrice,
      'max': +maxPrice
      },
      format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
      }
  });
    priceSlider.noUiSlider.on('update', function (values, handle) {
      priceValues[handle].textContent = values[handle];
    });

    priceSlider.noUiSlider.on('change', function(values, handle, unencoded, tap, positions, noUiSlider) {
      productFilter(noUiSlider);
    });
  }

  function getSortValue() {
    const sorted = document.querySelectorAll('[data-js-action="sort-products"]');
    let result = 'price asc';
    if (sorted) {
      sorted.forEach(sort => {
        if (sort.classList.contains("category__sort-item_active")) {
          result = sort.value;
        }
      })
    }
    return result;
  }

  function getCheckboxVals(checkboxes) {
    let result = [];
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked && result.push(checkboxes[i].value);
    }
    return result
  }

  function getActivePage() {
    let result = 1;
    const page = document.querySelector(".category__pagination-btn.category__pagination-btn_current");
    if (page) {
      result = Number(page.dataset.page);
    }
    return result;
  }

  function productFilter(e) {
    const target = e.target,
          noResetType = target.type !== "reset";
    if (noResetType && !target.classList.contains("noUi-target")) {
      e.preventDefault();
    }

    if (!noResetType) {
      priceSlider.noUiSlider.reset();
    }

    let sort = getSortValue();
    let page = getActivePage();
    let brand = getCheckboxVals(noResetType ? checkboxBrands : []);

    if (target.dataset.jsAction === "paginate") {
      page = Number(e.target.dataset.page);
    }

    const filterData = {
      'filter[page]': page,
      'filter[sort]': sort,
      'filter[brand]': brand
    }

    if (priceValues[0] && priceValues[1]) {
      let min = Number(priceValues[0].textContent);
      let max = Number(priceValues[1].textContent);
      filterData.filter[min] = min
      filterData.filter[max] = max
    }

    $.request('onFilterProduct', {
      beforeUpdate() {
        preloader.classList.add("loading_active");
      },
      data: filterData,
      update: {
        '@list.htm' : '#partialProducts',
        '@pagination.htm' : '#partialPaginate',
      },
    })
    .done(() => {
      setTimeout(() => {
        preloader.classList.remove("loading_active");
      }, 300)

      categorySection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      catalogQuickView();
      addToCart();
    });
  }

  // catalog quick view
  catalogQuickView();

  function catalogQuickView() {
    const quickViewBtns = document.querySelectorAll(".js-quick-view");

    if (quickViewBtns) {
      let quickView = new SingleProduct();
      quickViewBtns.forEach(quickBtn => {
        quickBtn.addEventListener("click", function(e) {
          e.preventDefault();
          const productId = this.dataset.quickProductId;
          if (!productId) return;
          quickView.fecthProductData(productId);
        })
      })
    }
  }

  // single product page
  const productWrap = document.getElementById('partialSingleProduct');

  if (productWrap) {
    productWrap.addEventListener("click", handleProduct);
    productSlider();
    new Sticky('[data-sticky]');
    setupOptions();
  }

  function productSlider() {

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

  function handleProduct(e) {
    if (e.target.dataset.featured) {
      e.preventDefault();
      const id = e.target.dataset.featured;
      selectFeatured(id)
    }

    if (e.target.dataset.jsAction === "options") {
      e.preventDefault();
      const selected = e.target;
      selectOption(selected);
    }

    if (e.target.dataset.jsAction === "toggle-wish") {
      e.preventDefault();
      const target = e.target;
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
      const productThumbs = productWrap.querySelector('[data-js-slider="product-thumbs"]');
      if (productThumbs) {
        productSlider();
      }
      addToCart();
      new Sticky('[data-sticky]');
      new Tabs(".tabs", "tabs__heading-item_current", "tabs__item_open").init();
      setupOptions();
      productWrap.addEventListener("click", handleProduct);
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

  chatWidget();

  function chatWidget() {
    const el = document.getElementById('chat');

    if (!el) {
      return;
    }

    const open = el.querySelector('[data-toggle="open"]');
    const close = el.querySelector('[data-toggle="close"]');

    open.addEventListener('click', () => el.classList.remove('--hide'));
    close.addEventListener('click', () => el.classList.add('--hide'));
  }

  menuFixed()

  function menuFixed() {
    const menu = document.querySelector('[data-js="fixed-menu"]');

    if (!menu || window.innerWidth < 1200) {
      return;
    }

    const up = document.getElementById('up');

    const offset = menu.offsetHeight + menu.closest('header').offsetHeight;

    window.addEventListener('scroll', function() {

      if (this.scrollY > offset) {
        menu.classList.add('--show');
        up.classList.add('--show');
      } else {
        menu.classList.remove('--show');
        up.classList.remove('--show');

        const active = menu.querySelectorAll('.header__nav-link_active');
        active.forEach(link => link.classList.remove('header__nav-link_active'));
      }
    });

    up.addEventListener('click', () => {
      document.body.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  countProducts();

  function morph(int, array) {
    return (array = array || ['товар', 'товара', 'товаров']) && array[(int % 100 > 4 && int % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(int % 10 < 5) ? int % 10 : 5]];
  }

  function countProducts() {
    const el = document.querySelectorAll('[data-js-action="products-count"]');

    el.forEach(item => {
      const count = +item.textContent;
      item.textContent = `${count} ${morph(count)}`;
      item.style.opacity = 1;
    })
  }

  const selectCity = new SelectCity();
  selectCity.init();
});
