import getCleanCategories from "./getCleanCategories";
import getCategoriesFromEntryCategoryElement from "./getCategoriesFromEntryCategoryElement";
import getCategoriesFromClasses from "./getCategoriesFromClasses";
import getCategoriesFromMetaTags from "./getCategoriesFromMetaTags";

const getCategories = () => {
  let cumulativeValues: string[] = [];

  const metaContentValues = getCategoriesFromMetaTags(document);
  console.log("got metaContentValues", { metaContentValues });
  cumulativeValues = cumulativeValues.concat(metaContentValues);

  const categoryClasses = getCategoriesFromClasses(document);
  console.log("got categoryClasses", { categoryClasses });
  cumulativeValues = cumulativeValues.concat(categoryClasses);

  const categoryElementValues = getCategoriesFromEntryCategoryElement(document);
  console.log("got categoryElementValues", { categoryElementValues });
  cumulativeValues = cumulativeValues.concat(categoryElementValues);

  return getCleanCategories(cumulativeValues);
}

export default getCategories;