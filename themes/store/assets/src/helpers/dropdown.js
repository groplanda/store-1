export function dropdown() {
  const triggers = document.querySelectorAll('[data-js-action="open-dropdown"]');

  if (triggers) {
    triggers.forEach(trigger => trigger.addEventListener("click", handleDropdown))
  }
}

function handleDropdown(event) {
  event.stopPropagation();
  const target = event.target,
        dropdown = target.nextElementSibling,
        activeTriggerClass = "fixed-panel__menu-btn_active";

  if (!dropdown) {
    return;
  }

  const dropdownHeight = dropdown.scrollHeight || dropdown.clientHeight;

  target.classList.toggle(activeTriggerClass);

  if (target.classList.contains(activeTriggerClass)) {
    dropdown.style.height = dropdownHeight + 'px';
  } else {
    dropdown.style.height = 0;
  }
}
