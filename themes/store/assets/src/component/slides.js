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
      },
      on: {
        init: function () {
          setNextThumb(homeSlider);
        },
        slideChangeTransitionEnd: function () {
          setNextThumb(homeSlider);
        }
      },
    })
  }

  function setNextThumb(parent) {
    const nextThumb = parent.querySelector('.swiper-slide-prev') || parent.querySelector('.swiper-slide-next'),
          thumbEl = document.querySelector('[data-js-slider="home-slider-thumb"]');

    if (nextThumb && thumbEl) {
      const nextThumbImg = nextThumb.querySelector('.banner__slider-img'),
            imgPath = nextThumbImg.src,
            imgAlt  = nextThumbImg.alt;

      thumbEl.src = imgPath;
      thumbEl.alt = imgAlt;

    }
  }

  // home products

  const homeProducts = document.querySelectorAll('[data-js-slider="home-products"]');

  if (homeProducts) {

    homeProducts.forEach(slider => {
      new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: false,
        slideClass: 'swiper-slide',
        breakpoints: {
          575: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          1440: {
            slidesPerView: 4,
            spaceBetween: 40
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
