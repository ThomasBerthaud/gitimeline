import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./scenes/home";
import Commit from "./scenes/commit";
import "./styles.css";
import "font-awesome/css/font-awesome.min.css";
import "highlightjs/styles/atom-one-dark.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/owner/:owner/repo/:repo/commit/:sha" component={Commit} />
      <Route path="/owner/:owner/repo/:repo" component={Commit} />
      <Route path="/" component={Home} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
