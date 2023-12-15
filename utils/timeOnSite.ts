import {updateTimeSpent} from "./auction";

let startTime = new Date().getTime();
let totalTime = 0;

const timeTillNow = () => {
  const endTime = new Date().getTime();
  const visibleTime = endTime - startTime;
  return totalTime + visibleTime;
}

const secondsTillNow = () => {
  return Math.floor(timeTillNow() / 1000);
}

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState === "hidden") {
    totalTime = timeTillNow();
  } else if (document.visibilityState === "visible") {
    startTime = new Date().getTime();
  }
});

export default secondsTillNow;