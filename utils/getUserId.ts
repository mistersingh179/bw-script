import logger from "./logger";

export const getCurrentScript = (): HTMLScriptElement | null  => {
  if(document.currentScript){
    return document.currentScript as HTMLScriptElement
  }else{
    return document.querySelector("script[src*='/bw.js?id=']")
  }
}

const getUserId = () => {
  const scriptTag = getCurrentScript();
  if(scriptTag === null){
    logger.error("unable to find bw js script tag");
    return null;
  }
  const src = scriptTag.src;
  const url = new URL(src);
  const params = url.searchParams;
  const id = params.get("id");
  return id;
}

export default getUserId;