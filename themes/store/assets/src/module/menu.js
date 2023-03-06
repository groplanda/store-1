export function menu () {
  const mobileToggle = document.querySelectorAll('[data-js-action="toggle-menu"]'),
        mobileMenu = document.querySelector('[data-js="mobile-menu"]');

  if (mobileMenu && mobileToggle) {

    mobileToggle.forEach(toggle => {
      toggle.addEventListener("click", function() {
        const type = toggle.dataset.type;

        if (type === 'open') {
          mobileMenu.style.height = window.innerHeight + 'px'
          toggle.classList.add("is-active");
          mobileMenu.classList.add("menu_open");
          document.body.classList.add("modal-open");
        }

        if (type === 'close') {
          mobileToggle.forEach(t => t.classList.remove("modal-open"));
          mobileMenu.classList.remove("menu_open");
          document.body.classList.remove("modal-open");
        }

      })
    })
  }

  const parents = document.querySelectorAll('[data-js="dropdown"]'),
        itemActiveClass = "header__nav-link_active";

  if (parents) {
    parents.forEach(parent => {
      parent.addEventListener("click", e => {
        e.preventDefault();
        const target = e.target;
        const dropdown = target.nextElementSibling;

        if (!dropdown) return;

        const active = document.querySelectorAll(`.${itemActiveClass}`);
        active.forEach(item => {
          if (item !== target) {
            item.classList.remove(itemActiveClass)
          }
        });
        target.classList.toggle(itemActiveClass);

      })
    })

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && !target.closest('.header__nav-item_children')) {
        parents.forEach((parent) => {
          parent.classList.remove(itemActiveClass);
          const dropdown = parent.nextElementSibling;

          if (!dropdown) return;
        })
      }
    })

  }

  mobileDropdown();

  function mobileDropdown() {
    let currentDepth = 0;
    const parentItems = document.querySelectorAll('[data-js-action="mobile-dropdown"]');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileBack = document.querySelectorAll('[data-js-action="mobile-back"]');
    const wrapMobileMenu = document.querySelector('.menu__container-scroll');
    const wrapScrollClass = 'menu__container-scroll_active';

    if (!mobileMenu) return;

    parentItems.forEach(parentItem => {
      parentItem.addEventListener('click', e => {
        e.preventDefault();
        parentItem.classList.add('active');
        const dropdownHeight = parentItem.nextElementSibling.offsetHeight;

        dropdownHeight > wrapMobileMenu.offsetHeight ?
        wrapMobileMenu.classList.add(wrapScrollClass) :
        wrapMobileMenu.classList.remove(wrapScrollClass);

        wrapMobileMenu.scrollTop = 0;


        currentDepth++;
        updateDepth();
      })
    })

    mobileBack.forEach(back => {
      back.addEventListener('click', e => {
        e.preventDefault();
        currentDepth--;
        const prevParent = back.parentElement.previousElementSibling;

        if (currentDepth == 0) {
          mobileMenu.offsetHeight > wrapMobileMenu.offsetHeight ?
          wrapMobileMenu.classList.add(wrapScrollClass) :
          wrapMobileMenu.classList.remove(wrapScrollClass);
        } else {
          const parentDropdown = prevParent.closest('.header__mobile-menu-dropdown');
          parentDropdown.offsetHeight > wrapMobileMenu.offsetHeight ?
          wrapMobileMenu.classList.add(wrapScrollClass) :
          wrapMobileMenu.classList.remove(wrapScrollClass);
        }
        prevParent.classList.remove('active');

        wrapMobileMenu.scrollTop = 0;

        updateDepth();
      })
    })

    const updateDepth = () => {
      mobileMenu.style.transform = currentDepth > 0 ? `translateX(-${currentDepth * 100}%)` : 'translateX(0)';
    }

  }
}
