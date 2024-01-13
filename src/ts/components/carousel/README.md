# Carousel Files

 - carousel.tsx - handles what is rendered and general carousel logic
 - track.tsx - handles the order of rendered children, lazy loading
 - controls.tsx
    - controls regarding carousel behavior like animations, pause
    - controls regarding position of items within the carousel
 - carousel.test.tsx - automated tests to ensure functionality doesn't 
get disrupted in updates

## Human Tests

### a11y
 - passes WAVE 
 - chrome devtools rendering
    - prefers color scheme
    - print
    - forced colors
    - prefers contrast more
    - prefers contrast less & custom
    - prefers reduced motion (not no motion)
    - prefers reduced transparency

<!-- ### TODO performance -->
