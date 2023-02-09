import axios from 'axios';
import { onValidate, checkErr } from "../helpers/validate.js";

const registerForm = document.getElementById("registerUser");
const authForm = document.getElementById("authUser");
const errorClass = "modal__form-error_active";

if (registerForm) {
  registerForm.addEventListener("submit", registerUser)
}

if (authForm) {
  authForm.addEventListener("submit", authUser)
}

function registerUser(e) {
  e.preventDefault();
  const form = this,
        FIELD_KEYS = ['name', 'email', 'password', 'password_confirmation', 'is_subscribe', '_session_key', '_token'],
        formData = {};

  FIELD_KEYS.forEach(key => { formData[key] = form[key].value });

  axios.post("/api/user/register", formData)
    .then(response => {
      const data = response.data;
      if (data.status === "error") {
        let errors = onValidate(data, formData);
        handleErrors(form, FIELD_KEYS, errors);
        return;
      }

      if (data.status === "success") {
        createRedirect();
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

function authUser(e) {
  e.preventDefault();
  const form = this,
        FIELD_KEYS = ['login', 'password', '_session_key', '_token'],
        formData = {};

  clearEror(form)
  FIELD_KEYS.forEach(key => { formData[key] = form[key].value })

  axios.post("/api/user/auth", formData)
    .then(response => {
      const data = response.data;

      if (data.status === "error") {
        let errors = onValidate(data, formData);
        handleErrors(form, FIELD_KEYS, errors);
        return;
      }

      if (data.status === "success") {
        createRedirect();
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

function clearEror(formEl) {
  formEl.querySelectorAll('[data-error-for]').forEach(errEl => {
    errEl.classList.remove(errorClass);
    errEl.textContent = "";
  });
}

function displayError(formEl, key, error) {
  const errEl = formEl.querySelector(`[data-error-for="${key}"]`);
  errEl.classList.add(errorClass);
  errEl.textContent = error;
}

function handleErrors(formEl, keys, errors) {
  keys.forEach(key => {
    const msgError = checkErr(key, errors);
    if (msgError.length > 0) {
      displayError(formEl, key, msgError);
    }
  })
}


function createRedirect() {
  const url = new URL(`${process.env.MIX_URL}/account`);
  window.location.href = url;
}

const reserPasswordForm = document.getElementById("reset-password"),
      resetSuccessMsg = document.getElementById("reset-success");

if (reserPasswordForm) {
  reserPasswordForm.addEventListener("submit", resetPassword);
}

function resetPassword(e) {
  e.preventDefault();
  const form = this,
        formData = {};

  clearEror(form)
  formData.email = form.email.value

  axios.post("/api/user/reset-password", formData)
    .then(response => {
      const data = response.data;

      if (data.status === "error") {
        let errors = onValidate(data, formData);
        handleErrors(form, ['email'], errors);
        return;
      }

      if (data.status === "success") {
        const trigger = createTrigger("reset-success");
        document.body.appendChild(trigger);
        resetSuccessMsg.innerHTML = data.message;
        trigger.click();
        trigger.remove();
        form.reset();
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}
const restorePasswordForm = document.getElementById("restore-password");

if (restorePasswordForm) {
  restorePasswordForm.addEventListener("submit", restorePassword);
}

function restorePassword(e) {
  e.preventDefault();
  const form = this,
        FIELD_KEYS = ['code', 'password'],
        formData = {};

  clearEror(form)
  FIELD_KEYS.forEach(key => { formData[key] = form[key].value })

  axios.post("/api/user/restore-password", formData)
    .then(response => {
      const data = response.data;

      if (data.status === "error") {
        let errors = onValidate(data, formData);
        handleErrors(form, FIELD_KEYS, errors);
        return;
      }

      if (data.status === "success") {
        const responseMsg = form.querySelector('[data-js-action="response"]');
        responseMsg.textContent = data.message;
        form.reset();

        setTimeout(() => {
          const url = new URL(process.env.MIX_URL);
          window.location.href = url;
        }, 2000)
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

function createTrigger(target) {
  const trigger = document.createElement('a');
  trigger.setAttribute('data-js-action', 'open-modal');
  trigger.setAttribute('data-type-modal', target);
  trigger.style.cssText = 'position:absolute;opacity:0;z-index:-1';
  return trigger;
}
