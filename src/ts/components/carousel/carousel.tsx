import React, {
   MutableRefObject,
   PropsWithChildren,
   useCallback,
   useEffect,
   useReducer,
   useRef,
   useState,
} from "react";
import {
   actionTypeStates,
   carouselAction,
   CarouselContext,
   CarouselDefaults,
   carouselState,
   Evt,
   trackStateTitle,
} from "@components/carousel/constants";
import CarouselControls from "./controls";
import CarouselTrack from "./track";

function rolloverActiveSlide(state: carouselState, dragThresholdVector: number, maxVal: number) {
   /*
   * Check if the the active slide value should roll over
   */
   let rollover = null;
   if (
      // negative value would set activeSlide to a negative value
      state.activeSlide + dragThresholdVector <
      0
   ) {
      rollover = state.activeSlide + dragThresholdVector + maxVal;
   } else if (
      // positive value would go over maxVal
      state.activeSlide + dragThresholdVector >
      maxVal - 1
   ) {
      rollover =
         (state.activeSlide + dragThresholdVector) % maxVal;
   }

   return rollover ?? state.activeSlide + dragThresholdVector;
}

// Should handle mainly state update, reset and value fallbacks
function reducerHandler(
   state: carouselState,
   action: carouselAction
): carouselState {
   const { actionType } = action;
   let result;
   switch (actionType) {
      case "Initialize":
         result = {
            ...state,
            ...action.data,
            // trackState: trackStateTitle["Stopped"],
         };
         break;
      case "Update":
         result = { ...state, ...action.data };
         break;
      case actionTypeStates["Focus"]:
         result = { ...state, trackState: trackStateTitle["Focused"], focus: state.focus + 1 };
         break;
      case actionTypeStates["Grab"]:
         result = {
            ...state,
            trackState: trackStateTitle["Grabbed"],
            firstX: action.data,
         };
         break;
      case actionTypeStates["Move"]:
         result = (
            state.trackState === trackStateTitle["Moving"] ||
            state.trackState === trackStateTitle["Grabbed"]
         ) ? {
            ...state,
            trackState: trackStateTitle["Moving"],
            dragDistance: action.data.dragDistance,
         } : {
            ...state
         };
         break;
      case actionTypeStates["Release"]:
         result = {
            ...state,
            trackState: trackStateTitle["Playing"],
            firstX: 0,
            // dragDistance: 0,
            activeSlide: action.data?.activeSlide < 0 ? 0 : action.data?.activeSlide ?? state.activeSlide,
         };
         break;
      case "shift":
         const activeSlide = rolloverActiveSlide(state, action.data?.shift, state.countOfSlides)
         result = {
            ...state,
            trackState: trackStateTitle["Shift"],
            activeSlide: activeSlide,
            dragDistance: action.data.shift,
         }
         break;
      case "animate":
         result = { ...state, carouselResetTimer: action.data };
         break;
      case "stopAnimation":
         result = {
            ...state,
            trackState: state.focus === 0 ? trackStateTitle["Stopped"] : trackStateTitle["Focused"],
            carouselResetTimer: null,
            dragDistance: 0,
            firstX: 0,
            focus: state.focus--
         };
         break;
      default:
         result = { ...state };
   }

   // console.log(Date.now(), result, state, action);
   return result;
}

