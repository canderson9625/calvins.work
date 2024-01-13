import React, {
    MutableRefObject,
    PropsWithChildren,
    useCallback,
    useEffect,
    useReducer,
    useRef,
} from "react";
import { actionTypeStates, carouselAction, CarouselContext, CarouselDefaults, carouselState, Evt, trackStateTitle } from '@components/carousel/constants';
import CarouselControls from "./controls";
import CarouselTrack from "./track";

// Should handle mainly state update, reset and value fallbacks
function reducerHandler(state: carouselState, action: carouselAction): carouselState {
    const { actionType } = action;
    let result;
    switch ( actionType ) {
        case 'Initialize' :
            result = { ...state,
                ...action.data,
                trackState: true === action.data.playAnimations ? trackStateTitle['Playing'] : trackStateTitle['Stopped'],
            }
            break;
        case actionTypeStates['Focus'] :
            result = { ...state, trackState: trackStateTitle['Focused'] };
            break;
        case actionTypeStates['Grab'] :
            result = { ...state, trackState: trackStateTitle['Grabbed'], firstX: action.data };
            break;
        case 'animate' : 
            result = { ...state, carouselResetTimer: action.data }
            break;
        case actionTypeStates['Move'] :
            result = { ...state, trackState: trackStateTitle['Moving'], dragDistance: action.data.dragDistance };
            break;
        case actionTypeStates['Release'] :
            result = { ...state, trackState: trackStateTitle['Playing'], firstX: 0, dragDistance: 0, activeSlide: action.data?.activeSlide < 0 ? 0 : action.data.activeSlide };
            break;
        case 'stopAnimation' : 
            result = { ...state, trackState: trackStateTitle['Stopped'], carouselResetTimer: null }
            break;
        default:
            result = { ...state }; 
    }

    // console.log(Date.now(), result, state, action);
    return result;
}

