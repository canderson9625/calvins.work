// importing require tsconfig.json "compilerOptions": { "esModuleInterop": true }
import React, { useEffect } from "react";

import { Carousel } from "@components";
import { Projects } from "@components/carousel/constants";
import useScrollBackground from "@hooks/homepage/useScrollBackground";

export default function App() {
    useScrollBackground()

    return(<>
        <React.StrictMode>
            {/* overview */}
            {/* Circle graph of top 3 languages used, generated from the tags on the projects */}
            <Carousel>
                {
                    // a subset of featured projects
                }
                { Projects }
            </Carousel>

            {/* filter */}
                {/* { Projects } */}
            {/*  */}
        </React.StrictMode>
    </>)
};