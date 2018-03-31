import React, { Component } from "react";
import History from "./components/history";
import Api from "../../services/api/index";
import "./styles.css";

export default class App extends Component {
  state = {
    repoUrl: "https://github.com/ThomasBerthaud/gitimeline", //TODO remove test line
    commits: []
  }; 
  getRepo = this.getRepo.bind(this);
  onUrlChange = this.onUrlChange.bind(this);

  onUrlChange(event) {
    this.setState({
      repoUrl: event.target.value
    });
  }

  getRepo() {
    Api.getRepository(this.state.repoUrl).then(res => {
      this.setState({
        commits: res.data
      });
    });
  }

  render() {
    return (
      <div>
        <div id="nav">
          <input
            id="repo-input"
            className="input-round"
            type="text"
            name="repoUrl"
            value={this.state.repoUrl}
            onChange={this.onUrlChange}
            placeholder="Github repository"
          />
          <button className="btn" onClick={this.getRepo}>
            Download Repository <i className="fa fa-download" />
          </button>
        </div>
        <div id="content">
          <History commits={this.state.commits}></History>
        </div> 
      </div>
    );
  }
}
