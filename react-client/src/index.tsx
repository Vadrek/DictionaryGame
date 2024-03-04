import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Button } from "antd";

ReactDOM.render(
  <React.StrictMode>
    <div>
      <Button href="/">Home</Button>
      <Button href="/canvas">Canvas</Button>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
