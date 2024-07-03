import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { CarouselContext, actionTypeStates, trackStateTitle } from '@components/carousel/constants';

// type controlsProps = {
//     playAnimations: boolean
//     setPlayAnimations: Dispatch<SetStateAction<boolean>>
//     autoplay?: boolean
// }
export default function CarouselControls(
   // props: controlsProps
) {
   const [intervalEnabled, setIntervalEnabled] = useState(false)
   const [intervalId, setIntervalId] = useState<Timer | null>(null)
   const { state, dispatch } = useContext(CarouselContext);
   const {
      playAnimations,
      trackState,
      intervalDuration,
      focus
   } = state

   function shiftTrack(dragThresholdVector: number) {
      dispatch({ actionType: 'shift', data: { shift: dragThresholdVector } })
   }

   function handleIntervalStatus() {
      // dispatch({ actionType: 'Update', data: { playAnimations: !playAnimations } })
      setIntervalEnabled(!intervalEnabled)
   }

   let tempId: Timer | null = null;
   useEffect(() => {
      console.log(trackStateTitle[trackState])
      if (trackStateTitle[trackState] !== "Focused" && intervalId === null && (intervalEnabled || trackStateTitle[trackState] === "Initialize")) {
         tempId = setInterval(() => {
            dispatch({ actionType: 'shift', data: { trackState: trackStateTitle["Playing"], shift: 1 } })
         }, intervalDuration)
         setIntervalId(tempId)
      }
      if (trackStateTitle[trackState] === "Initialize") {
         // end initialize
         dispatch({ actionType: 'Update', data: { trackState: trackStateTitle["Stopped"] } })
      }

      return () => {
         console.log(intervalEnabled, intervalId)
         if ((tempId !== null || intervalId !== null) && (!intervalEnabled || trackStateTitle[trackState] === "Focused")) {
            console.log('remove', tempId, intervalId)
            tempId && clearInterval(tempId)
            intervalId && clearInterval(intervalId)
            setIntervalId(null)
         }
      }
   }, [focus]);

   return (<>
      <div className="carousel-state-controls">
         <button className="toggle"
            onClick={() => dispatch({ actionType: "Update", data: { playAnimations: !playAnimations } })}
         >
            Toggle Animations {true === playAnimations ? 'Off' : 'On'}
         </button>
      </div>

      <div className="track-controls">
         <button className="prev" onClick={() => shiftTrack(-1)}>Previous</button>
         <button className="next" onClick={() => shiftTrack(1)}>Next</button>
         <button className="pause" onClick={handleIntervalStatus}>{intervalId !== null ? "Pause" : "Play"} Carousel</button>
         {/* filter by project type */}
      </div>
   </>)
}