import axios from "axios";
import config from "./config.json";

export default class Api {
  static getRepository(repoUrl) {
    let infos = repoUrl.split("/");
    let owner = infos.slice(-2, -1);
    let repo = infos.slice(-1);
    let commitsUrl = `${config.apiUrl}/repos/${owner}/${repo}/commits`;

    return axios.get(commitsUrl).then((request) => request.data);
  }

  static getCommit(owner, repo, sha) {
    let url = `${config.apiUrl}/repos/${owner}/${repo}/commits/${sha}/files`;

    return axios.get(url).then((request) => request.data);
  }
}
