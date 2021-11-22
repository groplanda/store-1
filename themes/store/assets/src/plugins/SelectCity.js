import axios from 'axios';

export class SelectCity {
  constructor() {
    this.phones = document.querySelectorAll('[data-contact="phone"]');
    this.city = document.querySelectorAll('[data-contact="name"]');
    this.address = document.querySelectorAll('[data-contact="addess"]');
    this.triggers = document.querySelectorAll('[data-js-action="select-city"]');
    this.keys = ['phones', 'city', 'address'];
    this.activeClass = "contact-modal__name_active";
  }

  init() {
    if (this.triggers.length) {
      const self = this;
      this.triggers.forEach(trigger => {
        trigger.addEventListener("click", this.selectCurrentCity.bind(self))
      });
    }
  }

  fetchCity(id) {
    axios.post("/api/select-city", {city_id: id});
  }

  selectCurrentCity(event) {
    const target = event.target;

    if (target) {
      this.removeActiveTriggers();
      target.classList.add(this.activeClass);

      let value = {};
      this.keys.forEach(key => value[key] = target.dataset[key]);

      this.keys.forEach(key => {
        for(let i = 0; i < this[key].length; i++) {
          const item = this[key][i];
          if (item.classList.contains("js-phone-btn")) {
            item.href = value[key];
          } else if(item.classList.contains("js-phone-text")) {
            item.href = value[key];
            item.textContent = value[key];
          } else {
            item.textContent = value[key];
          }
        }
      })

      const cityId = target.dataset.cityId;
      this.fetchCity(cityId);
    }
  }

  removeActiveTriggers() {
    this.triggers.forEach(t => t.classList.remove(this.activeClass));
  }
}