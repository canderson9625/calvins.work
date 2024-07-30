// importing require tsconfig.json "compilerOptions": { "esModuleInterop": true }
import React, { useEffect } from "react";

import { Carousel } from "@components";
import { Projects } from "@components/carousel/constants";

export default function App() {

    useEffect(() => {

        if (window) {
            const htmlHeight = document.querySelector('html')?.offsetHeight;
            const imgref = document.querySelector('.shapes img')
            window.addEventListener('scroll', () => {
                // subtract the viewport height from the total height of the document
                const normalTotalHeight = ((htmlHeight ?? 0) - window.innerHeight)

                // const scrolledInverse = (normalTotalHeight - window.scrollY) / normalTotalHeight;
                // const scrolledGoldenExponential = ((window.scrollY / normalTotalHeight) ** 0.314159);
                // const scrolledSilverExponential = ((window.scrollY / normalTotalHeight) ** -0.241412);

                // now our scrollY at the bottom of the page is equal to the normalTotalHeight
                const scrolledNormal = (window.scrollY / normalTotalHeight);
                
                (imgref as HTMLImageElement).style.transform = `translateY(-${scrolledNormal * 10 + 1}%)`
                // (imgref as HTMLImageElement).style.transform = `translateY(-${scrolledInverse * 10 + 1}%)`
                // (imgref as HTMLImageElement).style.transform = `translateY(-${scrolledGoldenExponential * 10 + 1}%)`
                // (imgref as HTMLImageElement).style.transform = `translateY(-${scrolledSilverExponential * 10 + 1}%)`
            })
        }
    }, [])

    return(<>
        <React.StrictMode>
            {/* overview */}
            {/* Circle graph of top 3 languages used, generated from the tags on the projects */}
            {/* <Carousel>
                {
                    // a subset of featured projects
                }
                { Projects }
            </Carousel> */}

            {/* filter */}
                { Projects }
            {/*  */}
        </React.StrictMode>
    </>)
};