var apiUrl = 'http://localhost:3000/api';
var app = new Vue({
    el: "#content",
    data: {
        repoUrl: '',
        repoNotExist: false,
        commits: []
    },
    methods: {
        getHistory: function () {
            if (!this.repoUrl) {
                console.log('need to give a repo url');
                return;
            }

            var infos = this.repoUrl.split('/');
            var owner = infos.slice(-2, -1);
            var repo = infos.slice(-1);

            this.repoInfos = {owner, repo};

            this.$http.get(apiUrl + '/repos/' + owner + '/' + repo + '/commits/history').then(result => {
                this.commits = result.body;
                this.repoNotExist = false;
            }).catch(function(err){
                console.log(err);
                this.repoNotExist = true;
            });
        },
        getCommitFiles: function(sha){
             if (!this.repoInfos) {
                console.log('need to give a repo url');
                return;
            }

            this.$http.get(apiUrl + '/repos/' + this.repoInfos.owner + '/' + this.repoInfos.repo + '/commits/' + sha + '/files').then(result => {
                console.log(result.body);
            }).catch(function(err){
                console.log(err);
            });
        }
    }
}) 