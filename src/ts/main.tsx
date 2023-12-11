// importing require tsconfig.json "compilerOptions": { "esModuleInterop": true }
import React, { 
    useState,
    useCallback
} from "react";

import { 
    Carousel, 
    Projects
} from "./components/components";

export default function App() {

    return(<>
        <Carousel>
            { Projects }
        </Carousel>
    </>)
};