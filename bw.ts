import getUserId from "./utils/getUserId";
import { generateAuction } from "./utils/auction";
import { generateImpression } from "./utils/impression";
import { insertAd, nextWithText } from "./utils/dom";
import { Impression } from "./prisma-client-index";

declare var BW_DASHBOARD_BASE_URL: string;

const init = async () => {
  console.groupCollapsed("bw.js");
  console.log("in bw.js from bw-script");

  const userId = getUserId();
  console.log("got userId: ", userId);

  const auctionResponse = await generateAuction();
  const { auction, adsWithDetail, settings } = auctionResponse;
  console.log("got auction ", auction.id, " and ads: ", adsWithDetail.length);

  if (adsWithDetail.length === 0) {
    console.log("aborting as no ads found");
    return;
  }

  console.time("processAds");
  let elements = document.querySelectorAll(`body p:not(empty)`);
  let elementsArr = Array.from(elements);
  console.groupCollapsed("processing Ads");
  console.log("elements count: ", elementsArr.length);

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
        insertAd(currentElement, ad, impression, settings.sponsoredWording);

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
