<h1 style="text-align: center">Overview</h1>

<ul>
 <li>Setup</li>
 <li>Scripts</li>
 <li style="list-style: none; color: #cf8aba">// TODO: API</li>
 <li>Tests</li>
</ul>

## Setup
```
yarn install && \

// devserver is not minifed 
// to preserve errors 
yarn (devserver|server) && \
yarn (dev|start)
```

## Scripts
I use a enum like approach to the arguments that can be passed to the server process. The `const BUILD = {}` is used to iterate over the `argv` from `"node:process";`

Utility scripts are available as cli arguments

*prepend with: node (server|devserver)*
 - `sharp` is available as `--sharp`
 - `build` is available as `--compile`
   - `build` runs both `css` & `js`
 - `dev` is available as `--dev`
 - `--ssr` is available for enabling server side rendering

## TODO: API
The routes would allow for starting the processes defined in the `BUILD` object

## Tests
Acceptance Criteria:
 - Accessibility 
 - Responsiveness 
 - Performance

### Carousel
 - Accessibility - user should be able to skip past the carousel easily
 - Responsiveness
 - Performance - if animations are enabled it will be challenging to test on various devices
