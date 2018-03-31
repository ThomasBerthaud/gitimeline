import React, { Component } from "react";
import GithubColors from "github-colors";
import { Link } from "react-router-dom";

export default class History extends Component {
  gitHubColors = GithubColors.init(true);

  render() {
    const commits = this.props.commits.map(cm => {
      return (
        <li key={cm.sha}>
          <Link to={`/commit/${cm.sha}`}>{cm.message} ({cm.author})</Link>
        </li>
      );
    });
    return <ul>{commits}</ul>;
  }

  calcColor(name) {
    if (name) {
      let ext = name.split(".")[name.split(".").length - 1];
      if (this.gitHubColors[ext] && this.gitHubColors[ext].color) {
        return this.gitHubColors[ext].color;
      }
    }
    return "#ccc";
  }
}
