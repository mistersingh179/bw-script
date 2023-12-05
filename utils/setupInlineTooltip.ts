import { MetaContentSpotsWithMetaContentAndType } from "./auction";
import "../styles/inlineTooltip.css";
import { MetaContent } from "../prisma-client-index";
import { loadCSS, recordDisplay } from "./setupMetaContent";
import {
  setMetaContentFeedback,
  setMetaContentPercentageScrolled,
} from "./metaContentImpression";
import logger from "./logger";
import { hasScroll, scrollPercentage } from "./scrollbar";
import { debounce, max, once } from "lodash";
import getUserId from "./getUserId";

declare var BW_FEEDBACK_URL: string;
declare var BW_ENV: string;

let showAds = false;
let adProvider: "raptive" | "didna" | "" = "";

if (document.location.hostname === "brandweaver.ai") {
  showAds = true;
  adProvider = "didna";
} else if (document.location.hostname === "localhost") {
  showAds = true;
  adProvider = "raptive";
} else if (document.location.pathname === "/gargling-salt-water-covid-19/") {
  showAds = true;
  adProvider = "raptive";
} else {
  showAds = false;
  adProvider = "";
}
logger.info(" set showAds & adProvider:", showAds, adProvider);

const avilableAdIds = ["rectangle_1"];

const loadDidnaAdTagScript = () => {
  const scriptElem = document.createElement("script");
  scriptElem.type = "text/javascript";
  scriptElem.src =
    "https://storage.googleapis.com/didna_hb/brandweaver/brandweaverai/didna_config.js";
  scriptElem.async = true;
  document.body.appendChild(scriptElem);
};

const debouncedSetMetaContentPercentageRead = debounce(
  setMetaContentPercentageScrolled,
  1000,
  {
    trailing: true,
  }
);

export const reportScrollPercentage = async (evt: Event) => {
  if (evt.currentTarget) {
    const scrollableElement = evt.currentTarget as HTMLElement;
    const mciid = scrollableElement
      .closest<HTMLElement>(".bw-inline-tooltip-container,[data-tippy-root]")!
      .getAttribute("bw-mci-id");
    if (mciid) {
      const newScrollPercentage = scrollPercentage(scrollableElement);
      let maxScrolled: number = parseInt(
        scrollableElement.getAttribute("maxScrolled") || "0"
      );
      if (newScrollPercentage > maxScrolled) {
        maxScrolled = newScrollPercentage;
        scrollableElement.setAttribute("maxScrolled", String(maxScrolled));
        await debouncedSetMetaContentPercentageRead(mciid, maxScrolled);
      }
    }
  }
};

const getAnswerDiv = (
  metaContent: MetaContent,
  metaContentToolTipTheme: string
) => {
  const template = document.createElement("template");
  const themeName =
    metaContentToolTipTheme === "light" ? "bw-inline-tooltip-inverse" : "";
  template.innerHTML = `
<div class="bw-inline-tooltip-container ${themeName}">
  <div class="bw-inline-tooltip-scrollable-content">
    <div class="bw-inline-tooltip-heading-row">
      <div class="bw-inline-tooltip-heading-title">
        <strong>${metaContent.generatedHeading}</strong>
      </div>
      <div class="bw-inline-tooltip-icon">
        <button class="bw-inline-tooltip-close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="bw-inline-tooltip-content"> 
      ${metaContent.generatedText}
    </div>
    <div class="bw-inline-tooltip-feedback">
        <button class="bw-inline-tooltip-thumbs-button" bw-feedback-message="thumbsUp">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentcolor" viewBox="0 0 16 16">
            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
          </svg>
        </button>
        <button class="bw-inline-tooltip-thumbs-button" bw-feedback-message="thumbsDown">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentcolor" viewBox="0 0 16 16">
            <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
          </svg>
        </button>
    </div>
  </div>
  <div class="bw-inline-tooltip-bottom-row">
    <div class="bw-inline-tooltip-diclaimer">
      Content by 
      <a class="bw-inline-tooltip-feedback-link" target="_blank" 
        href=${BW_FEEDBACK_URL}>
        BrandWeaver
      </a> – info quality may vary
    </div>
    <a class="bw-inline-tooltip-feedback-link" target="_blank"
      href=${BW_FEEDBACK_URL}>
        <svg class="bw-inline-tooltip-info-svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
    </a>   
  </div>
</div>
`.trim();
  return template.content.firstChild as HTMLElement;
};

