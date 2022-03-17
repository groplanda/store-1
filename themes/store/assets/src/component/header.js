export function header() {
  mobileMenu();
}

function mobileMenu() {

  const mobileDropdown = document.querySelectorAll('[data-js-action="mobile-toggle"]'),
        openBtn = document.querySelector('[data-role="open-menu"]'),
        closeBtn = document.querySelector('[data-role="close-menu"]'),
        mobileMenu = document.querySelector('[data-js="mobile-nav"]');

  if (mobileDropdown) {
    mobileDropdown.forEach(btn => btn.addEventListener("click", e => openDropdown(e)));
  }

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      mobileMenu.classList.add("mobile-nav--show");
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("mobile-nav--show");
    })
  }

  const openDropdown = (e) => {
    if(e && e.target) {
      const className = "mobile-nav__nav-item--opened";
      const parent = e.target.closest('[data-js="nav-item"]');
      const dropdown = parent.querySelector('[data-js="dropdown-item"]');
      if(dropdown) {
        parent.classList.toggle(className);
        if (parent.classList.contains(className)) {
          dropdown.style.height = dropdown.scrollHeight + 'px';
        } else {
          dropdown.style.height = 0;
        }
      }
    }
  }

}
