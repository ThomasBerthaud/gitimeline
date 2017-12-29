import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import config from './config.json';
import History from './history';
import Commit from './commit';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { repoUrl: 'https://github.com/ThomasBerthaud/gitimeline' };

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
                        Download Repository <i className="fa fa-download"></i>
                    </button>
                </div>
                <div id="content">
                    {this.getContent()}
                </div>
            </div>
        );
    }

    getContent() {
        const isRepoDl = this.state.commits;
        const isSelectedRepo = this.state.selectedCommit;
        if(isSelectedRepo) {
            return <Commit infos={this.state.selectedCommit} />
        }else if(isRepoDl) {
            return <History commits={this.state.commits} onSelectedCommit={this.selectCommit}/>
        }

        return false;
    }

    getRepo() {
        if (!this.state.repoUrl) return;

        let infos = this.state.repoUrl.split('/');
        let owner = infos.slice(-2, -1);
        let repo = infos.slice(-1);
        let commitsUrl = `${config.apiUrl}/repos/${owner}/${repo}/commits`;

        axios.get(commitsUrl).then(res => {
            this.setState({
                commits: res.data
            });
        }).catch(err => {
            console.error(err);
        });
    }
}

export default App;