var app = new Vue({
    el: "#content",
    data: {
        repo: '',
        commits: []
    },
    methods: {
        getCommits: function () {
            if (!this.repo) return;
            this.$http.get('https://api.github.com/repos/' + this.repo + '/commits').then(result => {
                if (result.status != 200) {
                    console.log('get error : ', result.statusText);
                    return;
                }
                this.commits = result.body;
            });
        }
    }
}) 