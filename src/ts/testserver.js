// src/ts/main.tsx
import React6 from "react";

// src/ts/components/carousel/carousel.tsx
import React4, {
  useEffect as useEffect2,
  useReducer,
  useRef as useRef2,
  useState as useState3
} from "react";

// src/ts/components/carousel/constants.tsx
import React, { createContext } from "react";
var trackStateTitle = /* @__PURE__ */ ((trackStateTitle2) => {
  trackStateTitle2[trackStateTitle2["Initialize"] = 0] = "Initialize";
  trackStateTitle2[trackStateTitle2["Stopped"] = 1] = "Stopped";
  trackStateTitle2[trackStateTitle2["Playing"] = 2] = "Playing";
  trackStateTitle2[trackStateTitle2["Moving"] = 3] = "Moving";
  trackStateTitle2[trackStateTitle2["Shift"] = 4] = "Shift";
  trackStateTitle2[trackStateTitle2["Grabbed"] = 5] = "Grabbed";
  trackStateTitle2[trackStateTitle2["Focused"] = 6] = "Focused";
  return trackStateTitle2;
})(trackStateTitle || {});
var CarouselDefaults = {
  activeSlide: 0,
  animationDuration: 300,
  carouselResetTimer: null,
  countOfSlides: 0,
  deadZone: 20,
  dragDistance: 0,
  firstX: 0,
  focus: 0,
  intervalDuration: 3e3,
  negativeOffsetOrigin: 0,
  playAnimations: false,
  slidesToClone: 4,
  trackState: 0 /* Initialize */
};
var CarouselContext = createContext(
  {
    state: CarouselDefaults,
    dispatch: () => {
    }
  }
);
var Projects = [
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-seed",
      srcSlug: "seed",
      alt: "The Seed Website's landing page for its blog.",
      title: "Seed",
      subtitle: "Wordpress",
      btn_href: "https://seed.com/cultured"
    },
    /* @__PURE__ */ React.createElement("p", null, "I helped with the responsiveness of the landing page and I built the new blog post template utilizing custom Gutenberg Blocks for a hassle-free backend content management experience.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-brmc",
      srcSlug: "brmc",
      alt: "The BRMC Website's home page.",
      title: "BRMC",
      subtitle: "Wordpress",
      btn_href: "https://blueridgemountainclub.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I built this website with the collaboration of two other developers. I integrated Hubspot, a 3rd party CRM, into the theme for this code so that we could build custom forms to capture leads but continue to utilize Hubspot's workflows for automating the life of the lead.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-organic_olivia",
      srcSlug: "organicolivia",
      alt: "The Shopify Store for Organic Olivia, a modern approach to traditional herbal medicine.",
      title: "Organic Olivia",
      subtitle: "Shopify",
      btn_href: "https://organicolivia.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I integrated Loyalty Lion, a Shopify Plus loyalty program into this shopify theme as well as wordpress to handle the blog. This website takes full advantage of Shopify Plus to further enhance and customize the User Experience.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-insignis_partners",
      srcSlug: "insignispartners",
      alt: "The insignis partners website. An Investment and Real Estate Development firm.",
      title: "Insignis Partners",
      subtitle: "Wordpress",
      btn_href: "https://insignispartners.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I enjoyed creating the animations and interactivity on the portfolio page. We used advanced custom fields to give the client the ability to update their staff.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-davis_floyd",
      srcSlug: "davisfloyd",
      alt: "Davis Floyd Civil Construction.",
      title: "Davis Floyd",
      subtitle: "Wordpress",
      btn_href: "https://www.davisfloyd.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I created the carousel animation on the Markets page and worked on the timeline on the about.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-kroeger_marine",
      srcSlug: "kroegermarine",
      alt: "Kroeger Marine Docks.",
      title: "Kroeger Marine",
      subtitle: "Wordpress",
      btn_href: "https://www.kroegermarine.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-vive_psych",
      srcSlug: "vivepsych",
      alt: "Vive Psyche located in Greenville, SC.",
      title: "Vive Psych",
      subtitle: "Wordpress",
      btn_href: "https://vivepsych.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-core_transformers",
      srcSlug: "coretransformers",
      alt: "The Core Transformers Wordpress site.",
      title: "Core Transformers",
      subtitle: "Wordpress & BigCommerce",
      btn_href: "https://coretransformers.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I was the sole developer for this project. I also gave their bigcommerce store a css update to match the wordpress site's brand.")
  ),
  /* @__PURE__ */ React.createElement(
    Project,
    {
      key: "proj-parkside_obgyn",
      srcSlug: "parksideob-gyn",
      alt: "Parkside OB-GYN. Modern Women, Modern Care.",
      title: "Parkside OB-GYN",
      subtitle: "Wordpress",
      btn_href: "https://parksideob-gyn.com"
    },
    /* @__PURE__ */ React.createElement("p", null, "I worked on the PHP page templates and css mobile, tablet, and desktop breakpoints for the whole site.")
  )
];

