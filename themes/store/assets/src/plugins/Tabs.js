export class Tabs {
  constructor(tabEl, activeBtnClass, activeTabClass) {
    this.tabEl = document.querySelector(tabEl);
    this.activeBtnClass = activeBtnClass;
    this.activeTabClass = activeTabClass;

    this.init();
  }

  init() {
    this.tabEl.addEventListener("click", this.handleTab.bind(this))
  }

  handleTab(event) {
    const target = event.target;

    if (target && target.tagName.toLowerCase() === "button") {
      const tabIndex = target.dataset.index;
      const selectedTab = this.tabEl.querySelector(`[data-tab="${tabIndex}"]`);
      console.log(selectedTab);
      if (selectedTab) {
        this.hideTabs();
        target.classList.add(this.activeBtnClass);
        selectedTab.classList.add(this.activeTabClass);
      }
    }
  }

  hideTabs() {
    this.tabEl.querySelectorAll('[data-index]').forEach(button => {
      button.classList.remove(this.activeBtnClass);
    });
    this.tabEl.querySelectorAll('[data-tab]').forEach(tab => {
      tab.classList.remove(this.activeTabClass);
    });
  }
}
