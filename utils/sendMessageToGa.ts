import logger from "./logger";

declare let gtag: Function;

type GaProperties = {
  bw_show_meta_content: "(not set)" | "yes" | "no" | "yes_and_displayed" | "no_and_scrolled",
  bw_mouse_move_detected: "(not set)" | "yes",
  bw_mouse_scroll_detected: "(not set)" | "yes",
  bw_spent_five_seconds: "(not set)" | "yes",
}

export const gaProperties: GaProperties = {
  bw_show_meta_content: "(not set)",
  bw_mouse_move_detected: "(not set)",
  bw_mouse_scroll_detected: "(not set)",
  bw_spent_five_seconds: "(not set)",
};

const sendPageViewEventToGa = () => {
  try {
    gtag("event", "page_view", gaProperties);
    logger.info("Sent page_view to GA with: " , gaProperties);
  } catch (err) {
    logger.info("UNABLE to send page_view to GA with: " , gaProperties);
  }
};

export default sendPageViewEventToGa;
