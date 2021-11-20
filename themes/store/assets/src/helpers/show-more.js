(function(){

const showMore = document.querySelector('[data-js-action="open-category"]'),
      activeShowMoreClass = "home-category__open_active";

if (showMore) {
  showMore.addEventListener("click", showCategories);
}

function showCategories() {
  const showMoreText = this.firstElementChild,
        categories = document.querySelectorAll(".home-category__item_hide"),
        catHeight = categories[0].firstElementChild.offsetHeight + 20;

  this.classList.toggle(activeShowMoreClass);

  if (this.classList.contains(activeShowMoreClass)) {
    showMoreText.textContent = "Свернуть";
    updateHeightCategories(categories, catHeight);
  } else {
    showMoreText.textContent = "Посмотреть все";
    updateHeightCategories(categories);
  }
}


function updateHeightCategories(categories, height = 0) {
  categories.forEach(cat => {
    Object.assign(cat.style, {
      height: height + 'px',
      overflow: height === 0 ? 'hidden' : 'initial',
    });
  })
}

// const showMoreTrigger = document.querySelectorAll('[data-js-action="show-more-trigger"]'),
//       activeBtnClass = "content__more_active",
//       activeContentClass = "content__entry_open";

// if (showMoreTrigger) {
//   showMoreTrigger.forEach(trigger => {
//     trigger.addEventListener("click", showMore)
//   })
// }

// function showMore() {
//   const content = this.previousElementSibling;
//   if (!content.dataset.jsAction === "show-more-content") return;
//   this.classList.toggle(activeBtnClass);

//   if (this.classList.contains(activeBtnClass)) {
//     content.classList.add(activeContentClass);
//     content.style.height = content.scrollHeight + "px";
//   } else {
//     content.style.height = "197px";
//     content.classList.remove(activeContentClass)
//   }
// }



})();