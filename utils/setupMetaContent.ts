import { AuctionResponse, updateExtra } from "./auction";
import mobileCheck from "./mobileCheck";
import setupHoverTooltip from "./setupHoverTooltip";
import { generateMetaContentImpression } from "./metaContentImpression";
import logger from "./logger";
import { sendEventToGa } from "./sendEvents";
import setupTopFixedTooltip from "./setupTopFixedTooltip";
import setupInlineTooltip from "./setupInlineTooltip";

declare var BW_CDN_BASE_URL: string;

export const SHOW_NOTHING = "show nothing";
export const SHOW_TIPPY = "show tippy";
export const SHOW_TIPPY_AND_DISPLAYED = "show tippy and it popped up";

export const loadCSS = () => {
  const cssElement = document.createElement("link");
  cssElement.rel = "stylesheet";
  cssElement.href = `${BW_CDN_BASE_URL}/bw.css`;
  document.body.appendChild(cssElement);
};

export const recordDisplay = async (
  aid: string,
  mcid: string,
  contentHasScroll: boolean
): Promise<string> => {
  // sendEventToGa("bw_inline_tooltip", { bw_inline_tooltip_displayed: "yes" });
  // updateExtra(aid, SHOW_TIPPY_AND_DISPLAYED);
  const mci = await generateMetaContentImpression(aid, mcid, contentHasScroll);
  return mci.id;
};

const setupMetaContent = async (auctionResponse: AuctionResponse) => {
  const { metaContentSpotsWithDetail, auction, settings, optOutCookieValue } =
    auctionResponse;
  logger.info("setupMetaContent initiated at:", performance.now());

  const { id: aid } = auction;

  const {
    metaContentSpotSelector,
    metaContentStatus,
    metaContentDisplayPercentage,
    metaContentMobileDisplayPercentage,
    metaContentToolTipTheme,
    metaContentToolTipTextColor,
    personalizationStatus,
  } = settings;

  // updateAuction(aid, {
  //   scrollPosition: document?.documentElement?.scrollTop,
  // });

  // const timeZero = Date.now();
  // document.addEventListener(
  //   "scroll",
  //   once(async () => {
  //     updateAuction(aid, {
  //       firstScrollAt: Date.now() - timeZero,
  //     });
  //   })
  // );

  // let previousMaxScrollDepth = 0;
  // const recordMaxScrollDepth = async () => {
  //   logger.info("in recordMaxScrollDepth");
  //   const newScrollDepth = window.scrollY;
  //   if(newScrollDepth > previousMaxScrollDepth){
  //     previousMaxScrollDepth = newScrollDepth;
  //     updateAuction(aid, {
  //       maxScrollDepth: Math.floor(newScrollDepth)
  //     })
  //   }
  // }
  //
  // document.addEventListener("scrollend", recordMaxScrollDepth);
  // document.addEventListener("touchend", recordMaxScrollDepth);

  if (metaContentStatus) {
    logger.info("continuing as meta content status is ON");
  } else {
    logger.info("aborting as meta content status is OFF");
    return;
  }

  if (optOutCookieValue === true) {
    logger.info("aborting as user has opt out cookie with true");
    return;
  } else {
    logger.info("continuing as user has not opted out");
  }

  const hasMetaContent = metaContentSpotsWithDetail.some(
    (mcs) => mcs.metaContents.length > 0
  );

  if (hasMetaContent) {
    logger.info("continuing as this page HAS meta content");
  } else {
    logger.info("aborting as this meta content NOT FOUND for this page");
    return;
  }

  const onMobile = mobileCheck();

  const random = Math.random() * 100;
  const displayPercentage = onMobile
    ? metaContentMobileDisplayPercentage
    : metaContentDisplayPercentage;
  const doTheDisplay = random < displayPercentage ? true : false;

  if (doTheDisplay) {
    logger.info("random A/B - SHOW: ", random, displayPercentage);
    // sendEventToRaptive({key: 'at_custom_1', value: "studyfinds_test_on"})
    sendEventToGa("bw_ab_test", { bw_ab_test_result: "yes" });
    updateExtra(aid, SHOW_TIPPY);
  } else {
    logger.info("random A/B - DO NOT SHOW: ", random, displayPercentage);
    // sendEventToRaptive({key: 'at_custom_1', value: "studyfinds_test_off"})
    sendEventToGa("bw_ab_test", { bw_ab_test_result: "no" });
    updateExtra(aid, SHOW_NOTHING);
    return;
  }

  const bwProd = "clij1cjb60000mb08uzganxdq";
  const sfProd = "climifncr00wgme08z6uyo3bg";
  const misterDev = "clhtwckif000098wp207rs2fg";

  const loadToolTip = () => {
    if (onMobile) {
      if (
        auction.userId &&
        [bwProd, sfProd, misterDev].includes(auction.userId)
      ) {
        setupTopFixedTooltip(
          aid,
          metaContentSpotSelector,
          metaContentSpotsWithDetail,
          metaContentToolTipTheme
        );
      } else {
        setupInlineTooltip(
          aid,
          metaContentSpotSelector,
          metaContentSpotsWithDetail,
          metaContentToolTipTheme
        );
      }
    } else {
      setupHoverTooltip(
        aid,
        metaContentSpotSelector,
        metaContentSpotsWithDetail,
        metaContentToolTipTheme,
        metaContentToolTipTextColor
      );
    }
  };

  logger.info("initiating loadTooltip: ", document.readyState);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadToolTip);
  } else {
    loadToolTip();
  }
};

export default setupMetaContent;
