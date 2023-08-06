import tippy, { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css"; // optional for styling
// import "tippy.js/themes/light.css";
import metaContent from "../data/metaContent.json";
import { getCleanUrl } from "./url";

declare var BW_CDN_BASE_URL: string;

// const metaContent = [
//   {
//     // url: "https://www.fightbookmma.com/dylan-moran-exclusive-conor-mcgregor-is-back-in-sparring-for-ufc-return/",
//     url: "http://localhost:3000/mma2.html",
//     input: "Conor McGregor’s back in training for UFC comeback?",
//     output: [
//       `<strong> Also, Did you know</strong> that Dylan Moran, the Irish Welterweight contender and former sparring partner of Conor McGregor, has just confirmed 'The Notorious One's' return to the Octagon? It seems like McGregor is gearing up for an epic comeback, and with Moran's inside knowledge, fans are buzzing with excitement! This unexpected revelation adds an intriguing twist to the story and leaves us wondering what surprises McGregor has in store for his opponents. Keep your eyes peeled for more updates, because when it comes to Conor McGregor, anything can happen!`,
//       `<strong> Also, Did you know</strong> that Dylan Moran, the Irish Welterweight contender and former sparring partner of Conor McGregor, has just confirmed 'The Notorious One's' return to the Octagon? It seems like McGregor is gearing up for an epic comeback, and with Moran's inside knowledge, fans are buzzing with excitement! This unexpected revelation adds an intriguing twist to the story and leaves us wondering what surprises McGregor has in store for his opponents. Keep your eyes peeled for more updates, because when it comes to Conor McGregor, anything can happen!`,
//       `<strong> Also, Did you know</strong> that Dylan Moran, the Irish Welterweight contender and former sparring partner of Conor McGregor, has just confirmed 'The Notorious One's' return to the Octagon? It seems like McGregor is gearing up for an epic comeback, and with Moran's inside knowledge, fans are buzzing with excitement! This unexpected revelation adds an intriguing twist to the story and leaves us wondering what surprises McGregor has in store for his opponents. Keep your eyes peeled for more updates, because when it comes to Conor McGregor, anything can happen!`,
//     ],
//   },
//   {
//     url: "http://localhost:3000/mma2.html",
//     // url: "https://www.fightbookmma.com/dylan-moran-exclusive-conor-mcgregor-is-back-in-sparring-for-ufc-return/",
//     input:
//       "Irish Welterweight contender and ex-sparring partner of Conor McGregor Dylan Moran confirmed we",
//     output: [
//       `<strong> Also, Did you know</strong> that Dylan Moran, the Irish Welterweight contender and former sparring partner of Conor McGregor, has just confirmed 'The Notorious One's' return to the Octagon? It seems like McGregor is gearing up for an epic comeback, and with Moran's inside knowledge, fans are buzzing with excitement! This unexpected revelation adds an intriguing twist to the story and leaves us wondering what surprises McGregor has in store for his opponents. Keep your eyes peeled for more updates, because when it comes to Conor McGregor, anything can happen!`,
//     ],
//   },
//   {
//     url: "http://localhost:3000/mma2.html",
//     // url: "https://www.fightbookmma.com/dylan-moran-exclusive-conor-mcgregor-is-back-in-sparring-for-ufc-return/",
//     input:
//       "He also has a newfound respect for Jake Paul ahead of his fight against Nate Diaz and wishes to fight recently cleared",
//     output: [
//       `Not only is Conor McGregor making a sensational comeback, but he's also embracing a newfound respect for fellow fighters. Surprisingly, McGregor has expressed admiration for Jake Paul ahead of his fight against Nate Diaz. The unexpected display of respect between the two rivals has the MMA community talking. But that's not all – McGregor has set his sights on a potential future bout against the recently cleared Conor Benn. Could we witness a clash of Conors in the ring? The anticipation is palpable as McGregor's aspirations grow bolder, and his comeback journey becomes even more captivating. Stay tuned for more updates on these exciting potential matchups!`,
//     ],
//   },
// ];

const setupMetaContent = () => {
  console.log("in setupMetaContent");

  /* Not needed as we are loading them via es module import */
  // const popperScript = document.createElement("script");
  // popperScript.src =
  //   "https://unpkg.com/@popperjs/core@2";
  // document.body.appendChild(popperScript);
  //
  // const tippyScript = document.createElement("script");
  // tippyScript.src = "https://unpkg.com/tippy.js@6";
  // document.body.appendChild(tippyScript);

  console.log("*** tippy: ", tippy);

  // adding css file being built by esbuild
  const cssElement = document.createElement("link");
  cssElement.rel = "stylesheet";
  cssElement.href = `${BW_CDN_BASE_URL}/bw.css`;

  document.body.appendChild(cssElement);

  const getMetaDiv = (contentArray: string[]) => {
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

  const allElements = [...document.querySelectorAll("p")];
  metaContent.forEach((item) => {
    const element = allElements.find(
      (e) =>
        getCleanUrl(window.document.location.href) === item.url &&
        e.textContent?.includes(item.input)
    );
    if (element) {
      tippy(element, {
        // trigger: "click",
        // hideOnClick: false,
        // theme: "light",
        appendTo: document.body,
        zIndex: 2147483647,
        interactive: true,
        content: getMetaDiv(item.output),
        allowHTML: true,
        placement: "right",
        followCursor: "vertical",
        plugins: [followCursor],
      });
    }
  });
};

export default setupMetaContent;
