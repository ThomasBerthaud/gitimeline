import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default class App extends Component {
  state = { repoUrl: "", url: "/" };
  onUrlChange = this.onUrlChange.bind(this);

  onUrlChange(event) {
    let repoUrl = event.target.value;
    let { owner, repo } = parseUrl(repoUrl);
    this.setState({ repoUrl, url: `/owner/${owner}/repo/${repo}` });
  }

  render() {
    return (
      <div className="dl-block">
        <input
          type="text"
          name="repoUrl"
          value={this.state.repoUrl}
          onChange={this.onUrlChange}
          placeholder="Github repository"
        />
        <Link className="btn" to={this.state.url}>
          <i className="fa fa-download" />
        </Link>
      </div>
    );
  }
}

function parseUrl(url) {
  let infos = url.split("/");
  let owner = infos.slice(-2, -1);
  let repo = infos.slice(-1);

  return { owner, repo };
}