// src/ts/components/carousel/controls.tsx
import React2, { useContext, useEffect, useState } from "react";
function CarouselControls() {
  const [intervalEnabled, setIntervalEnabled] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { state, dispatch } = useContext(CarouselContext);
  const {
    playAnimations,
    trackState,
    intervalDuration,
    focus
  } = state;
  function shiftTrack(dragThresholdVector) {
    dispatch({ actionType: "shift", data: { shift: dragThresholdVector } });
  }
  function handleIntervalStatus() {
    setIntervalEnabled(!intervalEnabled);
  }
  let tempId = null;
  useEffect(() => {
    console.log(trackStateTitle[trackState]);
    if (trackStateTitle[trackState] !== "Focused" && intervalId === null && (intervalEnabled || trackStateTitle[trackState] === "Initialize")) {
      tempId = setInterval(() => {
        dispatch({ actionType: "shift", data: { trackState: 2 /* Playing */, shift: 1 } });
      }, intervalDuration);
      setIntervalId(tempId);
    }
    if (trackStateTitle[trackState] === "Initialize") {
      dispatch({ actionType: "Update", data: { trackState: 1 /* Stopped */ } });
    }
    return () => {
      console.log(intervalEnabled, intervalId);
      if ((tempId !== null || intervalId !== null) && (!intervalEnabled || trackStateTitle[trackState] === "Focused")) {
        console.log("remove", tempId, intervalId);
        tempId && clearInterval(tempId);
        intervalId && clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [focus]);
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("div", { className: "carousel-state-controls" }, /* @__PURE__ */ React2.createElement(
    "button",
    {
      className: "toggle",
      onClick: () => dispatch({ actionType: "Update", data: { playAnimations: !playAnimations } })
    },
    "Toggle Animations ",
    true === playAnimations ? "Off" : "On"
  )), /* @__PURE__ */ React2.createElement("div", { className: "track-controls" }, /* @__PURE__ */ React2.createElement("button", { className: "prev", onClick: () => shiftTrack(-1) }, "Previous"), /* @__PURE__ */ React2.createElement("button", { className: "next", onClick: () => shiftTrack(1) }, "Next"), /* @__PURE__ */ React2.createElement("button", { className: "pause", onClick: handleIntervalStatus }, intervalId !== null ? "Pause" : "Play", " Carousel")));
}

// src/ts/components/carousel/track.tsx
import React3, { useContext as useContext2 } from "react";
function CarouselTrack(props) {
  const {
    children,
    carouselRef,
    trackRef,
    setEventRef
  } = props;
  let countOfChildren = React3.Children.count(children);
  const { state, dispatch } = useContext2(CarouselContext);
  const {
    activeSlide,
    slidesToClone,
    trackState
  } = state;
  function userGrabbedCarousel(e) {
    dispatch({ actionType: 2 /* Grab */, data: e.clientX });
  }
  if (trackStateTitle[state.trackState] === "Moving" && carouselRef?.current !== null) {
    const carousel = carouselRef?.current;
    carousel.style.cursor = "grabbing";
  }
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
    "div",
    {
      className: "track",
      onMouseDown: (e) => setEventRef(e, userGrabbedCarousel),
      onTouchStart: (e) => setEventRef(e, userGrabbedCarousel),
      ref: trackRef
    }
  ));
}

