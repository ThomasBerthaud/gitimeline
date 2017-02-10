var apiUrl = 'http://localhost:3000/api';
var app = new Vue({
    el: "#content",
    data: {
        waitTime: 1,
        timeoutId: null,
        pending: false,
        repoUrl: '',
        repoNotExist: false,
        repoInfos: null,
        commitSelected: null,
        commits: [],
        files: {},
        currentFiles: []
    },
    computed: {
        reversedCommitsSha: function () {
            return this.commits.map(function (com) {
                return com.sha;
            }).reverse();
        }
    },
    watch: {
        commitSelected: function (sha) {
            if (!sha || !this.repoInfos) return;

            if (this.files[sha]) {
                displayFiles.call(this);
                return;
            }
            console.log('retrieving files', sha);
            this.pending = true;

            this.$http.get(apiUrl + '/repos/' + this.repoInfos.owner + '/' + this.repoInfos.repo + '/commits/' + sha + '/files').then(result => {
                this.files[sha] = result.body;
                displayFiles.call(this);
            }).catch(function (err) {
                console.log(err);
                this.pending = false;
            });
            function displayFiles() {
                this.currentFiles = this.files[sha];

                this.$nextTick(function () {
                    var blocks = document.querySelectorAll('pre code');
                    blocks.forEach(hljs.highlightBlock);
                    this.pending = false;
                })
            }
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
        },
        timeline: function () {
            var self = this, index = 1;
            this.commitSelected = this.reversedCommitsSha[0];
            advance();

            function advance() {
                if (self.timeoutId) clearTimeout(self.timeoutId);
                self.timeoutId = setTimeout(function () {
                    //if HTTP request is not done, wait
                    if (self.pending) {
                        advance();
                    } else {
                        self.commitSelected = self.reversedCommitsSha[index];
                        index++;
                        if (index < self.reversedCommitsSha.length) advance();
                    }
                }, self.waitTime * 1000);
            }
        },
        stopTimeline: function () {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}) 