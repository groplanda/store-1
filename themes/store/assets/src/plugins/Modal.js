export class Modal {

  constructor(trigger, modalId) {
    this.$trigger = document.querySelectorAll(trigger);
    this.$modalId = document.getElementById(modalId);
    this.$modals = this.$modalId.querySelectorAll('[data-modal]');
    this.$close = this.$modalId.querySelectorAll('[data-role="modal-close"]');
    this.activeModalClass = "modal__popup_selected";
    this.isOpenModal = false;
    this.init();
  }


  init() {
    this.$trigger.forEach(trigger => {
      trigger.addEventListener("click", this.hadleClick.bind(this));
    })

    this.$close.forEach(close => {
      close.addEventListener("click", this.hadleClose.bind(this));
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && this.$modalId.classList.contains("modal_active")) {
        this.closeModal();
      }
    })

    if(window.location.hash) {
      const hash = window.location.hash.substring(1);
      this.openSelectedModal(hash);
      history.pushState("", document.title, window.location.pathname);
    }

    window.addEventListener("call-modal", (event) => {
      if (event.detail.name) {
        this.openSelectedModal(event.detail.name)
      }
    });

    document.addEventListener('mouseleave', event => {
      if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {
        if (!this.isOpenModal) {
          this.openModal('leave', '')
        }
      }
    })

    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!this.isOpenModal) {
          this.openModal('leave', '')
        }
      }
    })

  }

  hadleClick(event) {
    event.preventDefault();
    const target = event.target;

    if (!target) return;

    const selected = target.dataset.name;
    const offsetBody = this.getScrollBarWith() + "px";
    this.closeAllModals();

    if (this.openModal(selected)) {
      document.body.classList.add("open-modal");
      document.body.style.paddingRight = offsetBody;
    }

  }

  hadleClose(event) {
    const target = event.target;
    if (target.dataset.role === "modal-close") {
      this.closeModal();
    }
  }

  getScrollBarWith() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth;
  }

  openModal(name) {
    const modal = this.$modalId.querySelector(`[data-modal="${name}"]`);
    if (!modal) {
      return false;
    }
    this.$modalId.classList.add('modal_active');
    modal.classList.add(this.activeModalClass);
    this.isOpenModal = true;
    return true;
  }

  closeModal() {
    this.$modalId.classList.remove('modal_active');
    this.closeAllModals();
    document.body.classList.remove("open-modal");
    document.body.style.paddingRight = '';
  }

  closeAllModals() {
    this.$modals.forEach(modal => modal.classList.remove(this.activeModalClass));
  }

  openSelectedModal(current) {
    const offsetBody = this.getScrollBarWith() + "px";
    this.closeAllModals();

    if (this.openModal(current)) {
      document.body.classList.add("open-modal");
      document.body.style.paddingRight = offsetBody;
    }
  }

}
