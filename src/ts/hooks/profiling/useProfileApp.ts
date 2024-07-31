import useRenderCounter from "./useRenderCounter"
import useTraceUpdate from "./useTraceUpdate"

export const useProfileApp = (string: string, obj: Record<string, unknown>) => {
   // useTraceUpdate returns object of props that changed with array of [prev, curr]
   useTraceUpdate(obj)
   // logs number of renders to the console
   useRenderCounter(string)

   return
}

export default useProfileApp
