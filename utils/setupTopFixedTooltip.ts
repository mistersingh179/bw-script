import logger from "./logger";
import "../styles/topFixedTooltip.css";
import { loadCSS } from "./setupMetaContent";
import { debounce } from "lodash";
import { MetaContentSpotsWithMetaContentAndType } from "./auction";
import { Auction } from "../prisma-client-index";

declare var BW_FEEDBACK_URL: string;
declare var BW_DASHBOARD_BASE_URL: string;

const getTopFixedTooltipContainer = () => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div id="bw-top-fixed-tooltip">
      <div class="bw-tooltips">
        <div class="bw-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </div>
      <div class="bw-ad-unit">
        <div id='rectangle_5'></div>
      </div>
      <div class="bw-disclaimer">
        <div>
          Content by 
          <a class="bw-link" target="_blank" href=${BW_FEEDBACK_URL}>BrandWeaver</a> 
          – info quality may vary
          <a class="bw-icon" target="_blank" href=${BW_FEEDBACK_URL}>
            <svg class="bw-inline-tooltip-info-svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>`.trim();

  const containerDiv = template.content.firstChild as HTMLElement;
  return containerDiv;
};

const hideContainer = () => {
  logger.info("in hideContainer");
  const ctaElem = document.querySelector(`#bw-top-fixed-tooltip`)!;
  ctaElem.classList.remove("bw-show");
};

const showContainer = () => {
  logger.info(" in showContainer");
  const ctaElem = document.querySelector(`#bw-top-fixed-tooltip`)!;
  ctaElem.classList.add("bw-show");
};

const setupTopFixedTooltip = (
  aid: string,
  metaContentSpotSelector: string,
  metaContentSpotsWithDetail: MetaContentSpotsWithMetaContentAndType[],
  metaContentToolTipTheme: string,
  auction: Auction,
  topPosTopFixedTooltip: number
) => {
  logger.info("in setupTopFixedTooltip");

  loadCSS();

  if (!metaContentSpotSelector) {
    metaContentSpotSelector = "body p";
  }

  let topMenuSpace = topPosTopFixedTooltip || 0;
  const topHiddenSpace = topMenuSpace + 200;
  const bottomHiddenSpace = 50;

  const getMainElement = (elements: HTMLElement[]) => {
    logger.info("got items: ", elements.length, elements);
    logger.info("will remove stuff which does not start in viewport");

    let elemsStartInVp: HTMLElement[] = [];
    elemsStartInVp = elements.filter((p) => {
      const { y, height } = p.getBoundingClientRect();
      if (y <= topHiddenSpace) {
        logger.info("removing as it starts before viewport: ", y, p);
        return false;
      }
      if (y > document.documentElement.clientHeight - bottomHiddenSpace) {
        logger.info("removing as it starts after viewport: ", y, p);
        return false;
      }
      return true;
    });
    logger.info("we now have: ", elements.length);

    let elemsEndInVp: HTMLElement[] = [];
    if (elemsStartInVp.length > 1) {
      logger.info("removing items which dont end in viewport");
      elemsEndInVp = elemsStartInVp.filter((p) => {
        const { y, height } = p.getBoundingClientRect();
        if (
          y + height >
          document.documentElement.clientHeight - bottomHiddenSpace
        ) {
          logger.info("removing item as not end in viewport: ", y + height, p);
          return false;
        }
        return true;
      });
    }

    let finalElems = elemsStartInVp;
    if (elemsEndInVp.length > 0) {
      finalElems = elemsEndInVp;
    }

    if (finalElems.length === 0) {
      return null;
    } else if (finalElems.length === 1) {
      return finalElems[0];
    } else if (finalElems.length > 1) {
      // return finalElems[finalElems.length - 1];
      return finalElems[0];
    }
  };

  const tooltipContainer = getTopFixedTooltipContainer();

  tooltipContainer.style.top = `${topMenuSpace}px`;

  if (metaContentToolTipTheme === "light") {
    tooltipContainer.classList.add("inverse-colors");
  }

  const allElements = [
    ...document.querySelectorAll(metaContentSpotSelector),
  ] as HTMLElement[];

  metaContentSpotsWithDetail.forEach((mcs) => {
    if (mcs.metaContents.length === 0) {
      return;
    }

    const mcsElement = allElements.find((e) => {
      let textContent = e.textContent?.trim() ?? "";
      textContent = textContent.replaceAll(/[\n]+/g, " ");
      textContent = textContent.replaceAll(/[\s]+/g, " ");
      return textContent.includes(mcs.contentText);
    });
    if (!mcsElement) {
      return;
    }
    mcsElement.setAttribute("bw-mcs-id", mcs.id);
    mcsElement.setAttribute("bw-mc-id", mcs.metaContents[0].id);

    const ttDiv = document.createElement("div");
    ttDiv.className = "bw-tooltip";
    ttDiv.setAttribute("bw-mcs-id", mcs.id);
    ttDiv.setAttribute("bw-mc-id", mcs.metaContents[0].id);

    const titleDiv = document.createElement("div");
    titleDiv.className = "bw-heading";
    titleDiv.innerHTML = mcs.metaContents[0].generatedHeading;
    ttDiv.append(titleDiv);

    const textDiv = document.createElement("div");
    textDiv.innerHTML = mcs.metaContents[0].generatedText;
    ttDiv.append(textDiv);

    tooltipContainer.querySelector(".bw-tooltips")!.append(ttDiv);
  });

  tooltipContainer
    .querySelector("div.bw-close")!
    .addEventListener("click", () => {
      logger.info("You clicked on close");
      document.removeEventListener("scroll", scrollHandlerToShowContainer);
      hideContainer();
      const allP = [
        ...document.querySelectorAll(metaContentSpotSelector),
      ] as HTMLElement[];
      allP.forEach((p) => {
        p.classList.remove("bw-highlight");
      });
    });

  document.querySelector("body")!.append(tooltipContainer);

  const scrollHandlerToShowContainer = debounce(
    () => {
      logger.info(" in scroll handler to show container");
      const allMcsElems = [
        ...document.querySelectorAll(`${metaContentSpotSelector}[bw-mcs-id]`),
      ] as HTMLElement[];

      let mainElement = getMainElement(allMcsElems);
      logger.info("mainElement: ", mainElement);

      allMcsElems.forEach((elem) => {
        elem.classList.remove("bw-highlight");
      });

      if (mainElement) {
        showContainer();
        mainElement.classList.add("bw-highlight");
        const tooltips = [
          ...document.querySelectorAll(
            "#bw-top-fixed-tooltip > div.bw-tooltips > div.bw-tooltip"
          ),
        ] as HTMLElement[];
        for (let i = 0; i < tooltips.length; i++) {
          const tooltipElem = tooltips[i];
          const mainElemMcsId = mainElement.getAttribute("bw-mcs-id");
          const tooltipElemMcsId = tooltipElem.getAttribute("bw-mcs-id");
          if (tooltipElemMcsId === mainElemMcsId) {
            tooltipElem.classList.add("bw-show");
          } else {
            tooltipElem.classList.remove("bw-show");
          }
        }
      } else {
        hideContainer();
      }
    },
    150,
    { trailing: true, maxWait: 1000 }
  );

  document.addEventListener("scroll", scrollHandlerToShowContainer);
};

export default setupTopFixedTooltip;
