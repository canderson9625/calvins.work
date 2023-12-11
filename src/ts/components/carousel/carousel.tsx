import React, { 
    PropsWithChildren, 
    useEffect,
    useRef,
    useState,
} from "react";
import { Evt } from '../components';

enum trackStateType {
    Stopped, 
    Playing, 
    Moving,
    Grabbed,
    Focused, // a11y
}

export default function Carousel(props: PropsWithChildren) {

    let { children } = props;
    children = children ?? '';
    if ( children === '' ) {
        return 'Pass children to render carousel';
    }

    const [ trackState, setTrackState ] = useState(trackStateType['Stopped']);
    const [ playAnimations, setPlayAnimations ] = useState(true);
    const [ activeItem, setActiveItem ] = useState<number|null>(null);
    
    const track = useRef<HTMLDivElement|null>(null);
    const [ firstX, setFirstX ] = useState(0);

    const len = [...children as Iterable<React.ReactNode>].length;
    let cursorStyle = trackState === trackStateType['Grabbed'] ? 'grabbing' : 'grab';
    cursorStyle = trackState === trackStateType['Moving'] ? 'not-allowed' : cursorStyle;

    function carouselEnter(e?: Evt) {
        if ( resetTimer !== null) {
            // clear timeout upon re-enter
            clearTimeout(resetTimer);
        } 
    }

    function cursorGrab(e?: Evt) {
        if ( trackState === trackStateType['Moving'] ) {
            // clear animation timeouts or allow animations to finish before allowing user interaction
            return;
        }
        
        setTrackState(trackStateType['Grabbed']);
    }

    function cursorMove(e: Evt) {
        if ( track.current !== null && trackState === trackStateType['Grabbed'] ) {
            if ( firstX === 0 ) return setFirstX(e.nativeEvent.clientX);
            const calculateDiff = (e: any) => { return e.clientX - firstX; };

            let diff = calculateDiff(e.nativeEvent);
            if ( diff < 16 && -16 < diff ) return;
            
            track.current.style.translate = `${diff}px`;
        }
    }

    function cursorRelease(e: Evt) {
        setTrackState(trackStateType['Moving']);

        let target = e.target as Element;
        let item: HTMLElement | null = target.closest('.item') as HTMLElement;
        if ( target.closest('.carousel') === null ) {
            // we need the document to listen for clicks and reset the carousel
            setActiveItem(null);
        }
        if ( item !== null) {
            setFirstX(0);
            setActiveItem(parseInt(item.dataset.index!, 10));
        }

        if ( !playAnimations ) {
            setTrackState(trackStateType['Stopped']);
            return;
        }

        setTimeout(() => {
            track.current!.style.translate = `0px`;
            setTrackState(trackStateType['Stopped']);
        }, 300);
    }

    let resetTimer: null|NodeJS.Timeout = null;
    function carouselReset(e: Evt) {
        if ( resetTimer !== null) {
            clearTimeout(resetTimer);
        } 

        resetTimer = setTimeout(() => {
            setTrackState(trackStateType['Stopped']);
            setActiveItem(null);
        }, 3000);
    }

    function shiftTrack(direction: number) {
        // direction -x is left, x is right
        if ( trackState === trackStateType['Moving'] ) {
            return;
        }


    }

    useEffect(() => {
        const mediaQuery = true === window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : true;
        // const handler = (e: Evt|MouseEvent) => { carouselReset(e as Evt); };
        // document.addEventListener('mouseup', handler);
        // document.addEventListener('mousedown', handler);
        
        return () => { 
            setPlayAnimations(mediaQuery);
            // document.removeEventListener('mouseup', handler);
            // document.removeEventListener('mousedown', handler);
        }
    // }, [setPlayAnimations, activeItem]);
    }, [setPlayAnimations]);

    return (<>
        <div className="carousel"
            style={{ cursor: cursorStyle }}
            onMouseUp={(e: Evt) => cursorRelease(e)} 
            onTouchEnd={(e: Evt) => cursorRelease(e)} 
            onTouchStart={(e: Evt) => cursorRelease(e)} 
            onMouseMove={(e: Evt) => cursorMove(e)}
            onTouchMove={(e: Evt) => cursorMove(e)}
            onMouseLeave={(e: Evt) => carouselReset(e)}
            onMouseEnter={(e: Evt) => carouselEnter(e)}
            >

            <div className="carousel-controls">
                <button className="toggle" 
                    onClick={() => setPlayAnimations(prevState => !prevState)}
                    >
                    Toggle Animations { true === playAnimations ? 'Off' : 'On' }
                </button>
            </div>

            <div className="track"
                onMouseDown={(e: Evt) => cursorGrab(e)}
                ref={track}
                >
                { [...children as Iterable<React.ReactNode>].map((val, idx) => {
                    let active = idx === activeItem ? ' active' : '';
                    return <div className={'item' + active} key={idx + 'item'} data-index={idx}>{ val }</div>;
                }) }
                { [...children as Iterable<React.ReactNode>].map((val, idx) => {
                    return <div className={'item item_clone'} key={idx + 'itemClone'} data-index={idx}>{ val }</div>;
                }) }
            </div>

            <div className="track-controls">
                <div className="prev" onClick={() => shiftTrack(-1) }></div>
                <div className="next" onClick={() => shiftTrack(1) }></div>
                <div className="pause" onClick={() => setTrackState(trackStateType['Stopped']) }></div>
            </div>
        </div>
    </>);
}