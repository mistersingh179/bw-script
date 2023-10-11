// scrollHeight -> Total height of the content in the element if it had no scroll in it
// scrollTop -> how much of the item has been scrolled out of view
// clientHeight -> how much content fits in the element at one time

// so we have read everything if:
// so how much fits + how much has been scrolled out === total content height

// and there is a scrollbar if:
// scrollHeight > clientHeight
// when scrollHeight === clientHeight, it means everything is fitting

import logger from "./logger";

export const scrollPercentage = (elem: HTMLElement): number => {
  const readContent = elem.clientHeight + elem.scrollTop;
  const totalContent = elem.scrollHeight;
  const percentageRead = Math.round((readContent / totalContent) * 100);
  // logger.info("scroll Percentage: ", readContent, totalContent, percentageRead);
  return percentageRead;
}

export const hasScroll = (elem: HTMLElement): boolean => {
  // logger.info("has scroll: ", elem.scrollHeight, elem.clientHeight);
  if(elem.scrollHeight > elem.clientHeight){
    return true
  }else{
    return false
  }
}

