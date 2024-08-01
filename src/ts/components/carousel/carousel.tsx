import React, {
   MutableRefObject,
   PropsWithChildren,
   useCallback,
   useEffect,
   useRef,
   useState,
} from "react";
import {
   actionTypeStates,
   Evt,
   trackStateTitle,
} from "@components/carousel/constants";
import CarouselControls from "./controls";
import CarouselTrack from "./track";
import { CarouselProvider, useCarouselContext } from "./context";

// TODO: more refactor
const useClientSideRendering = (children: React.ReactNode, autoplay: boolean = false) => {
   // early return if used in renderToString
   if (window === undefined) return

   let countOfChildren: number = React.Children.count(children);
   const {
      state,
      state: {
         activeSlide,
         animationDuration,
         carouselResetTimer,
         deadZone,
         dragDistance,
         firstX,
         negativeOffsetOrigin,
         playAnimations,
         slidesToClone,
         trackState,
      }, 
      dispatch
   } = useCarouselContext()
   const carouselRef = useRef<HTMLDivElement | null>(null);
   const trackRef = useRef<HTMLDivElement | null>(null);
   const eventRef = useRef<Evt | null>(null);

   const handleMove = useCallback((e: Evt) => {
      // if (
      //    carouselResetTimer === null &&
      //    trackState === trackStateTitle["Playing"]
      // ) {
      //    return dispatch({ actionType: actionTypeStates["Focus"] });
      // }

      if (
         trackState === trackStateTitle["Moving"] ||
         trackState === trackStateTitle["Grabbed"]
      ) {
         // user is dragging the carousel
         const track = trackRef.current as HTMLDivElement;
         // Track component sets the firstX value
         const dragDistance = e.clientX - firstX;
         // const dragDistance = (e.clientX - firstX) + negativeOffsetOrigin;

         dispatch({
            actionType: actionTypeStates["Move"],
            data: {
               dragDistance,
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
   }, [trackState])

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
      if (trackState === trackStateTitle["Shift"]) {
         dispatch({ actionType: actionTypeStates["Release"] });
      }

      if (
         eventRef.current?.type === "mouseup" ||
         trackState === trackStateTitle["Playing"] ||
         trackState === trackStateTitle["Moving"] ||
         trackState === trackStateTitle["Grabbed"] 
         // || trackState === trackStateTitle["Stopped"]
      ) {
         return;
      }

      if (trackState !== "Focused") {
         dispatch({ actionType: actionTypeStates["Focus"] });
      }
      // coming back: a11y
      // const anchorTag = carouselRef.current?.querySelector('#beforeCarousel') as HTMLAnchorElement;
      // if ( e.type === 'focus' && anchorTag.dataset.focused === "true" ) {
      //     // anchorTag.focus();
      //     anchorTag.dataset.focused = "true";
      // }

      if (carouselRef.current !== null) {
         carouselRef.current.style.cursor = "grab";
      }
   }

   const release = useCallback((e?: Evt) => {
      // if user leaves the carousel while dragging
      if (e?.type === "mouseleave" && trackStateTitle[trackState] === "Moving") {
         return dispatch({ actionType: actionTypeStates["Release"] });
      }

      // if release is called while carousel is stopped or playing
      if (trackStateTitle[trackState] === "Stopped" || trackStateTitle[trackState] === "Playing" || eventRef.current?.type !== "mouseup" || typeof e === "undefined") {
         return;
      }

      // reset cursor style
      if (carouselRef.current !== null && trackRef.current !== null) {
         carouselRef.current.style.cursor = "grab";
      }

      try {
         // console.log(trackStateTitle[trackState], dragDistance, deadZone, (dragDistance > deadZone), dragDistance < deadZone * -1)
         // user dragged and released
         if (
            (dragDistance > deadZone || dragDistance < deadZone * -1)
         ) {
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
                  activeSlide + dragThresholdVector <
                  0
               ) {
                  rollover = activeSlide + dragThresholdVector + countOfChildren;
               } else if (
                  // positive value would go over countOfChildren
                  activeSlide + dragThresholdVector >
                  countOfChildren - 1
               ) {
                  rollover =
                     (activeSlide + dragThresholdVector) % countOfChildren;
               }
   
               return rollover ?? activeSlide + dragThresholdVector;
            };
   
            return dispatch({
               actionType: playAnimations ? actionTypeStates["Release"] : "stopAnimation",
               data: {
                  activeSlide: dragThreshold(),
               },
            });
         } else {
            // user did not drag the carousel
            dispatch({ actionType: "stopAnimation" });
         }
      } catch (e) {
         console.error(e)
      }
   }, [playAnimations, trackState, dragDistance])

   useEffect(() => {
      try {
         // console.log(playAnimations, carouselResetTimer, trackStateTitle[trackState])
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
            let math;
            if (trackStateTitle["Shift"] === trackState) {
               math = negativeOffsetOrigin + (dragDistance > 0 ? TRACK.children[activeSlide].clientWidth + margin : -TRACK.children[activeSlide].clientWidth + margin)
            } else {
               math = negativeOffsetOrigin +
               (threshold === 0
                  ? dragDistance
                  : threshold > 0
                     ? (TRACK.children[threshold] as HTMLElement).offsetLeft + (dragDistance + margin)
                     : -(TRACK.children[threshold * -1] as HTMLElement).offsetLeft + (dragDistance + margin));
            }
            // console.log("playing animation", negativeOffsetOrigin, threshold, dragDistance, math)
            new Promise((resolve) => {
               TRACK.style.setProperty("transition", `all 0ms`);
               TRACK.style.setProperty("translate", `${math}px`);
               setTimeout(() => {
                  resolve(null);
               }, 50)
            }).then(() => {
               TRACK.style.setProperty(
                  "transition",
                  `translate ${CAROUSEL.style.getPropertyValue("--transition-duration")}`
               );
               TRACK.style.translate = `${negativeOffsetOrigin}px`;
            });
            let timerID = setTimeout(() => {
               dispatch({ actionType: "stopAnimation" });
            }, animationDuration);
            dispatch({ actionType: "animate", data: timerID });
         }
      } catch (e) {
         console.error(e)
      }
   
      console.log(trackStateTitle[trackState])
      // reset carousel to origin
      if (trackRef.current !== null && trackState === trackStateTitle["Stopped"]) {
         const TRACK = trackRef.current;
         TRACK.style.translate = `${negativeOffsetOrigin}px`;
         if (playAnimations) {
            TRACK.style.setProperty("transition", `all 0ms`);
         }
      }
   }, [playAnimations, trackState])

   useEffect(() => {
      try {

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
   
            let slide = trackRef.current.children[slidesToClone] as HTMLElement;
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
      } catch (e) {
         console.error(e)
      }

      // @ts-expect-error no overload matches ...
      document.addEventListener("mousemove", handleMove);
      // @ts-expect-error
      document.addEventListener("touchmove", handleMove);
      // @ts-expect-error
      document.addEventListener("mouseup", release);
      // @ts-expect-error
      document.addEventListener("touchend", release);
      
      return () => {
         // @ts-expect-error
         document.removeEventListener("mousemove", handleMove);
         // @ts-expect-error
         document.removeEventListener("touchmove", handleMove);
         // @ts-expect-error
         document.removeEventListener("mouseup", release);
         // @ts-expect-error
         document.removeEventListener("touchend", release);
      };
   }, [handleMove, release, trackState]);

   return (<>
      {/*
      * Dev Info
      */}
      <div id="dev-info">
         {playAnimations === true && (
            <h2>State: {trackStateTitle[trackState] ?? trackState}</h2>
         )}
         <p>Active Slide: {activeSlide} </p>
         <h2>
            Drag Distance:
            {dragDistance < deadZone * -1 ? "(<) " : ""}
            {` ${dragDistance} `}
            {dragDistance > deadZone ? " (>) " : ""}

            {trackRef.current !== null &&
               `| DragThresholdRaw: ${dragDistance % trackRef.current.children[0]?.clientWidth
               } ` +
               `| DragThresholdPercent: ${Math.round(
                  (dragDistance / trackRef.current.children[0]?.clientWidth) *
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

         {/* <CarouselContext.Provider value={{ state: state, dispatch: dispatch }}> */}
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
         {/* </CarouselContext.Provider> */}
         {trackState === trackStateTitle["Focused"] && (
            <a
               aria-label="Move focus before carousel"
               id="beyondCarousel"
               href="#beforeCarousel"
            ></a>
         )}
      </div>
   </>)
}

function CarouselComponent({
   children,
   autoplay,
}: PropsWithChildren & { autoplay?: boolean }) {
   const CSRContent = useClientSideRendering(children, autoplay) ?? ""

   return (
      CSRContent
   );
}

export default function Carousel({
   children,
   autoplay,
}: PropsWithChildren & { autoplay?: boolean }) {
   return (
      <CarouselProvider>
         <CarouselComponent autoplay={autoplay}>
            {children}
         </ CarouselComponent>
      </CarouselProvider>
   );
}
