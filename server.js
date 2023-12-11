import{argv as H}from"node:process";import W from"express";import*as n from"path";import{execSync as X}from"child_process";import{fileURLToPath as z}from"url";import V from"livereload";import K from"connect-livereload";import M from"fs";import Y from"sharp";import q from"react";import J from"react-dom/server";import T from"react";import t from"react";import i,{useEffect as B,useRef as F,useState as y}from"react";function k(s){let{children:o}=s;if(o=o??"",o==="")return"Pass children to render carousel";let[r,a]=y(0),[g,h]=y(!0),[m,E]=y(null),b=F(null),[I,N]=y(0),$=[...o].length,w=r===3?"grabbing":"grab";w=r===2?"not-allowed":w;function L(e){f!==null&&clearTimeout(f)}function D(e){r!==2&&a(3)}function _(e){if(b.current!==null&&r===3){if(I===0)return N(e.nativeEvent.clientX);let d=(A=>A.clientX-I)(e.nativeEvent);if(d<16&&-16<d)return;b.current.style.translate=`${d}px`}}function S(e){a(2);let p=e.target,d=p.closest(".item");if(p.closest(".carousel")===null&&E(null),d!==null&&(N(0),E(parseInt(d.dataset.index,10))),!g){a(0);return}setTimeout(()=>{b.current.style.translate="0px",a(0)},300)}let f=null;function G(e){f!==null&&clearTimeout(f),f=setTimeout(()=>{a(0),E(null)},3e3)}function Z(e){}return B(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)").matches!==!0;return()=>{h(e)}},[h]),i.createElement(i.Fragment,null,i.createElement("div",{className:"carousel",style:{cursor:w},onMouseUp:e=>S(e),onTouchEnd:e=>S(e),onTouchStart:e=>S(e),onMouseMove:e=>_(e),onTouchMove:e=>_(e),onMouseLeave:e=>G(e),onMouseEnter:e=>L(e)},i.createElement("div",{className:"carousel-controls"},i.createElement("button",{className:"toggle",onClick:()=>h(e=>!e)},"Toggle Animations ",g===!0?"Off":"On")),i.createElement("div",{className:"track",onMouseDown:e=>D(e),ref:b},[...o].map((e,p)=>i.createElement("div",{className:"item"+(p===m?" active":""),key:p+"item","data-index":p},e)),[...o].map((e,p)=>i.createElement("div",{className:"item item_clone",key:p+"itemClone","data-index":p},e))),i.createElement("div",{className:"track-controls"},i.createElement("div",{className:"prev",onClick:()=>void 0}),i.createElement("div",{className:"next",onClick:()=>void 0}),i.createElement("div",{className:"pause",onClick:()=>a(0)}))))}import u,{useState as U}from"react";function l(s){let[o,r]=U(0),a=o===0?"":"expanded";a+=" project";function g(m){r(1)}function h(m){r(0)}return u.createElement(u.Fragment,null,u.createElement("article",{className:a,onClick:m=>g(m),onMouseLeave:m=>h(m),"aria-expanded":o===1},s.img,u.createElement("div",{className:"content"},u.createElement("h3",null,s.title," ",u.createElement("span",null,s.subtitle)),s.children,u.createElement("a",{className:"btn",href:s.btn_href,target:"_blank"},"Visit ",s.title))))}var x=[t.createElement(l,{key:"proj-seed",img:t.createElement("img",{src:"assets/media/seed.png.webp",alt:"The Seed Website's landing page for its blog."}),title:"Seed",subtitle:"Wordpress",btn_href:"https://seed.com/cultured"},t.createElement("p",null,"I helped with the responsiveness of the landing page and I built the new blog post template utilizing custom Gutenberg Blocks for a hassle-free backend content management experience.")),t.createElement(l,{key:"proj-brmc",img:t.createElement("img",{src:"assets/media/brmc.png.webp",alt:"The BRMC Website's home page"}),title:"BRMC",subtitle:"Wordpress",btn_href:"https://blueridgemountainclub.com"},t.createElement("p",null,"I built this website with the collaboration of two other developers. I integrated Hubspot, a 3rd party CRM, into the theme for this code so that we could build custom forms to capture leads but continue to utilize Hubspot's workflows for automating the life of the lead.")),t.createElement(l,{key:"proj-organic_olivia",img:t.createElement("img",{src:"assets/media/organicolivia.png.webp",alt:"The Shopify Store for Organic Olivia, a modern approach to traditional herbal medicine."}),title:"Organic Olivia",subtitle:"Shopify",btn_href:"https://organicolivia.com"},t.createElement("p",null,"I integrated Loyalty Lion, a Shopify Plus loyalty program into this shopify theme as well as wordpress to handle the blog. This website takes full advantage of Shopify Plus to further enhance and customize the User Experience.")),t.createElement(l,{key:"proj-insignis_partners",img:t.createElement("img",{src:"assets/media/insignispartners.png.webp",alt:"The insignis partners website. An Investment and Real Estate Development firm."}),title:"Insignis Partners",subtitle:"Wordpress",btn_href:"https://insignispartners.com"},t.createElement("p",null,"I enjoyed creating the animations and interactivity on the portfolio page. We used advanced custom fields to give the client the ability to update their staff.")),t.createElement(l,{key:"proj-davis_floyd",img:t.createElement("img",{src:"assets/media/davisfloyd.png.webp",alt:"Davis Floyd Civil Construction."}),title:"Davis Floyd",subtitle:"Wordpress",btn_href:"https://www.davisfloyd.com"},t.createElement("p",null,"I created the carousel animation on the Markets page and worked on the timeline on the about.")),t.createElement(l,{key:"proj-kroeger_marine",img:t.createElement("img",{src:"assets/media/kroegermarine.png.webp",alt:"Kroeger Marine Docks."}),title:"Kroeger Marine",subtitle:"Wordpress",btn_href:"https://www.kroegermarine.com"},t.createElement("p",null,"I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.")),t.createElement(l,{key:"proj-vive_psych",img:t.createElement("img",{src:"assets/media/vivepsych.png.webp",alt:"Vive Psyche located in Greenville, SC."}),title:"Vive Psych",subtitle:"Wordpress",btn_href:"https://vivepsych.com"},t.createElement("p",null,"I created the filter for the recycle your docks program. I helped make the custom cursor responsive when it used to lag and repaint the cursor every 300ms. I used Stripo to build out email campaigns in Mailchimp.")),t.createElement(l,{key:"proj-core_transformers",img:t.createElement("img",{src:"assets/media/coretransformers.png.webp",alt:"The Core Transformers Wordpress site."}),title:"Core Transformers",subtitle:"Wordpress & BigCommerce",btn_href:"https://coretransformers.com"},t.createElement("p",null,"I was the sole developer for this project. I also gave their bigcommerce store a css update to match the wordpress site's brand.")),t.createElement(l,{key:"proj-parkside_obgyn",img:t.createElement("img",{src:"assets/media/parksideob-gyn.png.webp",alt:"Parkside OB-GYN. Modern Women, Modern Care."}),title:"Parkside OB-GYN",subtitle:"Wordpress",btn_href:"https://parksideob-gyn.com"},t.createElement("p",null,"I worked on the PHP page templates and css mobile, tablet, and desktop breakpoints for the whole site."))];function j(){return T.createElement(T.Fragment,null,T.createElement(k,null,x))}var v={sharp:!1,compile:!1,ssr:!1};H.forEach((s,o)=>{if(o<2)return;let r;for(r in v)s.includes(r)&&(v[r]=!0)});var P=W(),c=n.dirname(z(import.meta.url));function Q(){v.sharp&&(console.log("Converting images to webp"),M.readdir(n.resolve(c+"/src/media"),(s,o)=>{if(s)throw s;o.forEach(r=>{Y(n.resolve(c+"/src/media/"+r)).toFormat("webp").toFile(n.resolve(c+"/dist/assets/media/"+r+".webp"))})})),v.compile&&(console.log("Compiling assets with esbuild"),X("npm run build")),v.ssr&&(console.log("Rendering App to SSR-OUTLET"),M.readFile(n.join(c+"/src/index.html"),"utf-8",(s,o)=>{let r=J.renderToString(q.createElement(j,null)),a=o.replace(/<!-- SSR-OUTLET -->/,r);M.writeFileSync(n.join(c+"/dist/index.html"),a,"utf-8")}))}Q();var C=V.createServer();C.server.once("connection",()=>{setTimeout(()=>{console.log("reload requested"),C.refresh("/")},100)});C.watch([n.join(c+"/dist"),n.join(c+"/dist/index.html")]);P.use(K());P.use(W.static(n.resolve(c+"/dist")));var O=process.env.PORT||80;P.listen(O,()=>{console.log("started on port "+O)});process.on("SIGTERM",process.exit);process.on("SIGINT",process.exit);
