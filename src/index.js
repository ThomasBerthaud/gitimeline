import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./scenes/home";
import Commit from "./scenes/commit";
import "./styles.css";
import "font-awesome/css/font-awesome.min.css";
import "highlightjs/styles/atom-one-dark.css";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route path="/owner/:owner/repo/:repo/commit/:sha" component={Commit} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);
