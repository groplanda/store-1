import axios from 'axios';
import { onValidate, checkErr } from "@/src/helpers/validate.js";

const registerForm = document.getElementById("registerUser");
const authForm = document.getElementById("authUser");
const errorClass = "modal__form-error_active";

if (registerForm) {
  registerForm.addEventListener("submit", registerUser)
}

if (authForm) {
  authForm.addEventListener("submit", authUser)
}

isUserLogin();

function registerUser(e) {
  e.preventDefault();
  const form = this,
        FIELD_KEYS = ['name', 'email', 'password', 'password_confirmation', 'is_subscribe'],
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
        FIELD_KEYS = ['login', 'password'],
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

function isUserLogin() {
  const accountLink = document.querySelector(".js-account"),
        mobileAccountLink = document.querySelector(".js-mobile-account"),
        signLink = document.querySelector(".js-sign");
  axios.get("/api/user/isUserLogin")
  .then(response =>  {
    if (response.data) {
      accountLink.classList.remove("header__topbar-link_hide");
      signLink.classList.add("header__topbar-link_hide");
      mobileAccountLink.href = "/account";
      mobileAccountLink.removeAttribute("data-js-action");
    }
  })
}

function createRedirect() {
  const url = new URL(`${process.env.MIX_URL}/account`);
  window.location.href = url;
}