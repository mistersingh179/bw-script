import getUserId from "./utils/getUserId";

declare var BW_DASHBOARD_BASE_URL: string;

const dashboardBaseUrl = BW_DASHBOARD_BASE_URL;

console.log("i am bw.js: ", dashboardBaseUrl);

const init = async () => {
  console.log("in bw.js from bw-script");
  const userId = getUserId();
  const body = {
    userId,
    url: window.document.location.href
  };
  console.log("body to post with: ", body);
  const auctionEndpoint = `${dashboardBaseUrl}/api/auctions`;
  const res = await fetch(auctionEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
};

init();
