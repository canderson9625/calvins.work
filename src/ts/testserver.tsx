import App from "@main";
import React from "react";

import { renderToString } from "react-dom/server";

console.log(renderToString(<App />))