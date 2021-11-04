import $ from 'jquery';
window.$ = window.jQuery = $;
import 'swiper/css/bundle';
import './plugins/UserAuth';
import './plugins/AddComment';
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
import Sticky from 'sticky-js';
import { Cart } from './plugins/Cart';
import './helpers/modal';
import { Tabs } from './plugins/Tabs';
import noUiSlider from 'nouislider';
import { Wish } from './plugins/Wish';
import { quickView } from './plugins/QuickView';

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

  Swiper.use([Navigation, Pagination, Thumbs]);

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
      slideClass: 'slider__item',
      slideActiveClass: 'slider__item_active',
      navigation: {
        nextEl: '.slider__btn_next',
        prevEl: '.slider__btn_prev',
      },
      pagination: {
        el: '.slider__pagination',
        dynamicBullets: false,
        bulletClass: 'slider__bullet',
        bulletActiveClass: 'slider__bullet_active',
        currentClass: 'slider__bullet_current',
        clickable: true
      }
    })

  }

  // home products

  const homeProducts = document.querySelector('[data-js-slider="home-products"]');

  if (homeProducts) {

    new Swiper('[data-js-slider="home-products"]', {
      slidesPerView: 4,
      grid: {
        rows: 2,
        fill: 'column'
      },
      spaceBetween: 30,
      slideClass: 'home-products__item',
      slideActiveClass: 'home-products__item_active',
      simulateTouch: false,
      breakpoints: {
        320: {
          slidesPerView: 1.25,
          grid: {
            rows: 1,
          },
          spaceBetween: 16,
          pagination: {
            el: '.home-products__pagination',
            bulletClass: 'home-products__bullet',
            bulletActiveClass: 'home-products__bullet_active',
            currentClass: 'home-products__bullet_current',
          }
        },
        480: {
          slidesPerView: 1.5,
          grid: {
            rows: 1,
          },
          spaceBetween: 20,
          pagination: {
            el: '.home-products__pagination',
            bulletClass: 'home-products__bullet',
            bulletActiveClass: 'home-products__bullet_active',
            currentClass: 'home-products__bullet_current',
          }
        },
        576: {
          slidesPerView: 2,
          grid: {
            rows: 2,
          },
        },
        992: {
          slidesPerView: 3,
          grid: {
            rows: 2,
          }
        },
        1200: {
          slidesPerView: 4,
          grid: {
            rows: 2,
          }
        },
      }
    })
  }

  // footer toggle
  toggleDropdown('[data-js-action="toggle-footer-dropdown"]', "footer__title_active", ".footer__dropdown");

  function toggleDropdown(trigger, activeClass, nextClass) {
    $(trigger).on("click", function() {
      $(trigger).not(this).removeClass(activeClass).next(nextClass).slideUp();
      $(this).toggleClass(activeClass);
      if ($(this).hasClass(activeClass)) {
        $(this).next(nextClass).slideDown();
      } else {
        $(this).next(nextClass).slideUp();
      }
    });
  }

  // view product

  const viewProduct = document.querySelectorAll('[data-js-action="view-product"]');

  if (viewProduct) {
    viewProduct.forEach(view => {
      view.addEventListener("click", updateViewProducts)
    })
  }

  function updateViewProducts() {
    const productCards = document.querySelectorAll(".product-card"),
          type = this.dataset.type;
          viewProduct.forEach(view => view.classList.remove("category__view-btn_active"));
          this.classList.add("category__view-btn_active");
    if (productCards) {
      let typeSelect = type === "list" ? 'add' : 'remove';
      productCards.forEach(card => {
        card.classList[typeSelect]("product-card_list");
        card.parentElement.classList[typeSelect]("category__item_list");
      })
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
  new Tabs(".tabs", "tabs__heading-item_current", "tabs__item_open").init();
  new Tabs(".modal__tabs", "modal__tabs-title_active", "modal__tabs-item_active").init();

  const additionalSlider = document.querySelector('[data-js-slider="additional-slider"]');

  if (additionalSlider) {

    new Swiper('[data-js-slider="additional-slider"]', {
      slidesPerView: 4,
      spaceBetween: 30,
      simulateTouch: false,
      breakpoints: {
        320: {
          slidesPerView: 1.25,
          grid: {
            rows: 1,
          },
          spaceBetween: 16,
          pagination: {
            el: '.additional__pagination',
            bulletClass: 'additional__bullet',
            bulletActiveClass: 'additional__bullet_active',
            currentClass: 'additional__bullet_current',
          }
        },
        480: {
          slidesPerView: 1.5,
          grid: {
            rows: 1,
          },
          spaceBetween: 20,
          pagination: {
            el: '.additional__pagination',
            bulletClass: 'additional__bullet',
            bulletActiveClass: 'additional__bullet_active',
            currentClass: 'additional__bullet_current',
          }
        },
        576: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      }
    })
  }

  // add cart
  function addToCart() {
    let addBtns = document.querySelectorAll('[data-js-action="add-to-cart"]');
    const cart = new Cart(".js-cart", ".js-cart-count");
    cart.updateCart();
    if (addBtns.length > 0) {
      addBtns.forEach(btn => {
        btn.addEventListener("click", function() {
          const id = this.dataset.productId;
          const optionId = this.dataset.optionId ? Number(this.dataset.optionId) : null;
          if (!id) return;
          cart.addToCart({ id: Number(id), amount: 1, optionId: optionId })
        })
      })
    }
  }

  addToCart();

  // mobile menu
  const trigger = document.querySelector('[data-js-action="open-menu"]'),
        mobileMenu = document.querySelector('[data-menu="mobile"]');

  if (trigger) {
    trigger.addEventListener("click", () => {
      mobileMenu.classList.toggle("menu_open");
      document.body.classList.toggle("modal-open");
    })
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", e => {
      if (e.target && e.target.dataset.jsAction === "mobile-overlay") {
        mobileMenu.classList.remove("menu_open");
        document.body.classList.remove("modal-open");
      }
    })
  }

  const dropdownMenu = document.querySelectorAll('[data-js-action="open-dropdown-menu"]');

  if (dropdownMenu) {
    dropdownMenu.forEach(btn => {
      btn.addEventListener("click", toggleMobileDropdown)
    })
  }

  function toggleMobileDropdown() {
    const activeClass = "menu__item-btn_active",
          nextClass = ".menu__dropdown";
    $('[data-js-action="open-dropdown-menu"]').not(this).removeClass(activeClass).next(nextClass).slideUp();
    $(this).toggleClass(activeClass);
    if ($(this).hasClass(activeClass)) {
      $(this).next(nextClass).slideDown();
    } else {
      $(this).next(nextClass).slideUp();
    }
  }

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

  toggleDropdown('[data-js-action="filter-dropdown"]', "filter__item-heading_active", ".filter__item-dropdown");

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
    let min = Number(priceValues[0].textContent);
    let max = Number(priceValues[1].textContent);

    if (target.dataset.jsAction === "paginate") {
      page = Number(e.target.dataset.page);
    }

    $.request('onFilterProduct', {
      beforeUpdate() {
        preloader.classList.add("loading_active");
      },
      data: {
        'filter[page]': page,
        'filter[sort]': sort,
        'filter[brand]': brand,
        'filter[min]': min,
        'filter[max]': max
      },
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
    });
  }

  // catalog quick view
  catalogQuickView();

  function catalogQuickView() {
    const quickViewBtns = document.querySelectorAll(".js-quick-view"),
    quickOutput =  document.getElementById("quick-output"),
    quickLoading = document.getElementById("quick-loading");

    if (quickViewBtns) {
      quickViewBtns.forEach(quickBtn => {
        quickBtn.addEventListener("click", function() {
          const productId = this.dataset.quickProductId;
          quickOutput.innerHTML = "";
          quickLoading.classList.remove("loading_hide");
          if (!productId) return;
          new quickView(productId, quickOutput, quickLoading).fecthProductData();
        })
      })
    }
  }


  // single product page
  const productWrap = document.getElementById('partialSingleProduct');

  if (productWrap) {
    productWrap.addEventListener("click", handleProduct);
    const productThumbs = productWrap.querySelector('[data-js-slider="product-thumbs"]');
    if (productThumbs) {
      productSlider();
    }
    new Sticky('[data-sticky]');
    setupOptions();
  }

  function productSlider() {
    // slider start
    const productThumbs = new Swiper('[data-js-slider="product-thumbs"]', {
      spaceBetween: 6,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        320: {
          slidesPerView: 2,
        },
        576: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        }
      }
    });
    new Swiper('[data-js-slider="product-view"]', {
      spaceBetween: 0,
      slideClass: 'product__slider-item',
      slideActiveClass: 'product__slider-item_active',
      navigation: {
        nextEl: '.product__slider-arrow_next',
        prevEl: '.product__slider-arrow_prev',
      },
      thumbs: {
        swiper: productThumbs
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
});