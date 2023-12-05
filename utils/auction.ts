import getUserId from "./getUserId";
import { getCleanUrl } from "./url";
import {
  Auction,
  MetaContent,
  MetaContentSpot,
  Setting,
} from "../prisma-client-index";
import superjson from "superjson";
import { AdWithDetail } from "./dom";
import { MetaContentType } from "../data/getMetaContent";
import logger from "./logger";

declare var BW_DASHBOARD_BASE_URL: string;

export type LimitedSettingsType = Pick<
  Setting,
  | "sponsoredWording"
  | "makeLinksBold"
  | "customStyles"
  | "mainPostBodySelector"
  | "metaContentSpotSelector"
  | "metaContentStatus"
  | "metaContentDisplayPercentage"
  | "metaContentMobileDisplayPercentage"
  | "metaContentToolTipTheme"
  | "metaContentToolTipTextColor"
>;

export type MetaContentSpotsWithMetaContentAndType = MetaContentSpot & {
  metaContents: (MetaContent & {
    metaContentType: MetaContentType;
  })[];
};

export type AuctionResponse = {
  auction: Auction;
  adsWithDetail: AdWithDetail[];
  metaContentSpotsWithDetail: MetaContentSpotsWithMetaContentAndType[];
  settings: LimitedSettingsType;
  abortCategoryNames: string[];
  messages: string[];
  optOutCookieValue: boolean;
};