export default function Carousel({ children, autoplay }: PropsWithChildren & { autoplay?: boolean }) {
    
    let countOfChildren: number = React.Children.count(children);

    const carouselRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [ state, dispatch ] = useReducer(reducerHandler, CarouselDefaults);
    const { 
        carouselResetTimer,
        deadZone,
        dragDistance,
        firstX,
        negativeOffsetOrigin,
        playAnimations,
        slidesToClone,
        trackState,
    } = state;

    const removableMoveCB = useCallback((x: any) => { delegatedMoveHandler(x as Evt) }, [trackState])
    const removableReleaseCB = useCallback(() => { release() }, [trackState])

    // allow for animations if enabled
    if ( playAnimations && carouselResetTimer === null && trackState === trackStateTitle['Playing'] ) {
        let timerID = setTimeout(() => { 
            dispatch({ actionType: 'stopAnimation' })
        }, state.animationDuration);
        dispatch({ actionType: 'animate', data: timerID })
    }

    // reset carousel to origin
    if ( trackRef.current !== null && (trackState === trackStateTitle['Playing'] || trackState === trackStateTitle['Stopped']) ) {
        trackRef.current.style.translate = `${negativeOffsetOrigin}px`;
    }

    function delegatedMoveHandler(e: Evt) {
        // Track component sets the firstX value

        if ( carouselResetTimer === null && trackState === trackStateTitle['Playing'] ) {
            return dispatch( {actionType: actionTypeStates['Focus']} );
        }

        if ( trackState === trackStateTitle['Moving'] || trackState === trackStateTitle['Grabbed'] ) {
            // user is dragging the carousel
            const track = trackRef.current as HTMLDivElement;
            // const dragDistance = (e.clientX - firstX) + negativeOffsetOrigin;
            const dragDistance = (e.clientX - firstX);
            
            dispatch( {
                actionType: actionTypeStates['Move'], 
                data: { 
                    dragDistance: dragDistance
                }
            });

            if ( track && dragDistance > deadZone || track && dragDistance < (deadZone * -1) ) {
                track.style.translate = `${dragDistance + negativeOffsetOrigin}px`;
            } else {
                track.style.translate = `${negativeOffsetOrigin}px`;
            }
        }
    }

    function focusCarousel(e: Evt) {
        dispatch({ actionType: actionTypeStates['Focus'] });

        // const anchorTag = carouselRef.current?.querySelector('#beforeCarousel') as HTMLAnchorElement;
        // if ( e.type === 'focus' && anchorTag.dataset.focused === "true" ) {
        //     // anchorTag.focus();
        //     anchorTag.dataset.focused = "true";
        // }

        if ( carouselRef.current !== null ) {
            carouselRef.current.style.cursor = 'grab';
        }
    }

    function release() {
        if ( carouselRef.current !== null && trackRef.current !== null ) {
            // reset cursor style
            carouselRef.current.style.cursor = 'grab';
        }

        if ( 
            // playAnimations && 
            dragDistance > deadZone || 
            // playAnimations && 
            dragDistance < (deadZone * -1) 
        ) {
            // user dragged and released
            const dragThreshold = (threshold = trackRef.current!.children[0].clientWidth) => {
                // when threshold is breached, count as an increase

                // a negative or positive value to indicate how many slides to move
                // let dragThresholdVector = Math.round( dragDistance / (trackRef.current!.clientWidth * threshold ) );
                let dragThresholdVector = Math.round( dragDistance / threshold ) * -1;

                /*
                * Check if the the active slide value should roll over
                */
                let rollover = null;
                if (
                    // negative value would set activeSlide to a negative value
                    state.activeSlide + dragThresholdVector < 0
                ) {
                    rollover = state.activeSlide + dragThresholdVector + countOfChildren;
                } else if ( 
                    // positive value would go over countOfChildren
                    state.activeSlide + dragThresholdVector > countOfChildren
                ) {
                    rollover = state.activeSlide + dragThresholdVector % countOfChildren;
                }

                return rollover ?? state.activeSlide + dragThresholdVector;
            }

            dispatch({ 
                actionType: actionTypeStates['Release'], 
                data: { 
                    activeSlide: dragThreshold()
                } 
            })
        } else {
            // user did not drag the carousel
            dispatch({ actionType: 'stopAnimation' });
        }
    }

    useEffect(() => {   
        if ( trackState === trackStateTitle['Initialize'] && trackRef.current !== null ) {
            // false disables animations
            const mediaQuery = true === window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : true;

            let slide = trackRef.current.children![slidesToClone] as HTMLElement;
            let origin = slide.offsetLeft;

            // get the margin on the carousel item which should be the same for them all
            const margin = parseInt(window.getComputedStyle(slide).marginLeft, 10);
            origin = (origin - margin) * -1; // update the origin with the margin
            trackRef.current.style.translate = `-${origin}px`; // sets the offset for the track which aligns after the cloned items

            dispatch({ actionType: 'Initialize', data: { negativeOffsetOrigin: origin, playAnimations: mediaQuery, countOfSlides: countOfChildren }});
        }

        document.addEventListener('mousemove', removableMoveCB);
        document.addEventListener('touchmove', removableMoveCB);
        document.addEventListener('mouseup', removableReleaseCB)
        document.addEventListener('touchend', removableReleaseCB)
        
        return () => {
            document.removeEventListener('mousemove', removableMoveCB);
            document.removeEventListener('touchmove', removableMoveCB);
            document.removeEventListener('mouseup', removableReleaseCB)
            document.removeEventListener('touchend', removableReleaseCB)
        }
    }, [
        trackState
    ]);

    return (<>
        <div className="carousel"
            aria-label={ true === autoplay ? 'Projects Carousel with autoplay' : 'Projects Carousel' }
            onMouseUp={release} onMouseLeave={release} onTouchEnd={release}
            onMouseEnter={focusCarousel} onTouchStart={focusCarousel} onFocusCapture={(e: any) => focusCarousel(e)}
            role="region"
            ref={carouselRef}
        >   
            <a 
                aria-label="Skip Carousel Content" 
                className="visually-hidden" 
                id="beforeCarousel" 
                href="#beyondCarousel" 
            ></a>

            {
            /* 
             * Dev Info
             */
            }
            <div id="dev-info">
                { playAnimations === true && <h2>State: { trackStateTitle[state.trackState] }</h2> }
                <p>Active Slide: { state.activeSlide } </p>
                <h2> Drag Distance: 
                    { dragDistance < (deadZone * -1) ? '(<) ' : '' } 
                    { ` ${dragDistance} ` } 
                    { dragDistance > deadZone ? ' (>) ' : '' } 
                    | DragThresholdRaw: { dragDistance % trackRef?.current?.children[0].clientWidth } 
                    &nbsp;| DragThresholdPercent: { Math.round((dragDistance / trackRef?.current?.children[0].clientWidth * -1) * 100 ) / 100 }</h2>
            </div>
            {
            /* 
             * End Dev Info
             */
            }

            <CarouselContext.Provider value={{state: state, dispatch: dispatch}}>
                <CarouselControls />
                <CarouselTrack trackRef={trackRef} carouselRef={ carouselRef.current !== null ? carouselRef : { current: {} as HTMLDivElement } as MutableRefObject<HTMLDivElement> }>
                    { children }
                </CarouselTrack>
            </CarouselContext.Provider>
            { trackState === trackStateTitle['Focused'] && <a aria-label="Move focus before carousel" id="beyondCarousel" href="#beforeCarousel"></a> }
        </div>
    </>);
}