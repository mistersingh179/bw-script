import metaContent from './metaContent.json'
import metaContent2 from './metaContent2.json'

const getMetaContent = () => {
  const meta = metaContent.concat(metaContent2);
  return meta;
};

export const getMetaContentUrls = () => {
  const metaContent = getMetaContent();
  let metaContentUrls = metaContent.map((x) => x.url);
  metaContentUrls.push("http://localhost:3000/mma2.html");
  metaContentUrls.push("http://localhost:3000/mma3.html");
  metaContentUrls.push("http://localhost:3000/study2.html");
  metaContentUrls = [...new Set(metaContentUrls)];
  return metaContentUrls;
}

export default getMetaContent