// src/ts/components/carousel/carousel.tsx
function rolloverActiveSlide(state, dragThresholdVector, maxVal) {
  let rollover = null;
  if (
    // negative value would set activeSlide to a negative value
    state.activeSlide + dragThresholdVector < 0
  ) {
    rollover = state.activeSlide + dragThresholdVector + maxVal;
  } else if (
    // positive value would go over maxVal
    state.activeSlide + dragThresholdVector > maxVal - 1
  ) {
    rollover = (state.activeSlide + dragThresholdVector) % maxVal;
  }
  return rollover ?? state.activeSlide + dragThresholdVector;
}
function reducerHandler(state, action) {
  const { actionType } = action;
  let result;
  switch (actionType) {
    case "Initialize":
      result = {
        ...state,
        ...action.data
        // trackState: trackStateTitle["Stopped"],
      };
      break;
    case "Update":
      result = { ...state, ...action.data };
      break;
    case 0 /* Focus */:
      result = { ...state, trackState: 6 /* Focused */, focus: state.focus + 1 };
      break;
    case 2 /* Grab */:
      result = {
        ...state,
        trackState: 5 /* Grabbed */,
        firstX: action.data
      };
      break;
    case 4 /* Move */:
      result = state.trackState === 3 /* Moving */ || state.trackState === 5 /* Grabbed */ ? {
        ...state,
        trackState: 3 /* Moving */,
        dragDistance: action.data.dragDistance
      } : {
        ...state
      };
      break;
    case 3 /* Release */:
      result = {
        ...state,
        trackState: 2 /* Playing */,
        firstX: 0,
        // dragDistance: 0,
        activeSlide: action.data?.activeSlide < 0 ? 0 : action.data?.activeSlide ?? state.activeSlide
      };
      break;
    case "shift":
      const activeSlide = rolloverActiveSlide(state, action.data?.shift, state.countOfSlides);
      result = {
        ...state,
        trackState: 4 /* Shift */,
        activeSlide,
        dragDistance: action.data.shift
      };
      break;
    case "animate":
      result = { ...state, carouselResetTimer: action.data };
      break;
    case "stopAnimation":
      result = {
        ...state,
        trackState: state.focus === 0 ? 1 /* Stopped */ : 6 /* Focused */,
        carouselResetTimer: null,
        dragDistance: 0,
        firstX: 0,
        focus: state.focus--
      };
      break;
    default:
      result = { ...state };
  }
  return result;
}
function Carousel({
  children,
  autoplay
}) {
  let countOfChildren = React4.Children.count(children);
  const carouselRef = useRef2(null);
  const trackRef = useRef2(null);
  const eventRef = useRef2(null);
  const [state, dispatch] = useReducer(reducerHandler, CarouselDefaults);
  const {
    activeSlide,
    carouselResetTimer,
    deadZone,
    dragDistance,
    firstX,
    negativeOffsetOrigin,
    playAnimations,
    slidesToClone,
    trackState
  } = state;
  const removableMoveCB = (x) => {
    delegatedMoveHandler(x);
  };
  const removableReleaseCB = () => {
    release();
  };
  if (playAnimations && carouselResetTimer === null && (trackState === 2 /* Playing */ || trackState === 4 /* Shift */) && carouselRef.current && trackRef.current) {
    const CAROUSEL = carouselRef.current;
    const TRACK = trackRef.current;
    const margin = (TRACK.children[1].offsetLeft - TRACK.children[0].offsetLeft - TRACK.children[1].clientWidth) / 2;
    const threshold = Math.round(
      dragDistance / TRACK.children[1].offsetLeft * -1
    );
    let math = negativeOffsetOrigin + (threshold === 0 ? dragDistance : threshold > 0 ? TRACK.children[threshold].offsetLeft + dragDistance + margin : -TRACK.children[threshold * -1].offsetLeft + dragDistance + margin);
    if (trackStateTitle[trackState] === "Shift") {
      math = negativeOffsetOrigin + (dragDistance > 0 ? TRACK.children[activeSlide].clientWidth + margin : -TRACK.children[activeSlide].clientWidth + margin);
    }
    new Promise((resolve) => {
      TRACK.style.setProperty("transition", `all 0ms`);
      TRACK.style.setProperty("translate", `${math}px`);
      resolve(null);
    }).then(() => {
      TRACK.style.setProperty(
        "transition",
        `translate ${CAROUSEL.style.getPropertyValue("--transition-duration")}`
      );
      TRACK.style.translate = `${negativeOffsetOrigin}px`;
    });
    let timerID = setTimeout(() => {
      dispatch({ actionType: "stopAnimation" });
    }, state.animationDuration);
    dispatch({ actionType: "animate", data: timerID });
  }
  if (trackRef.current !== null && trackState === 1 /* Stopped */) {
    const TRACK = trackRef.current;
    TRACK.style.translate = `${negativeOffsetOrigin}px`;
    if (playAnimations) {
      TRACK.style.setProperty("transition", `all 0ms`);
    }
  }
  function delegatedMoveHandler(e) {
    if (carouselResetTimer === null && trackState === 2 /* Playing */) {
      return dispatch({ actionType: 0 /* Focus */ });
    }
    if (trackState === 3 /* Moving */ || trackState === 5 /* Grabbed */) {
      const track = trackRef.current;
      const dragDistance2 = e.clientX - firstX;
      dispatch({
        actionType: 4 /* Move */,
        data: {
          dragDistance: dragDistance2
        }
      });
      if (track && dragDistance2 > deadZone || track && dragDistance2 < deadZone * -1) {
        track.style.translate = `${dragDistance2 + negativeOffsetOrigin}px`;
      } else {
        track.style.translate = `${negativeOffsetOrigin}px`;
      }
    }
  }
  const [isEventRefSet, setIsEventRefSet] = useState3(false);
  function setEventRef(e, next) {
    if (e.type === "mouseleave" || e.type === "mouseup" && !isEventRefSet) {
      setIsEventRefSet(true);
    }
    if (e.type === "mouseup" || trackState === 6 /* Focused */ && e.type === "mousedown") {
      eventRef.current = e;
      setIsEventRefSet(false);
    }
    next(e);
  }
  function focusCarousel(e) {
    if (eventRef.current?.type === "mouseup" || trackState === 2 /* Playing */) {
      return;
    }
    dispatch({ actionType: 0 /* Focus */ });
    if (carouselRef.current !== null) {
      carouselRef.current.style.cursor = "grab";
    }
  }
  function release(e) {
    if (e?.type === "mouseleave") {
      return dispatch({ actionType: 3 /* Release */ });
    }
    if (eventRef.current?.type !== "mouseup" || typeof e === "undefined") {
      return;
    }
    if (carouselRef.current !== null && trackRef.current !== null) {
      carouselRef.current.style.cursor = "grab";
    }
    if (playAnimations && (dragDistance > deadZone || dragDistance < deadZone * -1)) {
      const dragThreshold = (threshold = trackRef.current.children[1].offsetLeft) => {
        let dragThresholdVector = Math.round(dragDistance / threshold) * -1;
        let rollover = null;
        if (
          // negative value would set activeSlide to a negative value
          state.activeSlide + dragThresholdVector < 0
        ) {
          rollover = state.activeSlide + dragThresholdVector + countOfChildren;
        } else if (
          // positive value would go over countOfChildren
          state.activeSlide + dragThresholdVector > countOfChildren - 1
        ) {
          rollover = (state.activeSlide + dragThresholdVector) % countOfChildren;
        }
        return rollover ?? state.activeSlide + dragThresholdVector;
      };
      dispatch({
        actionType: 3 /* Release */,
        data: {
          activeSlide: dragThreshold()
        }
      });
    } else {
      dispatch({ actionType: "stopAnimation" });
    }
  }
  useEffect2(() => {
    if (negativeOffsetOrigin === 0 && trackState === 0 /* Initialize */ && trackRef.current !== null) {
      const playAnimations2 = true === window.matchMedia("(prefers-reduced-motion: reduce)").matches ? false : true;
      if (playAnimations2 && carouselRef.current) {
        carouselRef.current.style.setProperty("--transition-duration", "300ms");
      }
      let slide = trackRef.current.children[slidesToClone];
      let origin = slide.offsetLeft;
      const margin = parseInt(window.getComputedStyle(slide).marginLeft, 10);
      origin = (origin - margin) * -1;
      trackRef.current.style.translate = `-${origin}px`;
      dispatch({
        actionType: "Initialize",
        data: {
          negativeOffsetOrigin: origin,
          playAnimations: playAnimations2,
          countOfSlides: countOfChildren
        }
      });
    }
    document.addEventListener("mousemove", removableMoveCB);
    document.addEventListener("touchmove", removableMoveCB);
    document.addEventListener("mouseup", removableReleaseCB);
    document.addEventListener("touchend", removableReleaseCB);
    return () => {
      document.removeEventListener("mousemove", removableMoveCB);
      document.removeEventListener("touchmove", removableMoveCB);
      document.removeEventListener("mouseup", removableReleaseCB);
      document.removeEventListener("touchend", removableReleaseCB);
    };
  }, [removableMoveCB, removableReleaseCB, trackState]);
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("div", { id: "dev-info" }, playAnimations === true && /* @__PURE__ */ React4.createElement("h2", null, "State: ", trackStateTitle[state.trackState]), /* @__PURE__ */ React4.createElement("p", null, "Active Slide: ", state.activeSlide, " "), /* @__PURE__ */ React4.createElement("h2", null, "Drag Distance:", dragDistance < deadZone * -1 ? "(<) " : "", ` ${dragDistance} `, dragDistance > deadZone ? " (>) " : "", trackRef.current !== null && `| DragThresholdRaw: ${dragDistance % trackRef.current.children[0].clientWidth} | DragThresholdPercent: ${Math.round(
    dragDistance / trackRef.current.children[0].clientWidth * -1 * 100
  ) / 100}`)), /* @__PURE__ */ React4.createElement(
    "div",
    {
      className: "carousel",
      "aria-label": true === autoplay ? "Projects Carousel with autoplay" : "Projects Carousel",
      onMouseUp: (e) => {
        setEventRef(e, release);
      },
      onMouseLeave: (e) => {
        setEventRef(e, release);
      },
      onTouchEnd: (e) => {
        setEventRef(e, release);
      },
      onMouseEnter: (e) => setEventRef(e, focusCarousel),
      onTouchStart: (e) => setEventRef(e, focusCarousel),
      onFocusCapture: (e) => setEventRef(e, focusCarousel),
      onMouseMove: (e) => setEventRef(e, focusCarousel),
      role: "region",
      ref: carouselRef
    },
    /* @__PURE__ */ React4.createElement(
      "a",
      {
        "aria-label": "Skip Carousel Content",
        className: "visually-hidden",
        id: "beforeCarousel",
        href: "#beyondCarousel"
      }
    ),
    /* @__PURE__ */ React4.createElement(CarouselContext.Provider, { value: { state, dispatch } }, /* @__PURE__ */ React4.createElement(CarouselControls, null), /* @__PURE__ */ React4.createElement(
      CarouselTrack,
      {
        trackRef,
        carouselRef: carouselRef.current !== null ? carouselRef : {
          current: {}
        },
        setEventRef
      },
      children
    )),
    trackState === 6 /* Focused */ && /* @__PURE__ */ React4.createElement(
      "a",
      {
        "aria-label": "Move focus before carousel",
        id: "beyondCarousel",
        href: "#beforeCarousel"
      }
    )
  ));
}

