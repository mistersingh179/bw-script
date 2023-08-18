import getUserId from "./utils/getUserId";
import { generateAuction, updateTimeSpent } from "./utils/auction";
import { generateImpression } from "./utils/impression";
import { insertAd, insertStyles } from "./utils/dom";
import { Impression } from "./prisma-client-index";
import getCategories from "./utils/categories/getCategories";
import setupMetaContent from "./utils/setupMetaContent";
import mobileCheck from "./utils/mobileCheck";
import { getCleanUrl } from "./utils/url";
import getMetaContent, { getMetaContentUrls } from "./data/getMetaContent";

declare var BW_DASHBOARD_BASE_URL: string;

const init = async () => {
  console.groupCollapsed("bw.js");
  console.log("in bw.js from bw-script");

  const userId = getUserId();
  console.log("got userId: ", userId);

  const auctionResponse = await generateAuction();
  if (auctionResponse === null) {
    console.log("aborting as no auction response");
    return;
  }

  console.log("setting up start time to now");
  let startTime = new Date().getTime();
  let totalTime = 0;

  document.addEventListener("visibilitychange", (event) => {
    console.log("visibilityChange event fired: ", document.visibilityState);
    if (document.visibilityState === "hidden") {
      const endTime = new Date().getTime();
      const visibleTime = endTime - startTime;
      totalTime += visibleTime;
      console.log("total time on site: ", Math.floor(totalTime / 1000));
      updateTimeSpent(auctionResponse.auction.id, Math.floor(totalTime / 1000));
    } else if (document.visibilityState === "visible") {
      console.log("resetting start time to now");
      startTime = new Date().getTime();
    }
  });

  if (mobileCheck() == false) {
    console.log("Not on mobile");
    const metaContentUrls = getMetaContentUrls();
    if (
      metaContentUrls.includes(getCleanUrl(window.document.location.href)) ||
      metaContentUrls.includes(window.document.location.href)
    ) {
      console.log("we have meta content for this url");
      setupMetaContent(auctionResponse.auction.id, auctionResponse.settings.mainPostBodySelector);
    } else {
      console.log("NO meta content for this url");
    }
  }

  const { auction, adsWithDetail, settings, abortCategoryNames } =
    auctionResponse;

  console.log("user has abort Categories: ", abortCategoryNames);

  if (abortCategoryNames.length > 0) {
    const myCategories = getCategories();
    console.log("this page has categories: ", myCategories);
    for (const myCategory of myCategories) {
      if (abortCategoryNames.includes(myCategory)) {
        console.log("aborting because page has abort category:", myCategory);
        return;
      }
    }
  }

  console.log("got auction ", auction.id, " and ads: ", adsWithDetail.length);

  if (adsWithDetail.length === 0) {
    console.log("aborting as no ads found");
    return;
  }

  const { customStyles } = settings;
  if (customStyles && customStyles.length > 0) {
    try {
      const re = /\.brandweaver-ad.*?\}/gms;
      const ans = customStyles.match(re);
      if (ans && ans[0] && ans[0].length > 0) {
        console.log("adding styles: ");
        console.log(ans[0]);
        insertStyles(ans[0]);
      }
    } catch (err) {
      console.error("unable to apply styles: ", err);
    }
  }

  console.time("processAds");
  let elements = document.querySelectorAll(`body p:not(empty)`);
  let elementsArr = Array.from(elements);
  console.groupCollapsed("processing Ads");
  console.log("elements count: ", elementsArr.length);

  const adsAlreadyPlaces: { [key: string]: boolean } = {};

  for (let i = 0; i < elementsArr.length; i++) {
    const currentElement = elementsArr[i];
    let currentText = currentElement.textContent?.trim() ?? "";
    currentText = currentText.replaceAll(/[\n]+/g, " ");
    currentText = currentText.replaceAll(/[\s]+/g, " ");

    let elementHasMatch = false;
    console.groupCollapsed(
      "checking element: " + i + " " + currentText?.substring(0, 30)
    );
    for (let j = 0; j < adsWithDetail.length; j++) {
      let adSpotHasMatch = false;
      const ad = adsWithDetail[j];
      if (adsAlreadyPlaces[ad.id]) {
        continue;
      }
      const adSpot = ad.advertisementSpot;
      const beforeParaText = adSpot.beforeText.split(" \n ").slice(-1)[0];
      console.groupCollapsed(
        "checking adSpot: " + j + " " + beforeParaText.substring(0, 30)
      );
      console.log("   currentText: ", currentText);
      console.log("beforeParaText: ", beforeParaText);
      // console.log(" After: ", adSpot.afterText);
      if (currentText.includes(beforeParaText)) {
        elementHasMatch = true;
        adSpotHasMatch = true;
        console.log(currentElement);
        console.log(
          "%c This currentText includes beforeParaText. will INSERT ad here",
          "background: #222; color: #bada55"
        );
        const impression: Impression = await generateImpression(auction, ad);
        insertAd(currentElement, ad, impression, settings);
        adsAlreadyPlaces[ad.id] = true;
        // console.log(
        //   "%c this MATCHES beforeText. will now check its next element with afterText",
        //   "background: #222; color: #bada55"
        // );

        // const nextElement = nextWithText(elementsArr[i]);
        // const nextText = nextElement.textContent?.trim();
        // console.log("next element has text: ", nextText?.substring(0, 30));

        // if (nextText === adSpot.afterText) {
        //   console.log(
        //     "%c this MATCHES our afterText. WINNER",
        //     "background: #222; color: #bada55"
        //   );
        //   console.log("will INSERT ad here");
        //   const impression: Impression = await generateImpression(auction, ad);
        //   insertAd(currentElement, ad, impression);
        // } else {
        //   console.log(
        //     "%c no match on after Text, even though before Text matched",
        //     "background: #222; color: #bada55"
        //   );
        // }
      } else {
        console.log("no match on before Text");
      }
      console.groupEnd();
      if (adSpotHasMatch == true) {
        console.log(
          "%c This ad spot above has the match",
          "background: #bee3f8; color: #2D3748"
        );
        adSpotHasMatch = false;
      }
    }
    console.groupEnd();
    if (elementHasMatch == true) {
      console.log(
        "%c This element above has a match",
        "background: #C6F6D5; color: #2D3748"
      );
      elementHasMatch = false;
    }
  }
  console.groupEnd();
  console.timeEnd();
  console.timeLog("processAds");
  console.groupEnd();
};

init();
