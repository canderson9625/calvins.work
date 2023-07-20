// Only works with tsconfig.json "compilerOptions": { "esModuleInterop": true }
import React, { useState, useCallback } from "react";
// console.log(React);
import * as ReactDOM from "react-dom";

// import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

// const root = createRoot(
//     document.getElementById('root') as HTMLElement,
// );

// root.render(<h1>Hello, world</h1>);

// const HelloWorld = () => <h1>Hello world</h1>;

// console.log('test');


// Only works with tsconfig.json "compilerOptions": { "esModuleInterop": true }
// import React, { useState, useCallback } from "react";

// // import * as React from "react";

const App = (props: { message: string }) => {
    const [count, setCount] = useState(0);
    const increment = useCallback(() => {
        setCount(count => count + 1);
    }, [count]);
    return(<>
        <h1>{props.message}</h1>
        <h2>Count: {count}</h2>
        <button onClick={increment}>Increment</button>
    </>)
};

export const render = () => ReactDOM.render(
    <App message="export" />
    ,
    document.getElementById("root")
);


// console.log(App);

// export default App;

// import { createRoot } from 'react-dom/client';

// function NavigationBar() {
//   // TODO: Actually implement a navigation bar
//   return <h1>Hello from React!</h1>;
// }

// const domNode = document.getElementById('navigation');
// const root = createRoot(domNode);
// root.render(<NavigationBar />);