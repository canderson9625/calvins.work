import { useRef } from "react"

export default function useRenderCounter(name: string) {
   const renderCount = useRef(0)
   console.log(name, "total renders: ", ++renderCount.current)
}

export { useRenderCounter }
