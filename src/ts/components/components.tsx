// Consolidate Components into one exports file

import React, {
    MouseEvent,
    TouchEvent
} from 'react';

// custom event type for the components to use
type Evt = {clientX: number, closest: Element} & MouseEvent<any> & TouchEvent<any>;
import Carousel from "./carousel/carousel";
import Project from "./project/project";

const Projects = [
    <Project 
        key={ 'proj-seed' }
        img={ <img src="assets/media/seed.png.webp" alt="The Seed Website's landing page for its blog." /> } 
        title="Seed" 
        subtitle="Wordpress" 
        btn_href="https://seed.com/cultured">
        <p>I helped with the responsiveness of the landing page and I built the new blog post template utilizing custom Gutenberg Blocks for a hassle-free backend content management experience.</p>
    </Project>,

    <Project 
        key={ 'proj-brmc' }
        img={ <img src="assets/media/brmc.png.webp" alt="The BRMC Website's home page" /> } 
        title="BRMC" 
        subtitle="Wordpress" 
        btn_href="https://blueridgemountainclub.com">
        <p>I built this website with the collaboration of two other developers. I integrated Hubspot, a 3rd party CRM, into the theme for this code so that we could build custom forms to capture leads but continue to utilize Hubspot's workflows for automating the life of the lead.</p>
    </Project>,

    <Project 
        key={ 'proj-organic_olivia' }
        img={ <img src="assets/media/organicolivia.png.webp" alt="The Shopify Store for Organic Olivia, a modern approach to traditional herbal medicine." /> } 
        title="Organic Olivia" 
        subtitle="Shopify" 
        btn_href="https://organicolivia.com">
        <p>I integrated Loyalty Lion, a Shopify Plus loyalty program into this shopify theme as well as wordpress to handle the blog. This website takes full advantage of Shopify Plus to further enhance and customize the User Experience.</p>
    </Project>,

    <Project 
        key={ 'proj-insignis_partners' }
        img={ <img src="assets/media/insignispartners.png.webp" alt="The insignis partners website. An Investment and Real Estate Development firm." /> } 
        title="Insignis Partners" 
        subtitle="Wordpress" 
        btn_href="https://insignispartners.com">
        <p>I enjoyed creating the animations and interactivity on the portfolio page. We used advanced custom fields to give the client the ability to update their staff.</p>
    </Project>,

    <Project 
    key={ 'proj-davis_floyd' }
        img={ <img src="assets/media/davisfloyd.png.webp" alt="Davis Floyd Civil Construction." /> } 
        title="Davis Floyd" 
        subtitle="Wordpress" 
        btn_href="https://www.davisfloyd.com">
        <p>I created the carousel animation on the Markets page and worked on the timeline on the about.</p>
    </Project>,

    <Project 
    key={ 'proj-kroeger_marine' }
        img={ <img src="assets/media/kroegermarine.png.webp" alt="Kroeger Marine Docks." /> } 
        title="Kroeger Marine" 
        subtitle="Wordpress" 
        btn_href="https://www.kroegermarine.com">
        <p>I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.</p>
    </Project>,

    <Project 
        key={ 'proj-vive_psych' }
        img={ <img src="assets/media/vivepsych.png.webp" alt="Vive Psyche located in Greenville, SC." /> } 
        title="Vive Psych" 
        subtitle="Wordpress" 
        btn_href="https://vivepsych.com">
        <p>I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.</p>
    </Project>,

    <Project 
        key={ 'proj-core_transformers' }
        img={ <img src="assets/media/coretransformers.png.webp" alt="The Core Transformers Wordpress site." /> } 
        title="Core Transformers" 
        subtitle="Wordpress & BigCommerce" 
        btn_href="https://coretransformers.com">
        <p>I was the sole developer for this project. I also gave their bigcommerce store a css update to match the wordpress site's brand.</p>
    </Project>,
    
    <Project 
        key={ 'proj-parkside_obgyn' }
        img={ <img src="assets/media/parksideob-gyn.png.webp" alt="Parkside OB-GYN. Modern Women, Modern Care." /> } 
        title="Parkside OB-GYN" 
        subtitle="Wordpress" 
        btn_href="https://parksideob-gyn.com">
        <p>I worked on the PHP page templates and css mobile, tablet, and desktop breakpoints for the whole site.</p>
    </Project>,
]

export { 
    Carousel,
    Projects,
    Evt
};