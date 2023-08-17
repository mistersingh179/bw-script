import {
  Advertisement,
  AdvertisementSpot,
  Campaign,
  Impression,
  ScoredCampaign,
} from "../prisma-client-index";
import { markImpressionClicked } from "./impression";
import { LimitedSettingsType } from "./auction";

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

export const addLinkToText = (
  text: string,
  name: string,
  link: string,
  makeLinksBold: boolean
) => {
  if (!link || link.length === 0) {
    return text;
  }

  const linkElement = document.createElement("a");
  linkElement.target = "_blank";
  linkElement.href = link;
  linkElement.textContent = name;
  if (makeLinksBold) {
    linkElement.style.fontWeight = "bold";
  }
  return text.replace(name, linkElement.outerHTML);
};

export const insertStyles = (styles: string) => {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
};

export const insertAd = (
  targetElem: Element,
  ad: AdWithDetail,
  impression: Impression,
  settings: LimitedSettingsType
) => {
  const { sponsoredWording, makeLinksBold } = settings;
  let advertElem = targetElem.cloneNode() as HTMLElement;
  if (
    ad.scoredCampaign.campaign.creativeUrl &&
    ad.scoredCampaign.campaign.clickUrl
  ) {
    const linkElem = document.createElement("a");
    linkElem.target = "_blank";
    linkElem.href = ad.scoredCampaign.campaign.clickUrl;

    const imageElem = document.createElement("img");
    imageElem.src = ad.scoredCampaign.campaign.creativeUrl;
    linkElem.appendChild(imageElem);
    advertElem.appendChild(linkElem);

    linkElem.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      await markImpressionClicked(impression);
    });
  } else {
    const advertHtml = addLinkToText(
      ad.advertText,
      ad.scoredCampaign.campaign.productName,
      ad.scoredCampaign.campaign.clickUrl,
      makeLinksBold
    );
    advertElem.innerHTML = advertHtml + " " + sponsoredWording;
    advertElem.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" || target.tagName === "a") {
        await markImpressionClicked(impression);
      }
    });
    advertElem.classList.add("brandweaver-ad");
  }

  advertElem.setAttribute("data-inserted-by-bw", "true");
  targetElem.after(advertElem);
};
