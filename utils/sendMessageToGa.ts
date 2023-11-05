import logger from "./logger";

declare let gtag: Function;

const sendEventToGa = (eventName: string, eventProperties: any) => {
  try {
    gtag("event", eventName, eventProperties);
    logger.info("Sent event to GA: ", eventName, eventProperties);
  } catch (err) {
    logger.info("UNABLE to send event to GA: ", eventName, eventProperties);
  }
};

export default sendEventToGa;
