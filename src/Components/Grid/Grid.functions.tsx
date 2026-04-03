import { pxToRem } from "../../service/uiHelp";


// Set with to cloned TBODY and THs
export function setWidths(clonedHeadElm: HTMLElement, headElm: HTMLElement) {
  if (!headElm || !clonedHeadElm) {
    return;
  }

  const gridWidth = headElm.parentElement?.parentElement?.offsetWidth;
  clonedHeadElm.style.width = pxToRem(Number(gridWidth)) + 'rem';

  const clonedThs = clonedHeadElm.querySelectorAll('th');
  const originalThs = headElm.querySelectorAll('th');

  // Get and set correct widths for THs
  for (let i = 0; i < originalThs.length; i++) {
    clonedThs[i].style.width = pxToRem(Number(originalThs[i].clientWidth)) + 'rem';
  }
}

// Sync horizontal scrolling between cloned header and original grid
export function syncHorizontalScroll(clonedHeadElm: HTMLElement, headElm: HTMLElement) {
  const s1 = headElm?.parentElement?.parentElement;
  const s2 = clonedHeadElm;

  if (!s1 || !s2) {
    return;
  }

  const scroll01 = () => {
    s2.scrollLeft = s1.scrollLeft;
  };

  const scroll02 = () => {
    s1.scrollLeft = s2.scrollLeft;
  };

  s1.addEventListener('scroll', scroll01, false);
  s2.addEventListener('scroll', scroll02, false);
}

//Hide and show cloned header - in progress
export function hideShowClone(clonedHeadElm: HTMLElement, headElm: HTMLElement) {
  const gridWrapper = headElm?.parentElement?.parentElement;

  if (!gridWrapper) {
    return;
  }

  let topBoundary = gridWrapper.getBoundingClientRect().top;
  let bottomBoundary = gridWrapper.getBoundingClientRect().bottom;

  let gridWrapperHeight = headElm.querySelector('th')?.offsetHeight;

  topBoundary = topBoundary + gridWrapperHeight!;
  bottomBoundary = bottomBoundary - gridWrapperHeight!;

  const header = document.getElementById('moduleHeader');

  if (header) {
    let headerHeight = header.offsetHeight;

    topBoundary = topBoundary! - headerHeight;
    bottomBoundary = bottomBoundary! - headerHeight;
  } else {
    gridWrapper?.style.setProperty('--module-header-height', '0');
  }

  if (topBoundary < 0 && bottomBoundary > 0) {
    clonedHeadElm.classList.add('js-visible');
  } else {
    clonedHeadElm.classList.remove('js-visible');
  }
}
