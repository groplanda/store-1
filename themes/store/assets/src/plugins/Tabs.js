export class Tabs {
  constructor(tabEl,activeHeadingClass, activeItemClass) {
    this.tabEl = document.querySelector(tabEl);
    this.activeHeadingClass = activeHeadingClass;
    this.activeItemClass = activeItemClass;
  }

  init() {
    if (this.tabEl) {
      const tabHeadings = this.tabEl.querySelectorAll('[data-header-tab]'),
            tabBodyItem = this.tabEl.querySelectorAll('[data-body-tab]');
      this.tabEl.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.dataset.headerTab) {
          const selected = target.dataset.headerTab;

          tabHeadings.forEach(tHead => tHead.classList.remove(this.activeHeadingClass));
          target.classList.add(this.activeHeadingClass);
          tabBodyItem.forEach(tBody => tBody.classList.remove(this.activeItemClass));
          this.tabEl.querySelector(`[data-body-tab="${selected}"]`).classList.add(this.activeItemClass);
        }
      })
    }
  }
}