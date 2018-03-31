import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../../services/api";
import "./styles.css";

class NavBar extends Component {
  state = {
    repoUrl: "https://github.com/ThomasBerthaud/gitimeline", //TODO remove test line
    commits: []
  };
  onUrlChange = this.onUrlChange.bind(this);
  getRepo = this.getRepo.bind(this);
  selectCommit = this.selectCommit.bind(this);

  componentDidMount() {
    let owner = this.props.match.params.owner;
    let repo = this.props.match.params.repo;
    console.log(this.props, owner, repo);
    if (owner && repo) {
      this.setState({ repoUrl: `https://github.com/${owner}/${repo}` });
      console.log('get repo')
      this.getRepo();
    }
  }

  onUrlChange(event) {
    let repoUrl = event.target.value;
    this.setState({
      repoUrl
    });
  }

  getRepo() {
    console.log(this.state);
    Api.getRepository(this.state.repoUrl).then(commits => {
      this.setState({
        commits
      });
    });
  }

  selectCommit(event) {
    let infos = this.state.repoUrl.split("/");
    let owner = infos.slice(-2, -1);
    let repo = infos.slice(-1);
    const sha = event.currentTarget.value;
    if (sha) {
      this.props.history.push(`/owner/${owner}/repo/${repo}/commit/${sha}`);
    } else {
      this.props.history.push("/");
    }
  }

  displayCommitSelect() {
    if (this.state.commits.length) {
      return (
        <select name="commits" id="commits" onChange={this.selectCommit}>
          <option value="">Sélectionner un commit</option>
          {this.state.commits.map(cm => {
            return (
              <option value={cm.sha} key={cm.sha}>
                {cm.message}
              </option>
            );
          })}
        </select>
      );
    }
  }

  render() {
    return (
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
        {this.displayCommitSelect()}
        <button className="btn" onClick={this.getRepo}>
          Download Repository <i className="fa fa-download" />
        </button>
      </div>
    );
  }
}

export default withRouter(NavBar);
