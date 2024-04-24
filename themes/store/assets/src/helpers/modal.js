const header = document.querySelector("header"),
        triggerCloseModal  = document.querySelectorAll('[data-role="modal-close"]'),
        modalId = document.getElementById("modal"),
        modalList = modalId.querySelectorAll("[data-modal]"),
        mobileMenu = document.querySelector('[data-js="mobile-menu"]');

  document.body.addEventListener("click", function (e) {
    const target = e.target;
    if (target.dataset.jsAction === "open-modal" || target.closest('[data-js-action="open-modal"]')) {
      e.preventDefault();
      const trigger = target.dataset.jsAction === "open-modal" ? target : target.closest('[data-js-action="open-modal"]');
      openModal(trigger);
    }
  })

  if (triggerCloseModal) {
    triggerCloseModal.forEach(trigger => trigger.addEventListener("click", handleCloseModal));
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modalId.classList.contains("modal_active")) {
      closeModal();
    }
  })

  if(window.location.hash) {
    const hash = window.location.hash.substring(1);
    const hashTrigger = createTrigger(hash);
    header.appendChild(hashTrigger);
    hashTrigger.click();
    hashTrigger.remove();
    history.pushState("", document.title, window.location.pathname);
  }

  function createTrigger(target) {
    const trigger = document.createElement('a');
    trigger.setAttribute('data-js-action', 'open-modal');
    trigger.setAttribute('data-type-modal', target);
    trigger.style.cssText = 'position:absolute;opacity:0;z-index:-1';
    return trigger;
  }

  function getScrollBarWith() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth;
  }

  function openModal(target) {
    if (!target) {
      return;
    }
    const offsetBody = getScrollBarWith() + "px",
          title = target.dataset.title ? target.dataset.title : 'Запросить прайс-лист с оптовыми ценами',
          typeModal = target.dataset.typeModal;
    if (!typeModal) {
      return;
    }
    closeAllModals();
    const currentModal = modalId.querySelector(`[data-modal="${typeModal}"]`);
    if (!currentModal) return;

    if (title) {
      const titleEl = modalId.querySelector('[data-modal="title"]');
      const subjectEl = modalId.querySelector('input[name="user_subject"]');
      titleEl.textContent = subjectEl.value = title;
    }

    modalId.classList.add("modal_active");
    currentModal.classList.add("modal__popup_open");
    document.body.classList.add("modal-open");
    document.body.style.paddingRight = offsetBody;
    setFixedElOffset(offsetBody);

    if (target.dataset.productId) { // если это карточка товара
      currentModal.querySelector('[data-input="product-id"]').value = target.dataset.productId;
    }

  }

  function closeAllModals() {
    for(let i = 0; i < modalList.length; i++) {
      modalList[i].classList.remove("modal__popup_open");
    }
    mobileMenu.classList.remove("menu_open");
  }

  function handleCloseModal(e) {
    if (e.target && e.target.dataset.role === "modal-close") {
      closeModal();
    }
  }

  function closeModal() {
    modalId.classList.remove("modal_active");
    closeAllModals();
    setFixedElOffset(0);
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = '';
  }

  function setFixedElOffset(offset) {
    const fixed = document.querySelectorAll(".js-fixed");
    if (fixed) {
      fixed.forEach(el => el.style.marginRight = offset);
    }
  }
