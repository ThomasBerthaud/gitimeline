import React, {Component} from 'react';
import GithubColors from 'github-colors';

class History extends Component {
    constructor(props) {
        super(props);
        this.gitHubColors = GithubColors.init(true);
    }

    render() {
        console.log(this.props.commits);
        const commits = this.props.commits.map(cm => {
            return <li key={cm.sha}>{cm.message} ({cm.author})</li>
        });
        return (
            <ul>{commits}</ul>
        )
    }

    calcColor(name) {
        if (name) {
            let ext = name.split('.')[name.split('.').length - 1];
            if (this.gitHubColors[ext] && this.gitHubColors[ext].color) {
                return this.gitHubColors[ext].color;
            }
        }
        return "#ccc";
    }
}

export default History;