export default function Carousel({
   children,
   autoplay,
}: PropsWithChildren & { autoplay?: boolean }) {
   let countOfChildren: number = React.Children.count(children);

   const carouselRef = useRef<HTMLDivElement | null>(null);
   const trackRef = useRef<HTMLDivElement | null>(null);
   const eventRef = useRef<Evt | null>(null);
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
      trackState,
   } = state;

   const removableMoveCB = (x: any) => {
      delegatedMoveHandler(x as Evt);
   };
   const removableReleaseCB = () => {
      release();
   };

   // allow for animations if enabled
   if (
      playAnimations &&
      carouselResetTimer === null &&
      (trackState === trackStateTitle["Playing"] || trackState === trackStateTitle["Shift"]) &&
      carouselRef.current &&
      trackRef.current
   ) {
      const CAROUSEL = carouselRef.current;
      const TRACK = trackRef.current;
      const margin = ((TRACK.children[1] as HTMLElement).offsetLeft - (TRACK.children[0] as HTMLElement).offsetLeft - (TRACK.children[1] as HTMLElement).clientWidth) / 2
      const threshold = Math.round(
         (dragDistance / (TRACK.children[1] as HTMLElement).offsetLeft) * -1
      )
      // get how far the user dragged from new position
      let math =
         negativeOffsetOrigin +
         (threshold === 0
            ? dragDistance
            : threshold > 0
               ? (TRACK.children[threshold] as HTMLElement).offsetLeft + dragDistance + margin
               : -(TRACK.children[threshold * -1] as HTMLElement).offsetLeft + dragDistance + margin);
      // console.log("playing animation", negativeOffsetOrigin, threshold, dragDistance, math)

      if (trackStateTitle[trackState] === "Shift") {
         math = negativeOffsetOrigin + (dragDistance > 0 ? TRACK.children[activeSlide].clientWidth + margin : -TRACK.children[activeSlide].clientWidth + margin)
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

   // reset carousel to origin
   if (trackRef.current !== null && trackState === trackStateTitle["Stopped"]) {
      const TRACK = trackRef.current;
      TRACK.style.translate = `${negativeOffsetOrigin}px`;
      if (playAnimations) {
         TRACK.style.setProperty("transition", `all 0ms`);
      }
   }

   function delegatedMoveHandler(e: Evt) {
      // Track component sets the firstX value

      if (
         carouselResetTimer === null &&
         trackState === trackStateTitle["Playing"]
      ) {
         return dispatch({ actionType: actionTypeStates["Focus"] });
      }

      if (
         trackState === trackStateTitle["Moving"] ||
         trackState === trackStateTitle["Grabbed"]
      ) {
         // user is dragging the carousel
         const track = trackRef.current as HTMLDivElement;
         // const dragDistance = (e.clientX - firstX) + negativeOffsetOrigin;
         const dragDistance = e.clientX - firstX;

         dispatch({
            actionType: actionTypeStates["Move"],
            data: {
               dragDistance: dragDistance,
            },
         });

         if (
            (track && dragDistance > deadZone) ||
            (track && dragDistance < deadZone * -1)
         ) {
            track.style.translate = `${dragDistance + negativeOffsetOrigin}px`;
         } else {
            track.style.translate = `${negativeOffsetOrigin}px`;
         }
      }
   }

   const [isEventRefSet, setIsEventRefSet] = useState(false);
   function setEventRef(e: Evt, next: (...args: any) => any) {
      if (e.type === "mouseleave" || (e.type === "mouseup" && !isEventRefSet)) {
         setIsEventRefSet(true);
      }
      if (
         e.type === "mouseup" ||
         (trackState === trackStateTitle["Focused"] && e.type === "mousedown")
      ) {
         eventRef.current = e;
         setIsEventRefSet(false);
      }
      next(e);
   }

   function focusCarousel(e: Evt) {
      if (
         eventRef.current?.type === "mouseup" ||
         trackState === trackStateTitle["Playing"]
      ) {
         return;
      }
      dispatch({ actionType: actionTypeStates["Focus"] });
      // const anchorTag = carouselRef.current?.querySelector('#beforeCarousel') as HTMLAnchorElement;
      // if ( e.type === 'focus' && anchorTag.dataset.focused === "true" ) {
      //     // anchorTag.focus();
      //     anchorTag.dataset.focused = "true";
      // }

      if (carouselRef.current !== null) {
         carouselRef.current.style.cursor = "grab";
      }
   }

   function release(e?: Evt) {
      if (e?.type === "mouseleave") {
         return dispatch({ actionType: actionTypeStates["Release"] });
      }

      if (eventRef.current?.type !== "mouseup" || typeof e === "undefined") {
         return;
      }

      if (carouselRef.current !== null && trackRef.current !== null) {
         // reset cursor style
         carouselRef.current.style.cursor = "grab";
      }

      if (
         playAnimations &&
         (dragDistance > deadZone || dragDistance < deadZone * -1)
      ) {
         // user dragged and released
         const dragThreshold = (
            threshold = (trackRef.current!.children[1] as HTMLElement).offsetLeft
         ) => {
            // when threshold is breached, count as an increase

            // a negative or positive value to indicate how many slides to move
            let dragThresholdVector = Math.round(dragDistance / threshold) * -1;

            /*
             * Check if the the active slide value should roll over
             */
            let rollover = null;
            if (
               // negative value would set activeSlide to a negative value
               state.activeSlide + dragThresholdVector <
               0
            ) {
               rollover = state.activeSlide + dragThresholdVector + countOfChildren;
            } else if (
               // positive value would go over countOfChildren
               state.activeSlide + dragThresholdVector >
               countOfChildren - 1
            ) {
               rollover =
                  (state.activeSlide + dragThresholdVector) % countOfChildren;
            }

            return rollover ?? state.activeSlide + dragThresholdVector;
         };

         dispatch({
            actionType: actionTypeStates["Release"],
            data: {
               activeSlide: dragThreshold(),
            },
         });
      } else {
         // user did not drag the carousel
         dispatch({ actionType: "stopAnimation" });
      }
   }

   useEffect(() => {
      if (
         negativeOffsetOrigin === 0 &&
         trackState === trackStateTitle["Initialize"] &&
         trackRef.current !== null
      ) {
         // false disables animations
         const playAnimations =
            true === window.matchMedia("(prefers-reduced-motion: reduce)").matches
               ? false
               : true;

         if (playAnimations && carouselRef.current) {
            carouselRef.current.style.setProperty("--transition-duration", "300ms");
         }

         let slide = trackRef.current.children![slidesToClone] as HTMLElement;
         let origin = slide.offsetLeft;

         // get the margin on the carousel item which should be the same for them all
         const margin = parseInt(window.getComputedStyle(slide).marginLeft, 10);
         origin = (origin - margin) * -1; // update the origin with the margin
         trackRef.current.style.translate = `-${origin}px`; // sets the offset for the track which aligns after the cloned items

         dispatch({
            actionType: "Initialize",
            data: {
               negativeOffsetOrigin: origin,
               playAnimations: playAnimations,
               countOfSlides: countOfChildren,
            },
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

   return (
      <>
         {/*
         * Dev Info
         */}
         <div id="dev-info">
            {playAnimations === true && (
               <h2>State: {trackStateTitle[state.trackState]}</h2>
            )}
            <p>Active Slide: {state.activeSlide} </p>
            <h2>
               Drag Distance:
               {dragDistance < deadZone * -1 ? "(<) " : ""}
               {` ${dragDistance} `}
               {dragDistance > deadZone ? " (>) " : ""}

               {trackRef.current !== null &&
                  `| DragThresholdRaw: ${dragDistance % trackRef.current.children[0].clientWidth
                  } ` +
                  `| DragThresholdPercent: ${Math.round(
                     (dragDistance / trackRef.current.children[0].clientWidth) *
                     -1 *
                     100
                  ) / 100
                  }`}
            </h2>
         </div>
         {/*
         * End Dev Info
         */}
         <div
            className="carousel"
            aria-label={
               true === autoplay
                  ? "Projects Carousel with autoplay"
                  : "Projects Carousel"
            }
            onMouseUp={(e: Evt) => {
               setEventRef(e, release);
            }}
            onMouseLeave={(e: Evt) => {
               setEventRef(e, release);
            }}
            onTouchEnd={(e: Evt) => {
               setEventRef(e, release);
            }}
            onMouseEnter={(e: Evt) => setEventRef(e, focusCarousel)}
            onTouchStart={(e: Evt) => setEventRef(e, focusCarousel)}
            onFocusCapture={(e: any) => setEventRef(e, focusCarousel)}
            onMouseMove={(e: Evt) => setEventRef(e, focusCarousel)}
            role="region"
            ref={carouselRef}
         >
            <a
               aria-label="Skip Carousel Content"
               className="visually-hidden"
               id="beforeCarousel"
               href="#beyondCarousel"
            ></a>

            <CarouselContext.Provider value={{ state: state, dispatch: dispatch }}>
               <CarouselControls />
               <CarouselTrack
                  trackRef={trackRef}
                  carouselRef={
                     carouselRef.current !== null
                        ? carouselRef
                        : ({
                           current: {} as HTMLDivElement,
                        } as MutableRefObject<HTMLDivElement>)
                  }
                  setEventRef={setEventRef}
               >
                  {children}
               </CarouselTrack>
            </CarouselContext.Provider>
            {trackState === trackStateTitle["Focused"] && (
               <a
                  aria-label="Move focus before carousel"
                  id="beyondCarousel"
                  href="#beforeCarousel"
               ></a>
            )}
         </div>
      </>
   );
}
