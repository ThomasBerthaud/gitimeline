import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import config from './config.json';
import History from './history';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { repoUrl: 'https://github.com/ThomasBerthaud/gitimeline' };

        this.getRepo = this.getRepo.bind(this);
        this.onUrlChange = this.onUrlChange.bind(this);
    }

    onUrlChange(event) {
        this.setState({
            repoUrl: event.target.value
        });
    }

    render() {
        const isRepoDl = this.state.commits;
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
                    {isRepoDl && <History commits={this.state.commits} />}
                </div>
            </div>
        );
    }

    getRepo() {
        if (!this.state.repoUrl) return;

        let infos = this.state.repoUrl.split('/');
        let owner = infos.slice(-2, -1);
        let repo = infos.slice(-1);
        let commitsUrl = `${config.apiUrl}/repos/${owner}/${repo}/commits`;

        axios.get(commitsUrl).then(res => {
            console.log(res);
            this.setState({
                commits: res.data
            });
        }).catch(err => {
            console.log(err);
        })
    }
}

export default App;