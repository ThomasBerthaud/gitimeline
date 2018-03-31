import axios from "axios";
import config from "./config.json";

export default class Api {
  static getRepository(repoUrl) {
    let infos = repoUrl.split("/");
    let owner = infos.slice(-2, -1);
    let repo = infos.slice(-1);
    let commitsUrl = `${config.apiUrl}/repos/${owner}/${repo}/commits`;

    return axios.get(commitsUrl);
  }

  static getCommit(sha) {
    let url = `${apiUrl}/repos/${this.repoInfos.owner}/${this.repoInfos.repo}/commits/${this.commitSelected}/files/${file.path}`;
  }
}
