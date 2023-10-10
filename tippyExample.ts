import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/translucent.css';
import logger from "./utils/logger";

logger.info("I am tippyExample.js");

const cssElement = document.createElement("link");
cssElement.href='/tippyExample.css';
cssElement.rel='stylesheet';
document.body.appendChild(cssElement);

// Global config for all <button>s
tippy("button", {
  content:
    "Calm green people, to the homeworld. Dozens of mankinds will be lost in winds like pressures in ellipses",
  placement: 'bottom',
  trigger: 'click',
  interactive: true,
  theme: 'light-border'
});

export {};
