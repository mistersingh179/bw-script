declare var BW_DASHBOARD_BASE_URL: string;

const dashboardBaseUrl = BW_DASHBOARD_BASE_URL;

console.log("i am bw.js: ", dashboardBaseUrl);

const init = async () => {
  const res = await fetch(`${dashboardBaseUrl}/api/auctions`, {
    method: "POST"
  });
  const data = await res.json();
  console.log(data);
};

init();
