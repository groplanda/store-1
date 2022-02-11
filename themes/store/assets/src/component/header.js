export function header() {
  headerPopupHandle();
}

function headerPopupHandle() {
  const trigger = document.querySelectorAll('[data-js-action="open-header-popup"]'),
        popup = document.querySelector('[data-js="header-popup"]'),
        activePopupClass = "header__popup_open";

  if (trigger && popup) {
    trigger.forEach(t => {
      t.addEventListener("click", () => popup.classList.toggle(activePopupClass));
    })

    popup.addEventListener("click", e => {
      if (e.target && e.target.dataset.jsAction === "close-header-popup") {
        popup.classList.remove(activePopupClass);
      }
    })

    document.addEventListener("click", e => {
      const target = e.target;
      if (popup.classList.contains(activePopupClass)) {
        if (target && !target.closest('[data-js="header-popup"]') && target.dataset.jsAction !== "open-header-popup") {
          popup.classList.remove(activePopupClass);

        }
      }
    })

  }
}
