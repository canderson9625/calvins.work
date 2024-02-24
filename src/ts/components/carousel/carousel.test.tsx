// Tests initial state and rendering of the carousel with different prop combinations.
// Tests navigation (forward, backward, to specific item) functionality.
// Tests edge cases like overflowing items, reaching first/last item, etc.
import React from "react";
import dom, {
   act,
   cleanup,
   getNodeText,
   render,
   renderHook,
   fireEvent,
   screen,
   waitFor,
   waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import Carousel from "./carousel";
import { Projects } from "@components/carousel/constants";

// let testRender = render(<Carousel />);
// testRender.debug()
// console.log(fireEvent, screen);

const a11y = true;
// Mock window.matchMedia for prefers reduced motion
beforeAll(() => {
   if (!a11y) {
      // Jest provided workaround
      Object.defineProperty(window, "matchMedia", {
         writable: true,
         value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
         })),
      });
   } else {
      // Minimal a11y
      Object.defineProperty(window, "matchMedia", {
         value: vi.fn().mockImplementation((query) => ({
            matches: true,
         })),
      });
   }
});
afterEach(cleanup);

describe("Carousel initialization", async () => {
   // test('with less than 3 children', async () => {
   //     const { container } = render(<Carousel />);
   //     const textRegex = new RegExp("Pass more than 2 children to render carousel", "i");

   //     expect( getNodeText(container) ).toMatch(textRegex);
   // });

   test("with autoplay", async () => {
      const view = render(<Carousel autoplay>{Projects}</Carousel>);
      expect(
         await waitFor(
            () =>
               view.getByRole("region").attributes.getNamedItem("aria-label")
                  ?.nodeValue
         )
      ).toMatch("Projects Carousel with autoplay");
   });

   test.skipIf(a11y)("motion preferences undefined", () => {
      const view = render(<Carousel>{Projects}</Carousel>);
      expect(view.getByRole("heading", { level: 2 })).toBeDefined();
   });
   test.skipIf(!a11y)("User prefers reduced motion", async () => {
      const view = render(<Carousel>{Projects}</Carousel>);
      expect(view.queryByRole("heading", { level: 2 })).toBeNull();
   });
});

describe.todo("Carousel Interaction", () => {
   describe("carousel gains focus by keyboard", () => {
      test("state should update", () => { });

      test("skip navigation", () => { });
   });

   describe("carousel gains focus by mouse", () => {
      test("Click on carousel slide", () => {
         // carousel listens for any event to bubble up
         // if one does, it doesn't update the state to moving
      });
   });
});

describe.todo("Carousel Accessibility", () => {
   test("Shift should advance focus", () => { });
   test("Shift + TAB should focus on the previous element", () => { });
   test("Enter is reserved for hyperlinks", () => { });
   test("Space will allow interaction with carousel items", () => { });
   describe("Esc will notify for additional presses", () => {
      // user notified that esc and shift + esc commands are now available
      test("Esc will move focus past carousel", () => { });
      test("Shift + Esc will move focus before carousel", () => { });
   });
});
