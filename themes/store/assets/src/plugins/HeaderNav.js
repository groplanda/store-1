export class HeaderNav {
  constructor(header) {
    this.header = document.querySelector(header);
    this.defaultWidth = this.header.offsetWidth;
    this.setup();
  }


  setup() {

    if (this.isOverflowWidth()) {
      const items = this.header.children;
      this.hideItems(items);
      this.header.insertAdjacentHTML('beforeEnd', this.createShowMore());
      if (this.isOverflowWidth()) {
        this.hideItems(items);
      }
      this.header.append(this.createDropdownMenu(items));
      this.handleDropdown();
    }
  }

  hideItems(items) {
    for(let i = items.length - 1; i >= 0; i--) {
      const menuItem = items[i];
      if (this.isOverflowWidth()) {
        menuItem.classList.add("hidden");
      }
    }
  }

  isOverflowWidth() {
    let result = false;
    const items = this.header.children;
    if (items.length) {
      const itemsArray = Array.prototype.slice.call(items);
      result = itemsArray.filter(item => !item.classList.contains("hidden") && item.tagName.toLowerCase() !== "button").reduce((prev, item) => prev + item.offsetWidth, 0)
    }
    return result >= this.defaultWidth
  }

  createShowMore() {
    return `<button type="button" class="header-nav__nav-item header-nav__nav-item--button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="header-nav__nav-dots" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
            </button>`
  }

  createDropdownMenu(items) {
    const itemsArray = Array.prototype.slice.call(items);
    const list = itemsArray.filter(item => item.classList.contains("hidden")).map(item => item.cloneNode(true));

    const dropdown = document.createElement("div");
    dropdown.classList.add("header-nav__dropdown");

    list.forEach(item => {
      item.classList.remove("hidden");
      dropdown.append(item);
    });

    return dropdown;
  }

  handleDropdown() {
    this.header.addEventListener("click", e => {
      const target = e.target;

      if (target.tagName.toLowerCase() === "button") {
        target.classList.toggle("open");
      }
    })
  }

}

