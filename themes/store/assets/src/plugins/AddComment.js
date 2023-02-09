import axios from 'axios';
import { onValidate, checkErr } from "../helpers/validate.js";

// stars

const starsInput = document.querySelectorAll('[data-js-action="star-rating"]');

if (starsInput) {
  starsInput.forEach(star => {
    star.addEventListener("change", toggleStar)
  })
}

function toggleStar() {
  const starVal = +this.value;
  toggleStarClass(starsInput.length, "remove");
  if (starVal === 1) return;
  toggleStarClass(starVal, "add");
}

function toggleStarClass(count, add) {
  for(let i = 0; i < count; i++) {
    starsInput[i].classList[add]("form__star-input_active");
  }
}

// add comments

const commentForm = document.getElementById("add-comment"),
      errorClass = "form__form-error_active";

if (commentForm) {
  commentForm.addEventListener("submit", addComment)
}

function addComment(e) {
  e.preventDefault();
  const form = this,
        FIELD_KEYS = ['title', 'description', 'star', 'product_id'],
        formData = {};

  clearEror(form);
  FIELD_KEYS.forEach(key => { formData[key] = form[key].value });

  axios.post("/api/add-comment", formData)
  .then(response => {
    const data = response.data;
    if (data.status === "error") {
      let errors = onValidate(data, formData);
      handleErrors(form, FIELD_KEYS, errors);
      return;
    }

    if (data.status === "success") {
      form.reset();
      const successBlock = form.querySelector('[data-comment="done"]');
      successBlock.textContent = data.message;
      setTimeout(() => {
        successBlock.textContent = "";
        closeModal(form);
      }, 2000)
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

function closeModal(form) {
  const close = form.closest('[data-role="modal-close"]');
  close.click();
}
