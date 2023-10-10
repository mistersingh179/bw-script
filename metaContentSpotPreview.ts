import getUserId from "./utils/getUserId";
import superjson from "superjson";
import logger from "./utils/logger";

declare var BW_DASHBOARD_BASE_URL: string;

type ElementFilter = (elem: HTMLElement | Element) => Boolean;
const getPreviewSettings = async () => {
  const userId = getUserId();
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/users/${userId}/settings/forPreview`,
    {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  try {
    const text = await res.text();
    const data = await superjson.parse<any>(text);
    logger.info("in setting forPreview  with data: ", data);
    return data as {
      minMetaContentSpotWordLimit: number;
      desiredMetaContentSpotCount: number;
      metaContentSpotSelector: string;
    };
  } catch (err) {
    return null;
  }
};

const getWordCount = (input: string): number => {
  const cleanedContent =
    input.replaceAll(/[\n]+/g, " ").replaceAll(/[\s]+/g, " ") ?? "";
  const words = cleanedContent.split(" ");
  return words.length;
};

const minWordFilter = (minWordLimit: number, elem: HTMLElement | Element) => {
  let textContent = "";
  if (elem.textContent) {
    textContent = elem.textContent.trim();
  }
  const wordCount = getWordCount(textContent)
  const ans = wordCount >= minWordLimit;
  return ans;
};

export const nextWithText = (
  el: HTMLElement | Element
): null | HTMLElement | Element => {
  const nextEl = el.nextElementSibling;
  if (!nextEl) {
    return null;
  }
  if (nextEl.textContent && nextEl.textContent.trim().length > 0) {
    return nextEl;
  } else {
    return nextWithText(nextEl);
  }
};

const getAllElements = (document: Document, selector: string) => {
  let elements = document.querySelectorAll(selector);
  let elementsArr = [...elements];
  return elementsArr;
};

const init = async () => {
  logger.info("in preview.js");

  const bannerElement = document.createElement("div");
  bannerElement.innerHTML = "Meta Content Spot Preview ";
  bannerElement.style.position = "fixed";
  bannerElement.style.top = "0px";
  bannerElement.style.left = "0px";
  bannerElement.style.border = "1 px solid black";
  bannerElement.style.textAlign = "center";
  bannerElement.style.backgroundColor = "#FEEBC8";
  bannerElement.style.color = "#4A5568";
  bannerElement.style.opacity = "0.95";
  bannerElement.style.fontSize = "24px";
  bannerElement.style.padding = "10px";
  bannerElement.style.width = "100%";
  bannerElement.style.zIndex = "999999";
  bannerElement.id = "adSpotPreviewBanner";
  document.body.append(bannerElement);

  const previewSettings = await getPreviewSettings();
  logger.info("previewSettings: ", previewSettings);

  if (previewSettings == null) {
    logger.info("stopping as not able to fetch preview settings");
    return;
  }
  const {
    metaContentSpotSelector,
    minMetaContentSpotWordLimit,
    desiredMetaContentSpotCount,
  } = previewSettings;

  let elementsArr = getAllElements(document, metaContentSpotSelector) as HTMLElement[];
  logger.info("got elements: ", elementsArr);

  for (const elem of elementsArr) {
    elem.style.border = "5px solid #4A5568";
    elem.style.padding = "5px";
    elem.style.backgroundColor = "#FFFFF0";
    elem.title += `PASS – Matches selector ${metaContentSpotSelector} \n\n`;
  }

  for (const [index, elem] of elementsArr.entries()) {
    const ans = minWordFilter(minMetaContentSpotWordLimit, elem);
    if (ans) {
      elem.title += `PASS – min Char filter ${minMetaContentSpotWordLimit} \n\n`;
      elem.style.border = "5px solid #48BB78";
    } else {
      elem.title += `REJECT – min Char filter ${minMetaContentSpotWordLimit} \n\n`;
      elem.style.border = "5px solid #F56565";
    }
  }
  elementsArr = elementsArr.filter(minWordFilter.bind(this, minMetaContentSpotWordLimit));

  for (const [index, elem] of elementsArr.entries()) {
    if (index < desiredMetaContentSpotCount) {
      elem.title += `PASS – item comes before desired ad count is reached ${desiredMetaContentSpotCount}`;
      elem.style.border = "5px solid #48BB78";
    } else {
      elem.title += `REJECT – item comes after desired ad count is reached ${desiredMetaContentSpotCount}`;
      elem.style.border = "5px solid #F56565";
    }
  }
  elementsArr = elementsArr.slice(0, desiredMetaContentSpotCount);

  bannerElement.innerHTML += "Count: " + elementsArr.length;

  // const adSpotBannerElem = document.querySelector("#adSpotPreviewBanner");
  //
  // adSpotBannerElem.innerHTML += elementsArr.length;

};

(() => {
  init();
})();

export {};
