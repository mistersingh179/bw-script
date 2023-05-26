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
  const { auction, adsWithDetail } = auctionResponse;
  console.log("got auction ", auction.id, " and ads: ", adsWithDetail.length);

  if(adsWithDetail.length === 0){
    console.log("aborting as no ads found");
    return
  }

  console.time("processAds");
  let elements = document.querySelectorAll(`body p:not(empty)`);
  let elementsArr = Array.from(elements);

  console.groupCollapsed("processing Ads");
  console.log("elements count: ", elementsArr.length);

  for (let i = 0; i < elementsArr.length - 1; i++) {
    const currentElement = elementsArr[i];
    const currentText = currentElement.textContent?.trim();

    console.group("checking element: " + i);
    for (let j = 0; j < adsWithDetail.length; j++) {
      const ad = adsWithDetail[j];
      const adSpot = ad.advertisementSpot;
      console.group("checking adSpot: " + j);
      console.log(" Before: ", adSpot.beforeText);
      console.log(" After: ", adSpot.afterText);
      console.log("element has text: ", currentText?.substring(0, 30));

      if (currentText === adSpot.beforeText) {
        console.log(
          "%c this MATCHES beforeText. will now check its next element with afterText",
          "background: #222; color: #bada55"
        );

        const nextElement = nextWithText(elementsArr[i]);
        const nextText = nextElement.textContent?.trim();
        console.log("next element has text: ", nextText?.substring(0, 30));

        if (nextText === adSpot.afterText) {
          console.log(
            "%c this MATCHES our afterText. WINNER",
            "background: #222; color: #bada55"
          );
          console.log("will INSERT ad here");
          const impression: Impression = await generateImpression(auction, ad);
          insertAd(currentElement, ad, impression);
        } else {
          console.log(
            "%c no match on after Text, even though before Text matched",
            "background: #222; color: #bada55"
          );
        }
      } else {
        console.log("no match on before Text");
      }
      console.groupEnd();
    }
    console.groupEnd();
  }
  console.groupEnd();
  console.timeEnd();
  console.timeLog("processAds");
  console.groupEnd();
};

init();
