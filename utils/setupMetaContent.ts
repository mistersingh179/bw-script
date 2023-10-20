import { AuctionResponse, updateExtra } from "./auction";
import mobileCheck from "./mobileCheck";
import sendPageViewEventToGa, { gaProperties } from "./sendMessageToGa";
import setupInlineTooltip from "./setupInlineTooltip";
import setupHoverTooltip from "./setupHoverTooltip";
import { once } from "lodash";
import { generateMetaContentImpression } from "./metaContentImpression";
import logger from "./logger";

declare var BW_CDN_BASE_URL: string;

export const SHOW_NOTHING = "show nothing";
export const SHOW_NOTHING_AND_MOUSE_SCROLLED =
  "show nothing and mouse scrolled";
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
  gaProperties.bw_show_meta_content = "yes_and_displayed";
  sendPageViewEventToGa();
  updateExtra(aid, SHOW_TIPPY_AND_DISPLAYED);
  const mci = await generateMetaContentImpression(aid, mcid, contentHasScroll);
  return mci.id;
};

const setupMetaContent = async (auctionResponse: AuctionResponse) => {
  const { metaContentSpotsWithDetail, auction, settings, optOutCookieValue } =
    auctionResponse;

  const { id: aid } = auction;

  const {
    metaContentSpotSelector,
    metaContentStatus,
    metaContentDisplayPercentage,
    metaContentMobileDisplayPercentage,
    metaContentToolTipTheme,
    metaContentToolTipTextColor,
  } = settings;

  if (metaContentStatus) {
    logger.info("continuing as meta content status is ON");
  } else {
    logger.info("aborting as meta content status is OFF");
    return;
  }

  if(optOutCookieValue === true){
    logger.info("aborting as user has opt out cookie with true");
    return;
  }else{
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
    gaProperties.bw_show_meta_content = "yes";
    sendPageViewEventToGa();
    await updateExtra(aid, SHOW_TIPPY);
  } else {
    logger.info("random A/B - DO NOT SHOW: ", random, displayPercentage);
    gaProperties.bw_show_meta_content = "no";
    sendPageViewEventToGa();
    await updateExtra(aid, SHOW_NOTHING);
  }

  setTimeout(() => {
    gaProperties.bw_spent_five_seconds = "yes";
    sendPageViewEventToGa();
  }, 5000);

  window.document.addEventListener(
    "scroll",
    once((event) => {
      gaProperties.bw_mouse_scroll_detected = "yes";
      sendPageViewEventToGa();
      if (doTheDisplay == false) {
        updateExtra(aid, SHOW_NOTHING_AND_MOUSE_SCROLLED);
        gaProperties.bw_show_meta_content = "no_and_scrolled";
        sendPageViewEventToGa();
      }
    })
  );

  window.document.addEventListener(
    "mousemove",
    once((event) => {
      gaProperties.bw_mouse_move_detected = "yes";
      sendPageViewEventToGa();
    })
  );

  if (doTheDisplay == false) {
    logger.info("aborting as random A/B says do not show");
    return;
  }

  if (onMobile) {
    setupInlineTooltip(
      aid,
      metaContentSpotSelector,
      metaContentSpotsWithDetail,
      metaContentToolTipTheme
    );
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

export default setupMetaContent;