export const generateAuction = async () => {
  const res = await fetch(`${BW_DASHBOARD_BASE_URL}/api/auctions/generate`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: getUserId(),
      url: getCleanUrl(window.document.location.href),
      screenWidth: window.screen?.availWidth,
      screenHeight: window.screen?.availHeight,
      scrollHeight: window.document?.documentElement?.scrollHeight
    }),
    credentials: "include",
  });
  try {
    const text = await res.text();
    // const text = `{"json":{"auction":{"id":"cloj13mfs00gf98swu4wiwyz0","userId":"clhtwckif000098wp207rs2fg","websiteId":"clo7a0ldx000398d69wri2rr7","webpageId":"clohmu8c8006q98swgp5irrhv","url":"http://192.168.86.212:8000/html/study.html","userAgent":"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1","screenWidth":390,"screenHeight":844,"ip":"::ffff:192.168.86.212","endUserCuid":"","endUserFp":"","scrollPosition":null,"firstScrollAt":null,"timeSpent":0,"extra":null,"createdAt":"2023-11-03T19:48:48.088Z","updatedAt":"2023-11-03T19:48:48.088Z"},"adsWithDetail":[],"metaContentSpotsWithDetail":[{"id":"clohmu97r002o98h866y2ciys","webpageId":"clohmu8c8006q98swgp5irrhv","contentText":"CAMBRIDGE, United Kingdom — How does our body maintain healthy blood sugar levels? A groundbreaking study of over 55,000 individuals worldwide has uncovered key information on what goes wrong when someone is diagnosed with Type 2 diabetes.","buildFailCount":0,"createdAt":"2023-11-02T20:21:50.247Z","updatedAt":"2023-11-02T20:21:50.247Z","metaContents":[{"id":"clohmuchm003v98h8ctte4nw8","metaContentSpotId":"clohmu97r002o98h866y2ciys","metaContentTypeId":"clm55w0rp000f98hxi347kjeu","generatedText":"Meta Content Text for – Investigate how the topic is symbolically represented in myths, folklore, or rituals across different cultures. – CAMBRIDGE, United Kingdom — How does our body maintain healthy blood sugar levels? A groundbreaking study of over 55,000 individuals worldwide has uncovered key information on what goes wrong when someone is diagnosed with Type 2 diabetes.","generatedHeading":"I am the Heading","diveristyClassifierResult":"DIVERSE","diveristyClassifierReason":"because i said so","status":true,"createdAt":"2023-11-02T20:21:54.491Z","updatedAt":"2023-11-02T20:21:54.491Z","metaContentType":{"id":"clm55w0rp000f98hxi347kjeu","name":"Investigate how the topic is symbolically represented in myths, folklore, or rituals across different cultures.","createdAt":"2023-09-04T17:34:40.358Z","updatedAt":"2023-09-04T17:34:40.358Z"}}]},{"id":"clohmu97r002p98h8354t7tam","webpageId":"clohmu8c8006q98swgp5irrhv","contentText":"Insulin, a hormone that regulates blood sugar levels, plays a crucial role in the development of Type 2 diabetes. Individuals with this condition struggle to regulate their glucose levels either due to inadequate insulin secretion or decreased sensitivity to insulin, known as insulin resistance.","buildFailCount":0,"createdAt":"2023-11-02T20:21:50.247Z","updatedAt":"2023-11-02T20:21:50.247Z","metaContents":[{"id":"clohmucid003x98h89v309ffk","metaContentSpotId":"clohmu97r002p98h8354t7tam","metaContentTypeId":"clm55w0rp000498hxnydu4d2r","generatedText":"Meta Content Text for – Connect the topic to scientific principles, studies, or discoveries that might not be commonly associated with it, offering a scientific lens for readers to explore. – Insulin, a hormone that regulates blood sugar levels, plays a crucial role in the development of Type 2 diabetes. Individuals with this condition struggle to regulate their glucose levels either due to inadequate insulin secretion or decreased sensitivity to insulin, known as insulin resistance.","generatedHeading":"I am the Heading","diveristyClassifierResult":"DIVERSE","diveristyClassifierReason":"because i said so","status":true,"createdAt":"2023-11-02T20:21:54.517Z","updatedAt":"2023-11-02T20:21:54.517Z","metaContentType":{"id":"clm55w0rp000498hxnydu4d2r","name":"Connect the topic to scientific principles, studies, or discoveries that might not be commonly associated with it, offering a scientific lens for readers to explore.","createdAt":"2023-09-04T17:34:40.358Z","updatedAt":"2023-09-04T17:34:40.358Z"}}]},{"id":"clohmu97r002q98h8tsazuzlv","webpageId":"clohmu8c8006q98swgp5irrhv","contentText":"While previous studies have focused on insulin resistance during fasting, researchers at the University of Cambridge delved into the mechanisms behind insulin resistance after consuming a meal or sugary drink, a critical factor in Type 2 diabetes. The findings could pave the way for future treatments for the disease that affects millions of people worldwide.","buildFailCount":0,"createdAt":"2023-11-02T20:21:50.247Z","updatedAt":"2023-11-02T20:21:50.247Z","metaContents":[{"id":"clohmucj3003z98h8ceoudj7s","metaContentSpotId":"clohmu97r002q98h8tsazuzlv","metaContentTypeId":"clm55w0rp000c98hxo3n9dgg3","generatedText":"Meta Content Text for – Highlight unconventional or innovative ways the topic is being applied or adapted in various industries or contexts. – While previous studies have focused on insulin resistance during fasting, researchers at the University of Cambridge delved into the mechanisms behind insulin resistance after consuming a meal or sugary drink, a critical factor in Type 2 diabetes. The findings could pave the way for future treatments for the disease that affects millions of people worldwide.","generatedHeading":"I am the Heading","diveristyClassifierResult":"DIVERSE","diveristyClassifierReason":"because i said so","status":true,"createdAt":"2023-11-02T20:21:54.543Z","updatedAt":"2023-11-02T20:21:54.543Z","metaContentType":{"id":"clm55w0rp000c98hxo3n9dgg3","name":"Highlight unconventional or innovative ways the topic is being applied or adapted in various industries or contexts.","createdAt":"2023-09-04T17:34:40.358Z","updatedAt":"2023-09-04T17:34:40.358Z"}}]},{"id":"clohmu97r002r98h80cfbeg5y","webpageId":"clohmu8c8006q98swgp5irrhv","contentText":"“We know there are some people with specific rare genetic disorders in whom insulin works completely normally in the fasting state, where it’s acting mostly on the liver, but very poorly after a meal, when it’s acting mostly on muscle and fat,” says Professor Sir Stephen O’Rahilly, the co-director of the Wellcome-MRC Institute of Metabolic Science, in a university release. “What has not been clear is whether this sort of problem occurs more commonly in the wider population and whether it’s relevant to the risk of getting Type 2 diabetes.”","buildFailCount":0,"createdAt":"2023-11-02T20:21:50.247Z","updatedAt":"2023-11-02T20:21:50.247Z","metaContents":[{"id":"clohmucjt004198h8vv2809hn","metaContentSpotId":"clohmu97r002r98h80cfbeg5y","metaContentTypeId":"clm55w0rp000698hxqp9iapba","generatedText":"Meta Content Text for – Explore how the topic varies across different regions or countries, shedding light on cultural, environmental, or social influences. – “We know there are some people with specific rare genetic disorders in whom insulin works completely normally in the fasting state, where it’s acting mostly on the liver, but very poorly after a meal, when it’s acting mostly on muscle and fat,” says Professor Sir Stephen O’Rahilly, the co-director of the Wellcome-MRC Institute of Metabolic Science, in a university release. “What has not been clear is whether this sort of problem occurs more commonly in the wider population and whether it’s relevant to the risk of getting Type 2 diabetes.”","generatedHeading":"I am the Heading","diveristyClassifierResult":"DIVERSE","diveristyClassifierReason":"because i said so","status":true,"createdAt":"2023-11-02T20:21:54.570Z","updatedAt":"2023-11-02T20:21:54.570Z","metaContentType":{"id":"clm55w0rp000698hxqp9iapba","name":"Explore how the topic varies across different regions or countries, shedding light on cultural, environmental, or social influences.","createdAt":"2023-09-04T17:34:40.358Z","updatedAt":"2023-09-04T17:34:40.358Z"}}]},{"id":"clohmu97r002s98h8f118jeo9","webpageId":"clohmu8c8006q98swgp5irrhv","contentText":"An international team of scientists analyzed genetic data from 28 studies to identify genetic variants that influence insulin levels after a glucose challenge. The study uncovered 10 new loci (regions of the genome) associated with insulin resistance. Strikingly, eight of these regions were also linked to a higher risk of Type 2 diabetes, underscoring their significance.","buildFailCount":0,"createdAt":"2023-11-02T20:21:50.247Z","updatedAt":"2023-11-02T20:21:50.247Z","metaContents":[{"id":"clohmuckj004398h8lapjqpqa","metaContentSpotId":"clohmu97r002s98h8f118jeo9","metaContentTypeId":"clm55w0rp000398hxcq9iinyd","generatedText":"Meta Content Text for – Enrich the reader's understanding of the topic from a historical lens. – An international team of scientists analyzed genetic data from 28 studies to identify genetic variants that influence insulin levels after a glucose challenge. The study uncovered 10 new loci (regions of the genome) associated with insulin resistance. Strikingly, eight of these regions were also linked to a higher risk of Type 2 diabetes, underscoring their significance.","generatedHeading":"I am the Heading","diveristyClassifierResult":"DIVERSE","diveristyClassifierReason":"because i said so","status":true,"createdAt":"2023-11-02T20:21:54.596Z","updatedAt":"2023-11-02T20:21:54.596Z","metaContentType":{"id":"clm55w0rp000398hxcq9iinyd","name":"Enrich the reader's understanding of the topic from a historical lens.","createdAt":"2023-09-04T17:34:40.358Z","updatedAt":"2023-09-04T17:34:40.358Z"}}]}],"settings":{"sponsoredWording":"This paragraph is an AI-generated ad.","makeLinksBold":false,"customStyles":".brandweaver-ad {\\n    text-align: center;\\n}","mainPostBodySelector":".entry-content","metaContentSpotSelector":".entry-content > p","metaContentStatus":true,"metaContentDisplayPercentage":100,"metaContentMobileDisplayPercentage":100,"metaContentToolTipTheme":"","metaContentToolTipTextColor":""},"abortCategoryNames":[],"messages":["all meta content spots have completed building","best campaigns: ","the sampled best campaign: undefined","best campaign not found"],"optOutCookieValue":false},"meta":{"values":{"auction.createdAt":["Date"],"auction.updatedAt":["Date"],"metaContentSpotsWithDetail.0.createdAt":["Date"],"metaContentSpotsWithDetail.0.updatedAt":["Date"],"metaContentSpotsWithDetail.0.metaContents.0.createdAt":["Date"],"metaContentSpotsWithDetail.0.metaContents.0.updatedAt":["Date"],"metaContentSpotsWithDetail.0.metaContents.0.metaContentType.createdAt":["Date"],"metaContentSpotsWithDetail.0.metaContents.0.metaContentType.updatedAt":["Date"],"metaContentSpotsWithDetail.1.createdAt":["Date"],"metaContentSpotsWithDetail.1.updatedAt":["Date"],"metaContentSpotsWithDetail.1.metaContents.0.createdAt":["Date"],"metaContentSpotsWithDetail.1.metaContents.0.updatedAt":["Date"],"metaContentSpotsWithDetail.1.metaContents.0.metaContentType.createdAt":["Date"],"metaContentSpotsWithDetail.1.metaContents.0.metaContentType.updatedAt":["Date"],"metaContentSpotsWithDetail.2.createdAt":["Date"],"metaContentSpotsWithDetail.2.updatedAt":["Date"],"metaContentSpotsWithDetail.2.metaContents.0.createdAt":["Date"],"metaContentSpotsWithDetail.2.metaContents.0.updatedAt":["Date"],"metaContentSpotsWithDetail.2.metaContents.0.metaContentType.createdAt":["Date"],"metaContentSpotsWithDetail.2.metaContents.0.metaContentType.updatedAt":["Date"],"metaContentSpotsWithDetail.3.createdAt":["Date"],"metaContentSpotsWithDetail.3.updatedAt":["Date"],"metaContentSpotsWithDetail.3.metaContents.0.createdAt":["Date"],"metaContentSpotsWithDetail.3.metaContents.0.updatedAt":["Date"],"metaContentSpotsWithDetail.3.metaContents.0.metaContentType.createdAt":["Date"],"metaContentSpotsWithDetail.3.metaContents.0.metaContentType.updatedAt":["Date"],"metaContentSpotsWithDetail.4.createdAt":["Date"],"metaContentSpotsWithDetail.4.updatedAt":["Date"],"metaContentSpotsWithDetail.4.metaContents.0.createdAt":["Date"],"metaContentSpotsWithDetail.4.metaContents.0.updatedAt":["Date"],"metaContentSpotsWithDetail.4.metaContents.0.metaContentType.createdAt":["Date"],"metaContentSpotsWithDetail.4.metaContents.0.metaContentType.updatedAt":["Date"]}}}`;
    const data = await superjson.parse<any>(text);
    return data as AuctionResponse;
  } catch (err) {
    return null;
  }
};

export const updateTimeSpent = (aid: string, timeSpent: number) => {
  const body = {
    userId: getUserId(),
    timeSpent,
  };
  const blob = new Blob([JSON.stringify(body)], { type: "application/json" });

  navigator.sendBeacon(
    `${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}/updateTimeSpent`,
    blob
  );
};

export const updateExtra = async (aid: string, extra: string) => {
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}/updateExtra`,
    {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: getUserId(),
        extra,
      }),
      credentials: "include",
    }
  );
};

export const updateAuction = async (aid: string, data: any) => {
  logger.info("updating auction: ", aid, data);
  const res = await fetch(`${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}`, {
    mode: "cors",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
    credentials: "include",
  });
};
