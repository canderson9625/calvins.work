import React from 'react';

type controlsProps = {
    playAnimations?: boolean;
    autoplay?: boolean;
}
export default function CarouselControls(props: controlsProps) {

    const { 
        playAnimations 
    } = props;

    return (<>
        <div className="carousel-state-controls">
            <button className="toggle" 
                // onClick={() => setPlayAnimations(prevState => !prevState)}
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