// src/ts/components/project/project.tsx
import React5, {
  useState as useState4
} from "react";
var projectStateEnum = {
  Closed: 0,
  Open: 1
};
function Project({
  srcSlug,
  alt,
  title,
  subtitle,
  children,
  btn_href
}) {
  const [projectState, setProjectState] = useState4(projectStateEnum["Closed"]);
  let classes = projectState === projectStateEnum["Closed"] ? "" : "expanded";
  classes += " project";
  function projectExpand() {
    setProjectState(projectStateEnum["Open"]);
  }
  function projectRevert() {
    setProjectState(projectStateEnum["Closed"]);
  }
  return /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement(
    "article",
    {
      className: classes,
      onClick: () => projectExpand(),
      onMouseEnter: () => projectExpand(),
      onMouseLeave: () => projectRevert(),
      "aria-expanded": projectState === projectStateEnum["Open"] ? true : false
    },
    /* @__PURE__ */ React5.createElement("picture", null, /* @__PURE__ */ React5.createElement("source", { srcSet: `assets/media/${srcSlug}.png.webp`, type: "image/webp" }), /* @__PURE__ */ React5.createElement("source", { srcSet: `assets/media/${srcSlug}.png`, type: "image/png" }), /* @__PURE__ */ React5.createElement("img", { src: `assets/media/${srcSlug}.png.webp`, alt: alt ?? "" })),
    /* @__PURE__ */ React5.createElement("div", { className: "content" }, /* @__PURE__ */ React5.createElement("h3", null, title, " ", /* @__PURE__ */ React5.createElement("span", null, subtitle)), children, /* @__PURE__ */ React5.createElement("a", { className: "btn", href: btn_href, target: "_blank" }, "Visit ", title))
  ));
}

// src/ts/hooks/homepage/useScrollBackground.tsx
import { useEffect as useEffect3 } from "react";
function useScrollBackground() {
  useEffect3(() => {
    if (window) {
      const htmlHeight = document.querySelector("html")?.offsetHeight;
      const imgref = document.querySelector(".shapes img");
      const handleScroll = () => {
        const normalTotalHeight = (htmlHeight ?? 0) - window.innerHeight;
        const scrolledNormal = window.scrollY / normalTotalHeight;
        imgref.style.transform = `translateY(-${scrolledNormal * 10 + 1}%)`;
      };
      window.addEventListener("scroll", handleScroll);
    }
  }, []);
  return;
}

// src/ts/main.tsx
function App() {
  useScrollBackground();
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, /* @__PURE__ */ React6.createElement(React6.StrictMode, null, /* @__PURE__ */ React6.createElement(Carousel, null, Projects)));
}

// src/ts/testserver.tsx
import React7 from "react";
import { renderToString } from "react-dom/server";
console.log(renderToString(/* @__PURE__ */ React7.createElement(App, null)));
