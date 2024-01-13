import React, { useContext, useEffect } from 'react';
import { actionTypeStates, carouselAction, CarouselContext, carouselState, Evt, trackStateTitle } from '@components/carousel/constants';
import useForwardedRef from '@hooks/useForwardedRef';

type trackProps = { 
    trackRef: React.RefObject<HTMLDivElement>;
    carouselRef: React.MutableRefObject<HTMLDivElement | null>;
} & React.PropsWithChildren;

export default function CarouselTrack(props: trackProps) {
    const { 
        children,
        carouselRef,
        trackRef
    } = props;

    // console.log(props);

    let countOfChildren: number = React.Children.count(children);

    const { state, dispatch } = useContext(CarouselContext);

    const {
        activeSlide,
        slidesToClone,
    } = state as carouselState;

    // const forwardedTrack = useForwardedRef(trackRef);

    function userGrabbedCarousel(e: Evt) {
        // set firstX
        dispatch({ actionType: actionTypeStates['Grab'], data: e.clientX });
    }

    if ( trackStateTitle[state.trackState] === 'Moving' && carouselRef?.current !== null ) {
        const carousel = carouselRef?.current as HTMLDivElement;
        carousel.style.cursor = 'grabbing';
    }

    return (<>
        <div className="track"
            onMouseDown={userGrabbedCarousel} onTouchStart={userGrabbedCarousel}
            ref={trackRef}
            >
            { [...children as Iterable<React.ReactNode>].map((val, idx, arr) => {
                // on first render only clones of last 4 items for scrolling backward, we can move or lazy load the rest
                if ( idx < countOfChildren - slidesToClone) return; 
                
                if ( activeSlide === 0 ) {
                    return <div className={'item item_clone'} key={idx + 'itemClone'} data-index={idx}>{ val }</div>;
                } else {
                    const permutation = (idx + activeSlide) % countOfChildren;
                    return <div className={'item item_clone'} key={permutation + 'itemClone'} data-index={permutation}>{ arr[permutation] }</div>;
                }
            }) }

            { [...children as Iterable<React.ReactNode>].map((val, idx, arr) => {
                const active = idx === activeSlide ? true : false;
                if ( activeSlide === 0 ) {
                    return <div className={'item'} aria-current={active} key={idx + 'item'} data-index={idx}>{ val }</div>;
                } else {
                    const permutation = (idx + activeSlide) % countOfChildren;
                    return <div className={'item'} aria-current={active} key={permutation + 'item'} data-index={permutation}>{ arr[permutation] }</div>;
                }
            }) }
        </div>
    </>)
}