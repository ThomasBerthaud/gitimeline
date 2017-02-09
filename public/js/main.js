var apiUrl = 'http://localhost:3000/api';
var app = new Vue({
    el: "#content",
    data: {
        repoUrl: '',
        repoNotExist: false,
        repoInfos: null,
        commitSelected: null,
        commits: [],
        files: []
    },
    watch: {
        commitSelected: function (sha) {
            if (!sha || !this.repoInfos) return;

            this.$http.get(apiUrl + '/repos/' + this.repoInfos.owner + '/' + this.repoInfos.repo + '/commits/' + sha + '/files').then(result => {
                this.files = result.body;

                this.$nextTick(function () {
                    var blocks = document.querySelectorAll('pre code');
                    blocks.forEach(hljs.highlightBlock);
                })
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    methods: {
        trim: function (string) {
            var length = 20;
            return string.length > length ?
                string.substring(0, length - 3) + "..." :
                string;

        },
        getHistory: function () {
            if (!this.repoUrl) {
                console.log('need to give a repo url');
                return;
            }

            var infos = this.repoUrl.split('/');
            var owner = infos.slice(-2, -1);
            var repo = infos.slice(-1);

            this.repoInfos = { owner, repo };

            this.$http.get(apiUrl + '/repos/' + owner + '/' + repo + '/commits/history').then(result => {
                this.commits = result.body;
                this.repoNotExist = false;
            }).catch(function (err) {
                console.log(err);
                this.repoNotExist = true;
            });
        }
    }
}) 