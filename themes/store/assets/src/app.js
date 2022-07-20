import $ from 'jquery';
window.$ = window.jQuery = $;
import 'swiper/css';
import 'lightbox2';
import './plugins/UserAuth';
import './plugins/AddComment';
import noUiSlider from 'nouislider';
import { ContactForm } from './plugins/ContactForm';
import { dropdown } from './helpers/dropdown';
import { setPageParam } from './helpers/url';
import { cartHanlder } from './helpers/cartHanlder';
import { slides } from './component/slides';
import { header } from './component/header';
import { productCard } from './component/product-card';
import { Modal } from './plugins/Modal';
//import { HeaderNav } from './plugins/HeaderNav';
import IMask from 'imask'
import { Tabs } from './plugins/Tabs';
import { updatePrices } from './utils/index';

document.addEventListener("DOMContentLoaded", () => {

  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.remove("loading_active");
  }

  new Modal('[data-js-action="open-modal"]', 'modal');

  //new HeaderNav('[data-js="header-nav"]');

  new Tabs('[data-js="tabs"]', 'tabs__btn--current', 'tabs__item--selected');

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


  $('[data-js-action="open-sort"]').on("click", toggleSort)

  // home slider
  slides();

  // add to cart
  cartHanlder();

  // toggle sort dropdown
  function toggleSort(e) {
    const activeClass = "filters__sorting-body--open",
          target = e.target,
          parent = target.closest('[data-js="sort-products"]');

          parent.classList.toggle(activeClass);
  }


  // catalog filters

  const catalogPaginate = document.getElementById("partialPaginate"),
        categorySection = document.getElementById("categorySection"),
        catalogSort = document.getElementById("partialSort"),
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
        sorted.forEach(s => s.classList.remove("active"));
        e.target.classList.add("active");
        $('[data-js-action="open-sort"]').text($(e.target).text()).trigger("click")
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
        if (sort.classList.contains("active")) {
          result = sort.dataset.value;
        }
      })
    }
    return result;
  }

  function getActivePage() {
    let result = 1;
    const page = document.querySelector(".category__pagination-item--active");
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

    if (target.dataset.jsAction === "paginate") {
      page = Number(e.target.dataset.page);
    }

    setPageParam({'page': page, 'sort': sort});
    productRequest({'page': page, 'sort': sort}, true)
  }

  function productRequest(data, scroll = false) {
    $.request('onFilterProduct', {
      beforeUpdate() {
        preloader.classList.add("loading_active");
      },
      data: {
        'filter[page]': data.page,
        'filter[sort]': data.sort,
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

      if (scroll) {
        categorySection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
      cartHanlder();
      updatePrices();
    });
  }

  productCard();

  header();

  new ContactForm('[data-form="send-message"]')

  dropdown();

  const phones = document.querySelectorAll('[data-mask="phone"]');

  phones.forEach(phone => {
    IMask(phone, {
      mask: '+{7}(000)000-00-00'
    });
  })

  updatePrices();

});
