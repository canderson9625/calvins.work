// importing require tsconfig.json "compilerOptions": { "esModuleInterop": true }
import React from "react";

import { Carousel } from "@components";
import { Projects } from "@components/carousel/constants";

export default function App() {

    return(<>
        <React.StrictMode>
            <Carousel>
                { Projects }
            </Carousel>
        </React.StrictMode>
    </>)
};