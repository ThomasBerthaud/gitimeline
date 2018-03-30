import React, { Component } from "react";
import "./styles.css";
import Api from "../../services/api/index";
import History from "./components/history";

class Commit extends Component {
  render() {
    return <div>{this.props.infos.sha}</div>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { repoUrl: "https://github.com/ThomasBerthaud/gitimeline" };

    this.getRepo = this.getRepo.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.selectCommit = this.selectCommit.bind(this);
  }

  onUrlChange(event) {
    this.setState({
      repoUrl: event.target.value
    });
  }

  selectCommit(commit) {
    this.setState({
      selectedCommit: commit
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
        <div id="content">{this.getContent()}</div>
      </div>
    );
  }

  getContent() {
    const isRepoDl = this.state.commits;
    const isSelectedRepo = this.state.selectedCommit;
    if (isSelectedRepo) {
      return <Commit infos={this.state.selectedCommit} />;
    } else if (isRepoDl) {
      return (
        <History
          commits={this.state.commits}
          onSelectedCommit={this.selectCommit}
        />
      );
    }

    return false;
  }

  getRepo() {
    Api.getRepository(this.state.repoUrl)
      .then(res => {
        this.setState({
          commits: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export default App;
