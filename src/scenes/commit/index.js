import React, { Component } from "react";
import Api from "../../services/api/index";
import NavBar from "./components/navbar";
import Graph from "./components/graph";
import "./styles.css";

export default class Commit extends Component {
  state = { commits: [], commit: null };
  displayCommit = this.displayCommit.bind(this);

  componentDidMount() {
    const { owner, repo, sha } = this.props.match.params;
    Api.getRepository(owner, repo).then(commits => this.setState({ commits }));
    if (sha) this.displayCommit(sha);
  }

  displayCommit(sha) {
    const { owner, repo } = this.props.match.params;
    Api.getCommit(owner, repo, sha).then(commit => {
      this.setState({ commit });
      this.props.history.push(`/owner/${owner}/repo/${repo}/commit/${sha}`);
    });
  }

  render() {
    return (
      <div>
        <NavBar
          commits={this.state.commits}
          onCommitChange={this.displayCommit}
        />
        <Graph commit={this.state.commit} />
      </div>
    );
  }
}
