import React, { Component } from "react";
import Api from '../../services/api/index';

export default class Commit extends Component {

  componentDidMount() {
    Api.getCommit();
  }

  render() {
    return <div>{this.props.match.params.id}</div>;
  }
}
