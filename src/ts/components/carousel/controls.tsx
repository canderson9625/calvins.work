import React, { Dispatch, SetStateAction, useContext } from 'react';
import { CarouselContext } from '@components/carousel/constants';

// type controlsProps = {
//     playAnimations: boolean
//     setPlayAnimations: Dispatch<SetStateAction<boolean>>
//     autoplay?: boolean
// }
export default function CarouselControls(
    // props: controlsProps
    ) {

    const { state, dispatch } = useContext(CarouselContext);
    const {
        playAnimations
    } = state

    return (<>
        <div className="carousel-state-controls">
            <button className="toggle" 
                onClick={() => dispatch({actionType: "Update", data: { playAnimations: !playAnimations}})}
                >
                Toggle Animations { true === playAnimations ? 'Off' : 'On' }
            </button>
        </div>

        <div className="track-controls">
            {/* <div className="prev" onClick={() => shiftTrack(-1) }></div>
            <div className="next" onClick={() => shiftTrack(1) }></div>
            <div className="pause" onClick={() => setTrackState(trackStateType['Stopped']) }></div> */}
            {/* filter by project type */}
        </div>
    </>)
}