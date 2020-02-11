const stopWatchButtons = document.querySelectorAll('.stopwatch__controls > button');
const minSizeQuery = window.matchMedia('(min-width: 992px)');


function resizeButtons(buttons, matches) {
  if (matches) {
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.add('btn-lg'));
  } else {
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.remove('btn-lg'));
  }
}


function resolveBtnSize(event) {
  if (event.target === event.currentTarget) {
    resizeButtons(stopWatchButtons, event.matches);
  } else {
    resizeButtons(stopWatchButtons, minSizeQuery.matches);
  }
}

minSizeQuery.onchange = resolveBtnSize;
window.onload = resolveBtnSize;
