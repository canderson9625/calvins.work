import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react"
import { renderToString } from "react-dom/server"

// how do various hooks behave in renderToString?
const testContext = createContext({
    // serverExecuted
    cb: true,
    context: false,
    ref: false,
    effect: false,
    state: false,
    reducer: false,
    memo: false,
    hook_memo: false
})

const useHookContext = () => {
    const ctx = useContext(testContext)

    return ctx
}

const cbcomponent = () => {
    const cb = useCallback(() => {
        console.log('test')
        return true
    }, [])

    return React.createElement("p", null, `useCallback: ${cb()}`)
}

const refcomponent = () => {
    const ref = useRef(null)
    return React.createElement("p", null, `useRef: ${ref.current}`)
}
// const effectcomponent = () => {
//     useEffect(() => {
//         console.log('useEffect')
//     }, [])
//     return <>useEffect</>
// }
// const layoutcomponent = () => {
//     useLayoutEffect(() => {
//         console.log('useEffect')
//     }, [])
//     return <>useEffect</>
// }
// const statecomponent = () => {
//     const state = useState()
//     return <>useState</>
// }
// const reducer = ({state, dispatch}) => {
//     console.log(state, dispatch)

//     return dispatch
// }
// const reducercomponent = () => {
//     const [state, dispatch] = useReducer(reducer, {test: false})
//     dispatch({test: true})
//     return <>useReducer</>
// }
// const memohookcomponent = () => {
//     const memo = useMemo()
//     return <>useMemo</>
// }
// const memocomponent = memo(() => {
//     return <>memo()</>
// })

const contextcomponent = () => {
    const ctx = useHookContext()

    return React.createElement("p", null, `useContext: ${JSON.stringify(ctx, null, 2)}`)
}

console.log(renderToString(React.createElement(Carousel, null)))