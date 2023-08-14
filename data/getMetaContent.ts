import metaContent from "./metaContent.json";
import metaContent2 from "./metaContent2.json";
import metaContent3 from "./metaContent3.json";

export type MetaContentType = {
  url: string,
  input: string,
  output: string[],
  content_type?: string
}

const getMetaContent = () => {
  const meta = metaContent.concat(metaContent2).concat(metaContent3);
  return meta as MetaContentType[];
};

export const getMetaContentUrls = () => {
  const metaContent = getMetaContent();
  let metaContentUrls = metaContent.map((x) => x.url);
  metaContentUrls.push("http://localhost:3000/mma2.html");
  metaContentUrls.push("http://localhost:3000/mma3.html");
  metaContentUrls.push("http://localhost:3000/study2.html");
  metaContentUrls.push("http://localhost:3000/study3.html");
  metaContentUrls = [...new Set(metaContentUrls)];
  return metaContentUrls;
};

export default getMetaContent;
