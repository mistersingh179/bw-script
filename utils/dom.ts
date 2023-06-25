import {
  Advertisement,
  AdvertisementSpot,
  Campaign,
  Impression,
  ScoredCampaign,
} from "../prisma-client-index";
import { markImpressionClicked } from "./impression";

export type AdWithDetail = Advertisement & {
  advertisementSpot: AdvertisementSpot;
  scoredCampaign: ScoredCampaign & { campaign: Campaign };
};

export const nextWithText = (el: Element): null | Element => {
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

export const addLinkToText = (text: string, name: string, link: string) => {
  if (!link || link.length === 0) {
    return text;
  }

  const linkElement = document.createElement("a");
  linkElement.target = "_blank";
  linkElement.href = link;
  linkElement.textContent = name;
  return text.replace(name, linkElement.outerHTML);
};

export const insertAd = (
  targetElem: Element,
  ad: AdWithDetail,
  impression: Impression,
  sponsoredWording: string
) => {
  const advertElem = targetElem.cloneNode() as Element;
  const advertHtml = addLinkToText(
    ad.advertText,
    ad.scoredCampaign.campaign.productName,
    ad.scoredCampaign.campaign.clickUrl
  );
  advertElem.innerHTML = advertHtml + " " + sponsoredWording;
  advertElem.setAttribute("data-inserted-by-bw", "true");
  targetElem.after(advertElem);
  advertElem.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A" || target.tagName === "a") {
      await markImpressionClicked(impression);
    }
  });
};
