import getUserId from "./utils/getUserId";
import { generateAuction, updateTimeSpent } from "./utils/auction";
import { generateImpression } from "./utils/impression";
import { insertAd, insertStyles } from "./utils/dom";
import { Impression } from "./prisma-client-index";
import getCategories from "./utils/categories/getCategories";
import setupMetaContent from "./utils/setupMetaContent";
import logger from "./utils/logger";

declare var BW_DASHBOARD_BASE_URL: string;

const init = async () => {
  logger.info("in bw.js from bw-script");

  const userId = getUserId();
  logger.info("got userId: ", userId);

  const auctionResponse = await generateAuction();
  if (auctionResponse === null) {
    logger.info("aborting as no auction response");
    return;
  }

  logger.info("setting up start time to now");
  let startTime = new Date().getTime();
  let totalTime = 0;

  document.addEventListener("visibilitychange", (event) => {
    logger.info("visibilityChange event fired: ", document.visibilityState);
    if (document.visibilityState === "hidden") {
      const endTime = new Date().getTime();
      const visibleTime = endTime - startTime;
      totalTime += visibleTime;
      logger.info("total time on site: ", Math.floor(totalTime / 1000));
      updateTimeSpent(auctionResponse.auction.id, Math.floor(totalTime / 1000));
    } else if (document.visibilityState === "visible") {
      logger.info("resetting start time to now");
      startTime = new Date().getTime();
    }
  });

  setupMetaContent(auctionResponse);

  const { auction, adsWithDetail, settings, abortCategoryNames } =
    auctionResponse;

  logger.info("user has abort Categories: ", abortCategoryNames);

  if (abortCategoryNames.length > 0) {
    const myCategories = getCategories();
    logger.info("this page has categories: ", myCategories);
    for (const myCategory of myCategories) {
      if (abortCategoryNames.includes(myCategory)) {
        logger.info("aborting because page has abort category:", myCategory);
        return;
      }
    }
  }

  logger.info("got auction ", auction.id, " and ads: ", adsWithDetail.length);

  if (adsWithDetail.length === 0) {
    logger.info("aborting as no ads found");
    return;
  }

  const { customStyles } = settings;
  if (customStyles && customStyles.length > 0) {
    try {
      const re = /\.brandweaver-ad.*?\}/gms;
      const ans = customStyles.match(re);
      if (ans && ans[0] && ans[0].length > 0) {
        logger.info("adding styles: ");
        logger.info(ans[0]);
        insertStyles(ans[0]);
      }
    } catch (err) {
      logger.error("unable to apply styles: ", err);
    }
  }

  let elements = document.querySelectorAll(`body p:not(empty)`);
  let elementsArr = Array.from(elements);
  logger.info("elements count: ", elementsArr.length);

  const adsAlreadyPlaces: { [key: string]: boolean } = {};

  for (let i = 0; i < elementsArr.length; i++) {
    const currentElement = elementsArr[i];
    let currentText = currentElement.textContent?.trim() ?? "";
    currentText = currentText.replaceAll(/[\n]+/g, " ");
    currentText = currentText.replaceAll(/[\s]+/g, " ");

    let elementHasMatch = false;
    for (let j = 0; j < adsWithDetail.length; j++) {
      let adSpotHasMatch = false;
      const ad = adsWithDetail[j];
      if (adsAlreadyPlaces[ad.id]) {
        continue;
      }
      const adSpot = ad.advertisementSpot;
      const beforeParaText = adSpot.beforeText.split(" \n ").slice(-1)[0];
      logger.info("   currentText: ", currentText);
      logger.info("beforeParaText: ", beforeParaText);
      // logger.info(" After: ", adSpot.afterText);
      if (currentText.includes(beforeParaText)) {
        elementHasMatch = true;
        adSpotHasMatch = true;
        logger.info(currentElement);
        logger.info(
          "%c This currentText includes beforeParaText. will INSERT ad here",
          "background: #222; color: #bada55"
        );
        const impression: Impression = await generateImpression(auction, ad);
        insertAd(currentElement, ad, impression, settings);
        adsAlreadyPlaces[ad.id] = true;
        // logger.info(
        //   "%c this MATCHES beforeText. will now check its next element with afterText",
        //   "background: #222; color: #bada55"
        // );

        // const nextElement = nextWithText(elementsArr[i]);
        // const nextText = nextElement.textContent?.trim();
        // logger.info("next element has text: ", nextText?.substring(0, 30));

        // if (nextText === adSpot.afterText) {
        //   logger.info(
        //     "%c this MATCHES our afterText. WINNER",
        //     "background: #222; color: #bada55"
        //   );
        //   logger.info("will INSERT ad here");
        //   const impression: Impression = await generateImpression(auction, ad);
        //   insertAd(currentElement, ad, impression);
        // } else {
        //   logger.info(
        //     "%c no match on after Text, even though before Text matched",
        //     "background: #222; color: #bada55"
        //   );
        // }
      } else {
        logger.info("no match on before Text");
      }
      if (adSpotHasMatch == true) {
        logger.info(
          "%c This ad spot above has the match",
          "background: #bee3f8; color: #2D3748"
        );
        adSpotHasMatch = false;
      }
    }
    if (elementHasMatch == true) {
      logger.info(
        "%c This element above has a match",
        "background: #C6F6D5; color: #2D3748"
      );
      elementHasMatch = false;
    }
  }
};

init();
