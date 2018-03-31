import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./scenes/home/index";
import Commit from "./scenes/commit/index";
import "./styles.css";
import "font-awesome/css/font-awesome.min.css";
import "highlightjs/styles/atom-one-dark.css";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/commit/:id" component={Commit} />
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);
