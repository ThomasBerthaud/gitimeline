var apiUrl = 'http://localhost:3000/api';
var app = new Vue({
    el: "#content",
    data: {
        repoUrl: '',
        commits: []
    },
    methods: {
        getCommits: function () {
            if (!this.repoUrl) {
                console.log('need to give a repo url');
                return;
            }

            this.$http.get(apiUrl + '/commits/history?url=' + this.repoUrl).then(result => {
                this.commits = result.body;
            }).catch(console.log);
        }
    }
}) 