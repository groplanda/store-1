export function fixedPanel() {
  fixedPanelHandle('[data-js="fixed-panel"]', '[data-js="wrapper"]');
}

function fixedPanelHandle($el, $wrap) {
  const nav = document.querySelector($el),
        wrapper = document.querySelector($wrap);

  window.addEventListener("scroll", function() {
    const offset = this.pageYOffset || document.documentElement.scrollTop;
    if (offset > 130) {
      nav.classList.add("fixed-panel--fixed");
    } else {
      nav.classList.remove("fixed-panel--fixed");
    }
  })

  const toggleHandler = document.querySelectorAll('[data-js-action="toggle-panel"]');

  if (toggleHandler) {
    toggleHandler.forEach(trigger => {
      trigger.addEventListener("click", togglePanel)
    })
  }

  document.addEventListener("click", e => {
    if (nav.classList.contains("fixed-panel--active")) {
      if (e.target && !e.target.closest('[data-js="fixed-panel"]')) {
        setPanelClasses("close");
      }
    }
  })

  function togglePanel(e) {
    e.stopPropagation();
    let type;

    if(e && e.target) {
      type = e.target.dataset.panel;
    }

    setPanelClasses(type, wrapper, nav);

    const offset = nav.pageYOffset || document.documentElement.scrollTop;


    if (offset > 130) {
      nav.style.top = 20 + "px";
    }

    if (type === "close") {
      nav.style.top = null;
      if (offset > 130) {
        setTimeout(() => nav.classList.add("fixed-panel--fixed"), 100);
      }
    }
  }

  function setPanelClasses(val) {

    const type = (val === 'nav' || val === 'search') ? 'add' : 'remove',
          isSearh = val === 'search' ? 'add' : 'remove',
          closeFilterActiveClass = "fixed-panel__menu-close--filter";

    findCloseBtnEl().classList[isSearh](closeFilterActiveClass);
    wrapper.classList[type]("wrapper--active");
    nav.classList[type]("fixed-panel--active");
    document.body.classList[type]("open-modal");

    if (window.innerWidth > 767) {
      displaySelectedPanel(val);
    }
  }

  function findCloseBtnEl() {
    let btn;
    toggleHandler.forEach(trigger => {
      if (trigger.dataset.panel === "close") {
        btn = trigger;
      }
    })
    return btn;
  }

  function displaySelectedPanel(val) {
    const array = ['fixed-search', 'fixed-nav'];

    array.forEach(el => {
      const panel = document.querySelector(`[data-js="${el}"]`);
      el === `fixed-${val}`
      ? panel.classList.add('active')
      : panel.classList.remove('active');
    })
  }
}
