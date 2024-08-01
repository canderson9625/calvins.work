import React, { FC, PropsWithChildren, useContext, useReducer } from "react"
import { actionTypeStates, carouselAction, CarouselContext, CarouselDefaults, carouselState, trackStateTitle } from "./constants"
import useProfileApp from "@hooks/profiling/useProfileApp"

export const useCarouselContext = () => {
    const ctx = useContext(CarouselContext)

    if (ctx === undefined) {
        throw new Error("useCarouselContext must be used within a CarouselProvider")
    }

    return ctx
}

/*
* Check if the the active slide value should roll over
*/
function rolloverActiveSlide(state: carouselState, dragThresholdVector: number, maxVal: number) {
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
        rollover = (state.activeSlide + dragThresholdVector) % maxVal;
    }
    return rollover ?? state.activeSlide + dragThresholdVector;
}

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
                trackState: trackStateTitle["Stopped"],
            };
            break;
        case "Update":
            result = { ...state, ...action.data };
            break;
        case actionTypeStates["Focus"]:
            result = { ...state, trackState: trackStateTitle["Focused"], 
            };
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
                ...action.data,
                trackState: trackStateTitle["Stopped"],
                carouselResetTimer: null,
                dragDistance: 0,
                firstX: 0,
            };
            break;
        default:
            result = { ...state };
    }

    // console.log(Date.now(), result, state, action);
    return result;
}

export type CarouselProvider = PropsWithChildren
export const CarouselProvider: FC<CarouselProvider> = ({children}) => {
    const [state, dispatch] = useReducer(reducerHandler, CarouselDefaults);

    const provide = {state, dispatch}

    // useProfileApp("CarouselProvider", provide)
    return <CarouselContext.Provider value={provide}>{children}</CarouselContext.Provider>
}

