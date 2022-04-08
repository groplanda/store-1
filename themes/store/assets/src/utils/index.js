export function createFormData(data) {
  const fd = new FormData();
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return fd;
}

export function setPageParam(param) {
  const path = window.location.href;
  const url = new URL(path);

  Object.keys(param).forEach(key => {
    url.searchParams.set(key, param[key]);
  })

  window.history.pushState({}, '', url.href);
}

export function getCategorySlug() {
  const path = window.location.href;
  const url = new URL(path);
  return url.pathname.split('/').pop();
}

export function checkErr(prop, errors) {
  let msg = '';
  errors.forEach(err => {
    if(err.name === prop) {
        msg = err.message;
    }
  })
  return msg;
}

export function onValidate(arrayErrors, form) {
  let errors = [];

  for(let errorKey in arrayErrors) {
    if(Array.isArray(arrayErrors[errorKey])) {
      // eslint-disable-next-line no-prototype-builtins
      if(form.hasOwnProperty(errorKey) || form.has(errorKey)) {
        arrayErrors[errorKey].forEach(err => {
          errors.push({name: errorKey, message: err})
        })
      }
    }
  }

  return errors;
}

export function createMessage(result) {
  const alert = document.createElement("div");

 alert.classList.add("cart-alert", `cart-alert_${result.key}`);
 alert.textContent = result.message;

 document.body.append(alert)
 setTimeout(() => {
  alert.remove();
 }, 2500)
}
