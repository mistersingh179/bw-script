import metaContent from "./metaContent.json";
import metaContent2 from "./metaContent2.json";
import metaContent3 from "./metaContent3.json";
import metaContent4 from "./metaContent4.json";
import { getCleanUrl } from "../utils/url";


const getMetaContent = () => {
  const meta = metaContent
    .concat(metaContent2)
    .concat(metaContent3)
    .concat(metaContent4);
  return meta as any[];
};

export const getMetaContentUrls = () => {
  const metaContent = getMetaContent();
  let metaContentUrls = metaContent.map((x) => getCleanUrl(x.url));
  metaContentUrls.push("http://localhost:3000/mma2.html");
  metaContentUrls.push("http://localhost:3000/mma3.html");
  metaContentUrls.push("http://localhost:3000/mma4.html");
  metaContentUrls.push("http://localhost:3000/mma5.html");
  metaContentUrls.push("http://localhost:3000/study2.html");
  metaContentUrls.push("http://localhost:3000/study3.html");
  metaContentUrls.push("http://localhost:8000/html/TestPage.html");
  metaContentUrls = [...new Set(metaContentUrls)];
  return metaContentUrls;
};

export default getMetaContent;
