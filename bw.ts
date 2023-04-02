import getUserId from "./utils/getUserId";

declare var BW_DASHBOARD_BASE_URL: string;

const dashboardBaseUrl = BW_DASHBOARD_BASE_URL;

console.log("i am bw.js: ", dashboardBaseUrl);

const init = async () => {
  console.log("in bw.js from bw-script");
  const userId = getUserId();
  console.log("script", document.currentScript);
  const body = {
    foo: "bar",
  };
  const params = new URLSearchParams({
    a: "1",
    b: "2",
  });
  const url = `${dashboardBaseUrl}/api/auctions?${params.toString()}`;
  console.log(url);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
};

init();
