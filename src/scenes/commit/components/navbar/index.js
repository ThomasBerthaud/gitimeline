import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.css";

class NavBar extends Component {
  selectCommit = this.selectCommit.bind(this);

  selectCommit(event) {
    const sha = event.currentTarget.value;
    this.props.onCommitChange(sha);
  }

  displayCommitSelect() {
    if (this.props.commits.length) {
      return (
        <select
          name="commits"
          id="commits"
          onChange={this.selectCommit}
          value={this.props.match.params.sha}
        >
          <option value="">Sélectionner un commit</option>
          {this.props.commits.map(cm => {
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
        Sélectionner un commit à afficher :
        {this.displayCommitSelect()}
      </div>
    );
  }
}

export default withRouter(NavBar);
