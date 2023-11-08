import logger from "./logger";

declare let gtag: Function;
declare var BW_ENV: string;
declare global {
  var adthrive: any;
}

export const sendEventToGa = (eventName: string, eventProperties: any) => {
  try {
    if (BW_ENV === "production") {
      gtag("event", eventName, eventProperties);
      logger.info("Sent event to GA: ", eventName, eventProperties);
    } else {
      logger.info("not sending event to GA: ", BW_ENV, eventProperties);
    }
  } catch (err) {
    logger.info("UNABLE to send event to GA: ", eventName, eventProperties);
  }
};

export const sendEventToRaptive = (eventProperties: any) => {
  // try {
  //   if (BW_ENV === "production") {
  //     window.adthrive.cmd.push(function () {
  //       window.adthrive.siteAds.targeting.push(eventProperties);
  //     });
  //     logger.info("Sent event to raptive: ", eventProperties);
  //   } else {
  //     logger.info("not sending event to raptive: ", BW_ENV, eventProperties);
  //   }
  // } catch (err) {
  //   logger.info("UNABLE to send event to raptive: ", eventProperties);
  // }
};
