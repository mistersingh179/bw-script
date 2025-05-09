import tippy, { followCursor } from "tippy.js";
import "../styles/hoverTooltip.css"; // optional for styling
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/material.css";
import "tippy.js/themes/translucent.css";
import { once, sample } from "lodash";
import { MetaContentSpotsWithMetaContentAndType, updateExtra } from "./auction";
import { MetaContent } from "../prisma-client-index";
import { setMetaContentFeedback } from "./metaContentImpression";
import { loadCSS, recordDisplay } from "./setupMetaContent";
import logger from "./logger";
import { hasScroll } from "./scrollbar";
import { reportScrollPercentage } from "./setupInlineTooltip";

const setupHoverTooltip = async (
  aid: string,
  metaContentSpotSelector: string,
  metaContentSpotsWithDetail: MetaContentSpotsWithMetaContentAndType[],
  metaContentToolTipTheme: string,
  metaContentToolTipTextColor: string
) => {
  logger.info("in setupMetaContent with: ", metaContentSpotsWithDetail);

  if (!metaContentSpotSelector) {
    metaContentSpotSelector = "body p";
  }

  const processElement = (para: HTMLElement) => {
    const {
      top: paraTop,
      bottom: paraBottom,
      left: paraLeft,
      right: paraRight,
      height: paraHeight,
      width: paraWidth,
    } = para.getBoundingClientRect();

    const tippyBoundingBox = document
      .querySelector("[data-tippy-root]")
      ?.getBoundingClientRect();

    if (paraTop <= mouseYInViewPort && paraBottom >= mouseYInViewPort) {
      // mouse is within paras Y space
      if (!tippyBoundingBox) {
        // there is no tippy box being shown, LET's trigger the mouse enter
        para.dispatchEvent(
          new MouseEvent("mouseenter", {
            clientX: paraLeft + 1,
            clientY: paraTop + paraHeight / 2,
          })
        );
      } else {
        // there is a tippy box. need to check if mouse is inside the tippy
        const {
          top: tippyTop,
          bottom: tippyBottom,
          left: tippyLeft,
          right: tippyRight,
        } = tippyBoundingBox;
        if (
          tippyTop <= mouseYInViewPort &&
          tippyBottom >= mouseYInViewPort &&
          tippyLeft <= mouseXInViewPort &&
          tippyRight >= mouseXInViewPort
        ) {
          // we are in the tippy box. WILL NOT trigger mouse enter
        } else {
          // we are not in the tippy box. LET's trigger mouse enter
          para.dispatchEvent(
            new MouseEvent("mouseenter", {
              clientX: paraLeft + 1,
              clientY: paraTop + paraHeight / 2,
            })
          );
        }
      }
    } else {
      // mouse has left the para's Y zone. LET'S trigger the mouse leave
      // this will hide it only if not in the interactive zone
      para.dispatchEvent(
        new MouseEvent("mouseleave", {
          clientX: mouseXInViewPort + 1,
          clientY: mouseYInViewPort,
        })
      );
    }
  };

  let mouseYInViewPort = 0;
  let mouseXInViewPort = 0;
  let lastMouseEvent: MouseEvent;

  window.document.addEventListener("mousemove", (event) => {
    mouseYInViewPort = event.clientY;
    mouseXInViewPort = event.clientX;
    lastMouseEvent = event;
    const allParas = [...document.querySelectorAll(metaContentSpotSelector)];
    for (const para of allParas) {
      processElement(para as HTMLElement);
    }
  });

  window.document.addEventListener("scroll", (event) => {
    const allParas = [...document.querySelectorAll(metaContentSpotSelector)];
    for (const para of allParas) {
      processElement(para as HTMLElement);
    }
  });

  loadCSS();

  const getMetaDiv = (item: MetaContent) => {
    const metaDiv = document.createElement("div");
    metaDiv.style.maxHeight =
      document.documentElement.clientHeight * 0.8 + "px";
    metaDiv.style.overflowY = "auto";
    metaDiv.style.color = "inherit";
    metaDiv.style.backgroundColor = "inherit";
    metaDiv.addEventListener("scroll", reportScrollPercentage);

    const heading = document.createElement("p");
    heading.style.fontSize = "18px";
    heading.style.fontWeight = "700";
    heading.style.color = metaContentToolTipTextColor || "inherit";
    heading.style.backgroundColor = "inherit";
    heading.innerHTML = item.generatedHeading;
    metaDiv.appendChild(heading);

    const generatedTextArray = item.generatedText.split(/\n|\\n/);

    generatedTextArray.forEach((generatedTextItem, idx) => {
      if (generatedTextItem === "") {
        return;
      }

      const p = document.createElement("p");
      p.style.fontSize = "18px";
      p.style.paddingBottom = "0px";
      p.style.marginBottom = "0px";
      p.style.color = metaContentToolTipTextColor || "inherit";
      p.style.backgroundColor = "inherit";
      p.innerHTML = generatedTextItem.trim();
      if (idx > 0) {
        p.style.display = "none";
      }
      metaDiv.appendChild(p);
    });

    const thanksDiv = document.createElement("div");
    thanksDiv.innerHTML = "Thanks!";
    thanksDiv.style.opacity = "0";
    thanksDiv.style.color = metaContentToolTipTextColor || "inherit";
    thanksDiv.style.backgroundColor = "inherit";
    thanksDiv.style.display = "none";

    const feedbackDiv = document.createElement("div");
    feedbackDiv.style.display = "flex";
    feedbackDiv.style.flexDirection = "row";
    feedbackDiv.style.justifyContent = "space-evenly";
    feedbackDiv.style.backgroundColor = "inherit";
    feedbackDiv.style.color = "inherit";

    const thumbsUpButton = document.createElement("button");
    thumbsUpButton.style.backgroundColor = "transparent";
    thumbsUpButton.style.cursor = "pointer";
    thumbsUpButton.style.border = "none";
    thumbsUpButton.style.padding = "5px";
    thumbsUpButton.innerHTML = "👍";
    thumbsUpButton.addEventListener("click", (evt) => {
      const targetElement = evt.target as HTMLElement;
      const popperElement = targetElement.closest("[mciid]");
      const mciid = popperElement?.getAttribute("mciid");
      if (mciid) {
        setMetaContentFeedback(mciid, "thumbsUp");
        feedbackDiv.style.opacity = "0";
        feedbackDiv.style.transition = "opacity 400ms";
        feedbackDiv.style.display = "none";
        thanksDiv.style.opacity = "1";
        thanksDiv.style.transition = "opacity 400ms";
        thanksDiv.style.display = "block";
      }
    });
    const thumbsDownButton = document.createElement("button");
    thumbsDownButton.style.backgroundColor = "transparent";
    thumbsDownButton.style.cursor = "pointer";
    thumbsDownButton.style.border = "none";
    thumbsDownButton.style.padding = "5px";
    thumbsDownButton.innerHTML = "👎";
    thumbsDownButton.addEventListener("click", (evt) => {
      const targetElement = evt.target as HTMLElement;
      const popperElement = targetElement.closest("[mciid]");
      const mciid = popperElement?.getAttribute("mciid");
      if (mciid) {
        setMetaContentFeedback(mciid, "thumbsDown");
        feedbackDiv.style.opacity = "0";
        feedbackDiv.style.transition = "opacity 400ms";
        feedbackDiv.style.display = "none";
        thanksDiv.style.opacity = "1";
        thanksDiv.style.transition = "opacity 400ms";
        thanksDiv.style.display = "block";
      }
    });
    feedbackDiv.appendChild(thumbsUpButton);
    feedbackDiv.appendChild(thumbsDownButton);

    if (generatedTextArray.length > 1) {
      const button = document.createElement("button");
      button.innerHTML = "Read More";
      button.style.marginBottom = "10px";
      button.style.float = "right";
      button.addEventListener("click", (evt) => {
        const targetElement = evt.target as HTMLElement;
        if (targetElement) {
          targetElement.parentElement?.parentElement
            ?.querySelectorAll("p")
            .forEach((x) => (x.style.display = "block"));
          targetElement.style.display = "none";
        }
      });
      feedbackDiv.appendChild(button);
    }

    metaDiv.appendChild(thanksDiv);
    metaDiv.appendChild(feedbackDiv);
    return metaDiv;
  };

  const allElements = [
    ...document.querySelectorAll(metaContentSpotSelector),
  ] as HTMLElement[];

  metaContentSpotsWithDetail.forEach((item, index) => {
    if (item.metaContents.length === 0) {
      return;
    }

    const element = allElements.find((e) => {
      let textContent = e.textContent?.trim() ?? "";
      textContent = textContent.replaceAll(/[\n]+/g, " ");
      textContent = textContent.replaceAll(/[\s]+/g, " ");
      return textContent.includes(item.contentText);
    });

    if (element) {
      const spaceNeededForTippy = element.getBoundingClientRect().right + 350;
      const viewportWidth = window.innerWidth;
      logger.info("building tippy: ", spaceNeededForTippy, viewportWidth);
      if (spaceNeededForTippy > viewportWidth) {
        logger.info("WONT build tippy: ", spaceNeededForTippy, viewportWidth);
      } else {
        tippy(element, {
          theme: metaContentToolTipTheme,
          appendTo: document.body,
          // trigger: "click",
          // hideOnClick: false,
          zIndex: 2147483647,
          interactive: true,
          content: getMetaDiv(item.metaContents[0]),
          allowHTML: true,
          placement: "right",
          followCursor: "vertical",
          plugins: [followCursor],
          onShown: once((instance) => {
            (async () => {
              const scrollingDiv = instance.popper.querySelector(
                ".tippy-content > div"
              )!;
              const contentHasScroll = hasScroll(scrollingDiv);
              const mciid = await recordDisplay(
                aid,
                item.metaContents[0].id,
                contentHasScroll
              );
              instance.popper.setAttribute("mciid", mciid);
              instance.popper.setAttribute("bw-mci-id", mciid);
            })();
          }),
        });
      }
    }
  });
};

export default setupHoverTooltip;
