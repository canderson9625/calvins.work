import { useEffect } from "react";

export default function useScrollBackground() {
    
    useEffect(() => {
        if (window) {
            const htmlHeight = document.querySelector('html')?.offsetHeight;
            const imgref = document.querySelector('.shapes img')
            const handleScroll = () => {
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
            }
            handleScroll()
            window.addEventListener('scroll', handleScroll)
        }
    }, [])

    return
}