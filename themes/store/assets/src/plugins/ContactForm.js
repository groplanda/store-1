import axios from 'axios';
import { onValidate, checkErr } from "@/src/helpers/validate.js";

export class ContactForm {
  constructor(formSelector) {
    this.$forms = document.querySelectorAll(formSelector);
    this.errorClass = "active";

    this.init();
  }

  init() {
    this.$forms.forEach(form => {
      form.addEventListener("submit", this.sendData.bind(this))
    })
  }

  sendData(e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);

    this.clearEror(form);

    axios.post("/api/send-message", fd)
          .then(response => {
            const data = response.data;

            if (data.status === "error") {
              let errors = onValidate(data, fd);
              this.handleErrors(form, errors.map(e => e.name), errors)
              return;
            }
            form.reset();
            this.setDoneStatus(form, data);
          })
  }

  handleErrors(formEl, keys, errors) {
    keys.forEach(key => {
      const msgError = checkErr(key, errors);
      if (msgError.length > 0) {
        this.displayError(formEl, key, msgError);
      }
    })
  }

  displayError(formEl, key, error) {
    const errEl = formEl.querySelector(`[data-error-for="${key}"]`);
    if (!errEl) return;

    errEl.classList.add(this.errorClass);
    errEl.textContent = error;
  }

  clearEror(formEl) {
    formEl.querySelectorAll('[data-error-for]').forEach(errEl => {
      errEl.classList.remove(this.errorClass);
      errEl.textContent = "";
    });
  }

  setDoneStatus(formEl, data) {
    const statusEl = formEl.querySelector('[data-js="form-status"]');
    if (statusEl) {
      statusEl.textContent = data.message;
      setTimeout(() => {
        statusEl.textContent = "";
      }, 1500)
    }
  }
}
