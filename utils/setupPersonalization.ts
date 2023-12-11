import { updateAuction, updateExtra } from "./auction";
import "../styles/personalizeTooltip.css";
import { loadCSS } from "./setupMetaContent";
import logger from "./logger";
import { Options } from "typewriter-effect";
import questionsWithAnswers from "../data/questionsWithAnswers.json";

// @ts-ignore
import Typewriter from "typewriter-effect/dist/core";

declare var BW_FEEDBACK_URL: string;
declare var BW_ENV: string;

let startTime = new Date().getTime();
let passedTimeBank = 0;

const totalTimeSpent = () => new Date().getTime() - startTime + passedTimeBank;

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState === "hidden") {
    passedTimeBank += new Date().getTime() - startTime;
  } else if (document.visibilityState === "visible") {
    startTime = new Date().getTime();
  }
});

const ctaElemId = "bw-personalization-call-to-action";

const getPersonalizationCallToAction = (item: any) => {
  const {qna, cta} = item;
  console.log(cta, qna);
  const template = document.createElement("template");
  template.innerHTML = `
    <div id="${ctaElemId}" class="hide">
      <div class="title-row">
<!--        <strong>Let AI rewrite this article based on your inputs:</strong>-->
        <div class="title">${cta.title}</div>
        <div class="sub-title">${cta.subTitle}</div>
      </div>
<!--      <div class="questions">-->
<!--      </div>-->
      <div class="btn-row">
        <input type="button" value="${cta.noThanksText}" class="closePersonalize" />
        <input type="button" value="${cta.buttonText}" class="personalize" />
      </div>
    </div>`.trim();

  const ctaDiv = template.content.firstChild as HTMLElement;

  // qna.map((qs: any) => {
  //   const qsDiv = document.createElement("div");
  //
  //   const titleDiv = document.createElement("div");
  //   titleDiv.innerHTML = qs.questionText;
  //   qsDiv.append(titleDiv);
  //
  //   const selectElem = document.createElement("select");
  //   qs.answers.map((ans: any) => {
  //     const optionElem = document.createElement("option");
  //     optionElem.value = ans.answerText;
  //     optionElem.text = ans.answerText;
  //     selectElem.append(optionElem);
  //   });
  //   qsDiv.append(selectElem);
  //
  //   ctaDiv.querySelector(".questions")!.append(qsDiv);
  // });
  return ctaDiv;
};

const getPersonalizationAnswer = () => {
  const template = document.createElement("template");
  template.innerHTML = `<div id="bw-personalization-answer">
<div class="widgedHeading">
  <strong>Personalized Answer:</strong>
  <input type="button" class="showOptions" value="Show Options"></input>
</div>
<div class="personalizedContent">
</div>
</div>`.trim();
  return template.content.firstChild as HTMLElement;
};

const setupPersonalization = (aid: string) => {
  logger.info("in setupPersonalization with: ", aid);

  loadCSS();

  const collapseCta = () => {
    logger.info(" in collapse cta");
    const ctaElem = document.querySelector(`#${ctaElemId}`)!;
    ctaElem.classList.add("collapse");
  }

  const hideContainer = () => {
    logger.info(" in hideContainer");
    const ctaElem = document.querySelector(`#${ctaElemId}`)!;
    ctaElem.classList.remove("show");
  };

  const showContainer = () => {
    const ctaElem = document.querySelector(`#${ctaElemId}`)!;
    if (!ctaElem.classList.contains("show")) {
      logger.info(" adding show class to show personalization cta");
      ctaElem.classList.add("show");
      updateAuction(aid, {
        personalizeCtaShown: {
          increment: 1,
        },
      });
    } else {
      logger.info(" show class already present on personalization cta");
    }
  };

  const scrollHandlerToShowContainer = () => {
    logger.info(" in scroll handler to show container");
    let waitTime = 10_000;
    if(BW_ENV === "development"){
      waitTime = 1_000;
    }
    if (window.scrollY > 800 && totalTimeSpent() > waitTime) {
      showContainer();
    } else {
      logger.info("not showing because: ", window.scrollY, totalTimeSpent());
      hideContainer();
    }
  };

  const item = (questionsWithAnswers as []).find((item: any) =>
    window.document.location.href.includes(item.url)
  );
  if (!item) {
    logger.info("aborting as no personalization qna found!");
    return;
  }

  // pz - v1 - baseline -> our very first iteration with qna at 10 second mark
  updateExtra(aid, "pz - v3 - made close button big and yes button small");

  const ctaElem = getPersonalizationCallToAction(item);
  document.querySelector("body")!.append(ctaElem);

  const answerElem = getPersonalizationAnswer();
  document.querySelector("body")!.append(answerElem);

  document.addEventListener("scrollend", scrollHandlerToShowContainer);
  document.addEventListener("touchend", scrollHandlerToShowContainer);

  [...ctaElem.querySelectorAll("select")].map((elem) =>
    elem.addEventListener("click", () => {
      updateAuction(aid, {
        personalizedOptionSelected: {
          increment: 1,
        },
      });
    })
  );

  ctaElem
    .querySelector("input.closePersonalize")!
    .addEventListener("click", () => {
      document.removeEventListener("scrollend", scrollHandlerToShowContainer);
      document.removeEventListener("touchend", scrollHandlerToShowContainer);
      // collapseCta();
      hideContainer();

      updateAuction(aid, {
        closedPersonalized: {
          increment: 1,
        },
      });
    });

  ctaElem.querySelector("input.personalize")!.addEventListener("click", () => {
    document.removeEventListener("scrollend", scrollHandlerToShowContainer);
    document.removeEventListener("touchend", scrollHandlerToShowContainer);
    hideContainer();

    updateAuction(aid, {
      personalized: {
        increment: 1,
      },
    });

    document.documentElement.scroll({
      behavior: "smooth",
      top: answerElem.offsetTop - 50,
    });

    const contentElem = answerElem.querySelector(
      "div.personalizedContent"
    ) as HTMLElement;

    const typewriterOptions: Options = {
      loop: false,
      delay: 0,
    };
    const typewriter = new Typewriter(contentElem, typewriterOptions);

    let personalizedText = `
      <p>Thank you for your recent interaction with our personalized text feature! This feature is currently under development.</p>
<p>We appreciate your engagement and want to express our gratitude for your click. Your interaction helps us gauge the demand for potential features, and it's users like you who guide our development decisions.</p>
<p>Rest assured, based on the positive response we've received, we're now actively considering the development of the personalized text feature. Your unintended participation in this test has provided valuable insights, and we're grateful for your involvement.</p>
<p>As we move forward, we'll keep you updated on any developments. Thank you for being a part of our community and for your understanding.</p>

<p>Warm regards,</p>
<p>BrandWeaver.ai</p>
`;

    const userInputs = [...ctaElem.querySelectorAll("select")].map(
      (x) => x.value
    );
    logger.info("user inputs: ", userInputs);

    typewriter.typeString(personalizedText).start();
  });

  answerElem
    .querySelector("input.showOptions")!
    .addEventListener("click", showContainer);
};

export default setupPersonalization;
