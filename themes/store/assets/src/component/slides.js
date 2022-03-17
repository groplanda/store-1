import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';

Swiper.use([Navigation, Pagination, Thumbs]);

export function slides() {

  const homeSlider = document.querySelector('[data-js-slider="home-slider"]');

  if (homeSlider) {

    new Swiper('[data-js-slider="home-slider"]', {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
      slideClass: 'swiper-slide',
      navigation: {
        nextEl: '[data-js-action="home-slider-next"]',
        prevEl: '[data-js-action="home-slider-prev"]',
      }
    })
  }

  const productSlider = document.querySelector('[data-js-slider="single-product"]');

  if (productSlider) {

    new Swiper('[data-js-slider="single-product"]', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      slideClass: 'swiper-slide',
      navigation: {
        nextEl: '[data-js-action="single-product-next"]',
        prevEl: '[data-js-action="single-product-prev"]',
      }
    })
  }

  // home products

  const homeProducts = document.querySelectorAll('[data-js-slider="home-products"]');

  if (homeProducts) {

    homeProducts.forEach(slider => {
      new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        slideClass: 'swiper-slide',
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 15
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 20
          }
        },
        on: {
          init: function () {
            const parent = slider.closest('[data-js="home-products-slider-body"]');
            const navigations = parent.querySelectorAll('[data-js-action="home-products-control"]');
            navigations.forEach(btn => {
              btn.addEventListener("click", () => {
                if (btn.classList.contains("product-slider__controls-btn--prev")) {
                  this.slidePrev()
                } else {
                  this.slideNext()
                }
              })
            })

          },
        },
      })
    })
  }

}
