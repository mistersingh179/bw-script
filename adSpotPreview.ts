import getUserId from "./utils/getUserId";
import superjson from "superjson";

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
    console.log("in setting forPreview  with data: ", data);
    return data as {
      minCharLimit: number;
      sameTypeElemWithTextToFollow: boolean;
      desiredAdvertisementSpotCount: number;
      contentSelector: string;
    };
  } catch (err) {
    return null;
  }
};

const minCharFilter = (minCharLimit: number, elem: HTMLElement | Element) => {
  if (!elem.textContent) {
    elem.textContent = "";
  }
  const ans = elem.textContent.length >= minCharLimit;
  if (ans) {
    console.log({ length: elem.textContent.length, minCharLimit }, "keeping");
  } else {
    console.log({ length: elem.textContent.length, minCharLimit }, "rejecting");
  }
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

const nextElementWithTextOfSameTypeFilter: ElementFilter = (elem) => {
  const fElem = nextWithText(elem);
  const ans = fElem?.tagName === elem.tagName;
  if (ans) {
    console.log({ tagName: elem.tagName, fTagName: fElem?.tagName }, "keeping");
  } else {
    console.log(
      { tagName: elem.tagName, fTagName: fElem?.tagName },
      "rejecting"
    );
  }
  return ans;
};

const getAllElements = (document: Document, selector: string) => {
  let elements = document.querySelectorAll(selector);
  let elementsArr = [...elements];
  return elementsArr;
};

const init = async () => {
  console.groupCollapsed("preview.js");
  console.log("in preview.js");

  const bannerElement = document.createElement("div");
  bannerElement.innerHTML = "Ad Spot Preview ";
  bannerElement.style.position='fixed';
  bannerElement.style.top='0px';
  bannerElement.style.left='0px';
  bannerElement.style.border='1 px solid black';
  bannerElement.style.textAlign='center';
  bannerElement.style.backgroundColor='#FEEBC8';
  bannerElement.style.color='#4A5568';
  bannerElement.style.opacity='0.95';
  bannerElement.style.fontSize='24px';
  bannerElement.style.padding='10px';
  bannerElement.style.width="100%";
  bannerElement.id="adSpotPreviewBanner";
  document.body.append(bannerElement);

  const previewSettings = await getPreviewSettings();
  console.log("previewSettings: ", previewSettings);

  if (previewSettings == null) {
    console.log("stopping as not able to fetch preview settings");
    return;
  }
  const {
    contentSelector,
    minCharLimit,
    sameTypeElemWithTextToFollow,
    desiredAdvertisementSpotCount,
  } = previewSettings;

  let elementsArr = getAllElements(document, contentSelector) as HTMLElement[];
  console.log("got elements: ", elementsArr);

  for (const elem of elementsArr) {
    elem.style.border = "5px solid #4A5568";
    elem.style.padding = "5px";
    elem.style.backgroundColor = "#FFFFF0";
    elem.title += "PASS – Matches selector\n\n";
  }

  for (const [index, elem] of elementsArr.entries()) {
    const ans = minCharFilter(minCharLimit, elem);
    if (ans) {
      elem.title += "PASS – min Char filter\n\n";
      elem.style.border = "5px solid #48BB78";
    } else {
      elem.title += "REJECT – min Char filter\n\n";
      elem.style.border = "5px solid #F56565";
    }
  }
  elementsArr = elementsArr.filter(minCharFilter.bind(this, minCharLimit));

  for (const [index, elem] of elementsArr.entries()) {
    // @ts-ignore
    if (sameTypeElemWithTextToFollow == true) {
      const ans = nextElementWithTextOfSameTypeFilter(elem);
      if (ans) {
        elem.title += "PASS –  next element with text of same type filter\n\n";
        elem.style.border = "5px solid #48BB78";
      } else {
        elem.title += "REJECT – next element with text of same type filter\n\n";
        elem.style.border = "5px solid #F56565";
      }
    } else {
      elem.title +=
        "PASS – since setting is off for next element with text of same type filter\n\n";
      elem.style.border = "5px solid #48BB78";
    }
  }
  elementsArr = sameTypeElemWithTextToFollow
    ? elementsArr.filter(nextElementWithTextOfSameTypeFilter)
    : elementsArr;

  for (const [index, elem] of elementsArr.entries()) {
    if (index < desiredAdvertisementSpotCount) {
      elem.title += "PASS – item comes before reaching desired advert count";
      elem.style.border = "5px solid #48BB78";
    } else {
      elem.title += "REJECT – item comes after reaching desired advert count";
      elem.style.border = "5px solid #F56565";
    }
  }
  elementsArr = elementsArr.slice(0, desiredAdvertisementSpotCount);

  bannerElement.innerHTML += "Count: " + elementsArr.length;


  // const adSpotBannerElem = document.querySelector("#adSpotPreviewBanner");
  //
  // adSpotBannerElem.innerHTML += elementsArr.length;

  console.groupEnd();
};

(() => {
  init();
})();

export {};
