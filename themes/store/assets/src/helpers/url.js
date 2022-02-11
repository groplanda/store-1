export function setPageParam(param) {
  const path = window.location.href;
  const url = new URL(path);

  Object.keys(param).forEach(key => {
    url.searchParams.set(key, param[key]);
  })

  window.history.pushState({}, '', url.href);
}
