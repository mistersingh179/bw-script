import tippy, { followCursor, Tippy } from "tippy.js";
import "tippy.js/dist/tippy.css"; // optional for styling
// import "tippy.js/themes/light.css";
import { getCleanUrl } from "./url";
import { once, sample } from "lodash";
import { updateExtra } from "./auction";
import getMetaContent, { MetaContentType } from "../data/getMetaContent";

declare var BW_CDN_BASE_URL: string;

const setupMetaContent = async (aid: string, mainPostBodySelector: string) => {
  console.log("in setupMetaContent");
  if (!mainPostBodySelector) {
    mainPostBodySelector = "body";
  }

  const myUrl = getCleanUrl(window.document.location.href);
  let metaContent = getMetaContent();
  metaContent = metaContent.filter(
    (x) => x.url === myUrl || x.url === window.document.location.href
  );
  console.log("metaContent: ", metaContent);

  const processElement = (para: HTMLElement) => {
    const {
      top: paraTop,
      bottom: paraBottom,
      left: paraLeft,
      right: paraRight,
      height: paraHeight,
      width: paraWidth,
    } = para.getBoundingClientRect();

    const tippyBoundingBox = document
      .querySelector("[data-tippy-root]")
      ?.getBoundingClientRect();

    if (paraTop <= mouseYInViewPort && paraBottom >= mouseYInViewPort) {
      // mouse is within paras Y space
      if (!tippyBoundingBox) {
        // there is no tippy box being shown, LET's trigger the mouse enter
        para.dispatchEvent(
          new MouseEvent("mouseenter", {
            clientX: paraLeft + 1,
            clientY: paraTop + paraHeight / 2,
          })
        );
      } else {
        // there is a tippy box. need to check if mouse is inside the tippy
        const {
          top: tippyTop,
          bottom: tippyBottom,
          left: tippyLeft,
          right: tippyRight,
        } = tippyBoundingBox;
        if (
          tippyTop <= mouseYInViewPort &&
          tippyBottom >= mouseYInViewPort &&
          tippyLeft <= mouseXInViewPort &&
          tippyRight >= mouseXInViewPort
        ) {
          // we are in the tippy box. WILL NOT trigger mouse enter
        } else {
          // we are not in the tippy box. LET's trigger mouse enter
          para.dispatchEvent(
            new MouseEvent("mouseenter", {
              clientX: paraLeft + 1,
              clientY: paraTop + paraHeight / 2,
            })
          );
        }
      }
    } else {
      // mouse has left the para's Y zone. LET'S trigger the mouse leave
      // this will hide it only if not in the interactive zone
      para.dispatchEvent(
        new MouseEvent("mouseleave", {
          clientX: mouseXInViewPort + 1,
          clientY: mouseYInViewPort,
        })
      );
    }
  };

  let mouseYInViewPort = 0;
  let mouseXInViewPort = 0;
  let lastMouseEvent: MouseEvent;

  window.document.addEventListener("mousemove", (event) => {
    mouseYInViewPort = event.clientY;
    mouseXInViewPort = event.clientX;
    lastMouseEvent = event;
    const allParas = [
      ...document.querySelectorAll(`${mainPostBodySelector} p`),
    ];
    for (const para of allParas) {
      processElement(para as HTMLElement);
    }
  });

  window.document.addEventListener("scroll", (event) => {
    const allParas = [
      ...document.querySelectorAll(`${mainPostBodySelector} p`),
    ];
    for (const para of allParas) {
      processElement(para as HTMLElement);
    }
  });

  const SHOW_NOTHING = "show nothing";
  const SHOW_TIPPY = "show tippy";
  const extraValues = [SHOW_TIPPY];
  const extra = sample(extraValues) as string;
  console.log("random extra value is: ", extra);
  if (extra === SHOW_NOTHING) {
    console.log("will show nothing");
    await updateExtra(aid, SHOW_NOTHING);
    return;
  }

  console.log("will show tippy");
  await updateExtra(aid, SHOW_TIPPY);

  // adding css file being built by esbuild
  const cssElement = document.createElement("link");
  cssElement.rel = "stylesheet";
  cssElement.href = `${BW_CDN_BASE_URL}/bw.css`;

  document.body.appendChild(cssElement);

  const getMetaDiv = (item: MetaContentType) => {
    const contentArray = item.output;
    const metaDiv = document.createElement("div");
    contentArray.forEach((val, idx) => {
      const p = document.createElement("p");
      p.style.fontSize = "18px";
      p.innerHTML = val;
      if (idx > 1) {
        p.style.display = "none";
      }
      metaDiv.appendChild(p);
    });
    if (contentArray.length > 2) {
      const button = document.createElement("button");
      button.innerHTML = "Read More";
      button.style.marginBottom = "10px";
      button.addEventListener("click", (evt) => {
        const targetElement = evt.target as HTMLElement;
        if (targetElement) {
          targetElement.parentElement
            ?.querySelectorAll("p")
            .forEach((x) => (x.style.display = "block"));
          targetElement.style.display = "none";
        }
      });
      metaDiv.appendChild(button);
    }
    return metaDiv;
  };

  const allElements = [
    ...document.querySelectorAll(`${mainPostBodySelector} p`),
  ] as HTMLElement[];
  metaContent.forEach((item, index) => {
    const element = allElements.find(
      (e) =>
        e.textContent
          ?.replaceAll(String.fromCharCode(160), " ")
          .includes(item.input) ||
        e.textContent?.includes(item.input) ||
        e.innerText?.includes(item.input) ||
        e.innerText
          ?.replaceAll(String.fromCharCode(160), " ")
          .includes(item.input)
    );
    if (element) {
      tippy(element, {
        appendTo: document.body,
        // trigger: "click",
        // hideOnClick: false,
        zIndex: 2147483647,
        interactive: true,
        content: getMetaDiv(item),
        allowHTML: true,
        placement: "right",
        followCursor: "vertical",
        plugins: [followCursor],
        onShow: once(() => {
          updateExtra(aid, SHOW_TIPPY + " and it popped up");
        }),
      });
    }
  });
};

export default setupMetaContent;
