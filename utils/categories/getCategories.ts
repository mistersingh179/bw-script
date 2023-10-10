import getCleanCategories from "./getCleanCategories";
import getCategoriesFromEntryCategoryElement from "./getCategoriesFromEntryCategoryElement";
import getCategoriesFromClasses from "./getCategoriesFromClasses";
import getCategoriesFromMetaTags from "./getCategoriesFromMetaTags";
import logger from "../logger";

const getCategories = () => {
  let cumulativeValues: string[] = [];

  const metaContentValues = getCategoriesFromMetaTags(document);
  logger.info("got metaContentValues", { metaContentValues });
  cumulativeValues = cumulativeValues.concat(metaContentValues);

  const categoryClasses = getCategoriesFromClasses(document);
  logger.info("got categoryClasses", { categoryClasses });
  cumulativeValues = cumulativeValues.concat(categoryClasses);

  const categoryElementValues = getCategoriesFromEntryCategoryElement(document);
  logger.info("got categoryElementValues", { categoryElementValues });
  cumulativeValues = cumulativeValues.concat(categoryElementValues);

  return getCleanCategories(cumulativeValues);
}

export default getCategories;