const setupInlineTooltip = (
  aid: string,
  metaContentSpotSelector: string,
  metaContentSpotsWithDetail: MetaContentSpotsWithMetaContentAndType[],
  metaContentToolTipTheme: string
) => {
  logger.info(
    "in setupInlineTooltip with: ",
    metaContentSpotsWithDetail,
    performance.now()
  );

  if(showAds){
    if(adProvider === "didna"){
      loadDidnaAdTagScript();
    }
  }

  loadCSS();

  const showAnswer = async (elem: HTMLElement) => {
    if (!elem.classList.contains("bw-inline-tooltip-visible")) {
      elem.classList.add("bw-inline-tooltip-visible");
    }
    const contentHasScroll = hasScroll(
      elem.querySelector(".bw-inline-tooltip-scrollable-content")!
    );
    const mcid = elem.getAttribute("bw-mc-id")!;
    const mciid = await recordDisplay(aid, mcid, contentHasScroll);
    elem.setAttribute("bw-mci-id", mciid);
    const feedbackLinks = [
      ...elem.querySelectorAll<HTMLAnchorElement>(
        "a.bw-inline-tooltip-feedback-link"
      ),
    ];
    for (const feedbackLink of feedbackLinks) {
      const url = new URL(feedbackLink.href);
      url.searchParams.append("metaContentImpressionId", mciid);
      feedbackLink.href = url.href;
    }
  };

  const handleClose = (evt: MouseEvent) => {
    if (evt.target) {
      const mcElements = document.querySelectorAll(
        ".bw-inline-tooltip-container"
      );
      for (const elem of mcElements) {
        elem.remove();
      }
    }
  };

  const handleFeedbackThumb = (evt: MouseEvent) => {
    if (evt.target) {
      const thumbButton = evt.currentTarget as HTMLButtonElement;
      const feedbackMessage = thumbButton.getAttribute("bw-feedback-message")!;
      const answerElement = thumbButton.closest<HTMLElement>(
        `.bw-inline-tooltip-container`
      )!;
      const mciid = answerElement.getAttribute("bw-mci-id");
      if (mciid) {
        setMetaContentFeedback(mciid, feedbackMessage);
        thumbButton.closest<HTMLElement>(
          ".bw-inline-tooltip-feedback"
        )!.innerHTML = "Thank you for your feedback!";
      }
    }
  };

  const callback = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      const intersecting = entry.isIntersecting;
      const answerBottom = entry.boundingClientRect.bottom;
      const pageTopPortion = document.documentElement.clientHeight * 0.5;
      const answerHalfHeight = entry.boundingClientRect.height * 0.5;
      const id = entry.target.id;

      if (intersecting == true) {
        logger.info("it is visible");
        showAnswer(entry.target as HTMLElement);
      }
    });
  };

  let options = {
    root: null,
    rootMargin: "0px",
    threshold: [0.5],
  };
  let observer = new IntersectionObserver(callback, options);

  if (!metaContentSpotSelector) {
    metaContentSpotSelector = "body p";
  }

  const allElements = [
    ...document.querySelectorAll(metaContentSpotSelector),
  ] as HTMLElement[];

  metaContentSpotsWithDetail = metaContentSpotsWithDetail.filter(
    (mcs) => mcs.metaContents.length > 0
  );

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

    const mcElement = getAnswerDiv(
      mcs.metaContents[0],
      metaContentToolTipTheme
    );
    mcElement.setAttribute("bw-mcs-id", mcs.id);
    mcElement.setAttribute("bw-mc-id", mcs.metaContents[0].id);

    if (showAds) {
      const adDev = document.createElement("div");
      adDev.className = "bw-inline-tooltip-ad-row";
      if (adProvider === "raptive") {
        const rectangleDiv = document.createElement("div");
        rectangleDiv.className = "raptive-custom-ad-320-50";
        adDev.append(rectangleDiv);
      } else if (adProvider === "didna" && avilableAdIds.length > 0) {
        const adId = avilableAdIds.pop()!;
        const rectangleDiv = document.createElement("div");
        rectangleDiv.id = adId;
        adDev.append(rectangleDiv);
      }
      mcElement
        .querySelector(".bw-inline-tooltip-scrollable-content")!
        .after(adDev);
    }

    const closeButton = mcElement.querySelector<HTMLButtonElement>(
      ".bw-inline-tooltip-close-button"
    )!;
    closeButton.addEventListener("click", handleClose);

    const thumbButtons = mcElement.querySelectorAll<HTMLButtonElement>(
      ".bw-inline-tooltip-thumbs-button"
    );
    thumbButtons.forEach((elem) => {
      elem.addEventListener("click", handleFeedbackThumb);
    });

    const scrollableElement = mcElement.querySelector(
      ".bw-inline-tooltip-scrollable-content"
    ) as HTMLElement;

    scrollableElement.addEventListener("scroll", reportScrollPercentage);

    const addTooltip = () => {
      const documentOffsetBottom =
        window.scrollY + document.documentElement.clientHeight;
      const contentSpotOffsetBottom =
        mcsElement.offsetTop + mcsElement.clientHeight;
      if (contentSpotOffsetBottom > documentOffsetBottom) {
        logger.info("adding as spot is after viewport: ", performance.now());
        mcsElement.append(mcElement);
        observer.observe(mcElement);
      } else if (contentSpotOffsetBottom < window.scrollY) {
        logger.info("adding as spot is before viewport: ", performance.now());
        mcsElement.append(mcElement);
        observer.observe(mcElement);
      } else {
        logger.info("skipping build as it will cause CLS: ", performance.now());
        window.addEventListener("scrollend", once(addTooltip));
      }
    };

    addTooltip();
  });
};

export default setupInlineTooltip;
