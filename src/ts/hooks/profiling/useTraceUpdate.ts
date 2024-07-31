import { useEffect, useRef } from "react"

export default function useTraceUpdate(props: Record<string, unknown>) {
   const prev = useRef(props)
   useEffect(() => {
      const changedProps = Object.entries(props).reduce(
         (prevState: { [key: string]: unknown }, [k, v]) => {
            if (prev.current[k] !== v) {
               prevState[k] = [prev.current[k], v]
            }
            return prevState
         },
         {},
      )
      if (Object.keys(changedProps).length > 0) {
         console.log("Changed props:", changedProps)
      }
      prev.current = props
   })
}
