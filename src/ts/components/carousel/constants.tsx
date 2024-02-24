// Consolidate constants into one file
import React, { FocusEventHandler, MouseEvent, TouchEvent, createContext } from 'react';
import { Project } from '@components';

// custom event type for the carousel to use
type Evt = {
   target?: {
      clientX: number, // for cursor x position
      closest: Element // for finding the closest parent
   } & Element;
} & MouseEvent<any> & TouchEvent<any> & MouseEvent & FocusEventHandler<any> & EventTarget & HTMLDivElement;

type carouselAction = {
   actionType: string | actionTypeStates,
   data?: Evt | any
};

type carouselState = {
   activeSlide: number;
   animationDuration?: number;
   autoplay?: boolean;
   carouselResetTimer: NodeJS.Timeout | null; // time until carousel resets to neutral state
   countOfSlides: number;
   dragDistance: number;
   deadZone: number;
   firstX: number; // the first client x value when user starts dragging
   playAnimations: boolean;
   negativeOffsetOrigin: number; // translate the track by slidesToClone
   slidesToClone: number;
   trackState: trackStateTitle; // the current state of the track
}

enum trackStateTitle {
   Initialize,
   Stopped, // neutral
   Playing, // auto scroll
   Moving, // mid transition
   Grabbed, // start listening to x movement from input
   Focused, // a11y keyboard focus
}

enum actionTypeStates {
   Focus,   // keyboard focus
   Hovered, // cursor state
   Grab,    // cursor state
   Release, // cursor state
   Move,    // cursor state
};

// a11y first
const CarouselDefaults: carouselState = {
   activeSlide: 0,
   animationDuration: 300,
   carouselResetTimer: null,
   countOfSlides: 0,
   deadZone: 20,
   dragDistance: 0,
   firstX: 0,
   negativeOffsetOrigin: 0,
   playAnimations: false,
   slidesToClone: 4,
   trackState: trackStateTitle['Initialize'],
}

const CarouselContext = createContext(
   {
      state: CarouselDefaults,
      dispatch: (() => { }) as React.Dispatch<carouselAction>
   }
);

// TODO: replace with graphql
const Projects = [
   <Project
      key={'proj-seed'}
      srcSlug='seed'
      alt="The Seed Website's landing page for its blog."
      title="Seed"
      subtitle="Wordpress"
      btn_href="https://seed.com/cultured">
      <p>I helped with the responsiveness of the landing page and I built the new blog post template utilizing custom Gutenberg Blocks for a hassle-free backend content management experience.</p>
   </Project>,

   <Project
      key={'proj-brmc'}
      srcSlug='brmc'
      alt="The BRMC Website's home page."
      title="BRMC"
      subtitle="Wordpress"
      btn_href="https://blueridgemountainclub.com">
      <p>I built this website with the collaboration of two other developers. I integrated Hubspot, a 3rd party CRM, into the theme for this code so that we could build custom forms to capture leads but continue to utilize Hubspot's workflows for automating the life of the lead.</p>
   </Project>,

   <Project
      key={'proj-organic_olivia'}
      srcSlug='organicolivia'
      alt="The Shopify Store for Organic Olivia, a modern approach to traditional herbal medicine."
      title="Organic Olivia"
      subtitle="Shopify"
      btn_href="https://organicolivia.com">
      <p>I integrated Loyalty Lion, a Shopify Plus loyalty program into this shopify theme as well as wordpress to handle the blog. This website takes full advantage of Shopify Plus to further enhance and customize the User Experience.</p>
   </Project>,

   <Project
      key={'proj-insignis_partners'}
      srcSlug='insignispartners'
      alt="The insignis partners website. An Investment and Real Estate Development firm."
      title="Insignis Partners"
      subtitle="Wordpress"
      btn_href="https://insignispartners.com">
      <p>I enjoyed creating the animations and interactivity on the portfolio page. We used advanced custom fields to give the client the ability to update their staff.</p>
   </Project>,

   <Project
      key={'proj-davis_floyd'}
      srcSlug='davisfloyd'
      alt="Davis Floyd Civil Construction."
      title="Davis Floyd"
      subtitle="Wordpress"
      btn_href="https://www.davisfloyd.com">
      <p>I created the carousel animation on the Markets page and worked on the timeline on the about.</p>
   </Project>,

   <Project
      key={'proj-kroeger_marine'}
      srcSlug='kroegermarine'
      alt="Kroeger Marine Docks."
      title="Kroeger Marine"
      subtitle="Wordpress"
      btn_href="https://www.kroegermarine.com">
      <p>I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.</p>
   </Project>,

   <Project
      key={'proj-vive_psych'}
      srcSlug='vivepsych'
      alt="Vive Psyche located in Greenville, SC."
      title="Vive Psych"
      subtitle="Wordpress"
      btn_href="https://vivepsych.com">
      <p>I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.</p>
   </Project>,

   <Project
      key={'proj-core_transformers'}
      srcSlug='coretransformers'
      alt='The Core Transformers Wordpress site.'
      title="Core Transformers"
      subtitle="Wordpress & BigCommerce"
      btn_href="https://coretransformers.com">
      <p>I was the sole developer for this project. I also gave their bigcommerce store a css update to match the wordpress site's brand.</p>
   </Project>,

   <Project
      key={'proj-parkside_obgyn'}
      srcSlug={'parksideob-gyn'}
      alt={'Parkside OB-GYN. Modern Women, Modern Care.'}
      title="Parkside OB-GYN"
      subtitle="Wordpress"
      btn_href="https://parksideob-gyn.com">
      <p>I worked on the PHP page templates and css mobile, tablet, and desktop breakpoints for the whole site.</p>
   </Project>,
];

export {
   actionTypeStates,
   carouselAction,
   CarouselContext,
   CarouselDefaults,
   carouselState,
   Evt,
   Projects,
   trackStateTitle
};