export function scrollToUp() {
  const upBtn = document.getElementById('up-btn');

  window.addEventListener("scroll", () => {
    const offset = window.pageYOffset || document.documentElement.scrollTop;
    if (offset > 500) {
      upBtn.classList.add("footer__up--show");
    } else {
      upBtn.classList.remove("footer__up--show");
    }
  })

  upBtn.addEventListener("click", () => {
    document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}
