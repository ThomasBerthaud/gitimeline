var apiUrl = 'http://localhost:3000/api';
var GitHubColors = null;

///COMPONENTS///////////////////////////////
Vue.component('files', {
    props: ['file'],
    template:
    '<div v-if="file.type === 3" class="file" :style="file.style" @click="display(file)">' +
    '      {{file.size}} ' +
    '  </div> ' +
    '  <div v-else class="folder" :style="file.style"> ' +
    '     {{file.name}}' +
    '      <div v-for="child in file.childs" :title="child.path">' +
    '          <files :file="child" @display="display"></files>' +
    '      </div>' +
    '  </div>',
    methods: {
        display: function (file) {
            this.$emit('display', file);
        }
    }
});
///////////////////////////////////////////

/////VUE/////////////////////////////////////////
var app = new Vue({
    el: "#content",
    data: {
        waitTime: 0.5,
        timeoutId: null,
        pending: false,
        repoUrl: '',
        repoNotExist: false,
        repoInfos: null,
        commitSelected: null,
        commits: [],
        currentFiles: [],
        selectedFile: null,
        minSize: 25,
        maxSize: 100,
        fileColor: "gitHub"
    },
    computed: {
        reversedCommitsSha: function () {
            return this.commits.map(function (com) {
                return com.sha;
            }).reverse();
        },
        currentFilesStyled: function () {
            let filesStyled = [];
            let max = _.max(this.currentFiles, getSize).size;
            let min = _.min(this.currentFiles, getSize).size;
            let distance = this.maxSize - this.minSize;

            if (max === min) max++; //avoir error when only one file

            function getSize(file) {
                return file.size;
            }

            function calcStyle(file) {
                if (file.type === 3) {
                    let len = this.minSize + (((this.maxSize - this.minSize) * (file.size - min)) / (max - min));
                    let perc = file.size > 1000 ? 0.45 : 0.6; //to avoid big numbers steping out of div

                    file.style = {
                        borderColor: this.fileColor,
                        width: len + 'px',
                        height: len + 'px',
                        lineHeight: len + 'px',
                        fontSize: (len * perc) + 'px'
                    };

                    if (file.style.borderColor === "gitHub") {
                        let ext = file.name.split('.')[file.name.split('.').length - 1];
                        if (GitHubColors[ext] && GitHubColors[ext].color) {
                            file.style.borderColor = GitHubColors[ext].color;
                        } else {
                            file.style.borderColor = '#ccc';
                        }
                    }
                }
                return file;
            }

            function findParent(folders, files, index) {
                var parent = files.find(function (file) {
                    return file.name === folders[index];
                });

                if (index === folders.length - 2) {
                    return parent;
                } else {
                    return findParent(folders, parent.childs, index + 1);
                }
            }

            this.currentFiles.forEach(function (file) {
                let folders = file.path.split('\\');
                if (folders.length <= 1) {
                    filesStyled.push(calcStyle.call(this, file));
                } else {
                    var parent = findParent(folders, filesStyled, 0);
                    if (!parent.childs) parent.childs = [];
                    parent.childs.push(calcStyle.call(this, file));
                }
            }, this);

            return filesStyled;
        }
    },
    watch: {
        commitSelected: function (sha) {
            if (!sha || !this.repoInfos) return;

            this.$http.get(apiUrl + '/repos/' + this.repoInfos.owner + '/' + this.repoInfos.repo + '/commits/' + sha + '/files').then(filesHTTP => {
                if (!GitHubColors) {
                    return this.$http.get(apiUrl + '/GitHubColors/ext').then(colorsHTTP => {
                        GitHubColors = colorsHTTP.body;
                        return setCurrentFiles.call(this, filesHTTP);
                    });
                } else {
                    return setCurrentFiles.call(this, filesHTTP);
                }
            }).catch(function (err) {
                console.error(err);
            });

            function setCurrentFiles(filesHTTP) {
                this.currentFiles = filesHTTP.body;

                if (this.selectedFile) {
                    let selected = findDeep(this.currentFiles, function (file) {
                        return file.path === this.selectedFile.path;
                    }, this);

                    if (selected) {
                        this.displayFile(selected);
                    } else {
                        //use a fake file to display 'no file' message
                        this.displayFile({
                            name: this.selectedFile.name,
                            path: this.selectedFile.path,
                            size: -1,
                            content: "Le fichier n'existe pas"
                        });
                    }
                }
            }
        }
    },
    methods: {
        trim: function (string) {
            var length = 10;
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

            this.pending = true;
            this.commitSelected = null;
            this.currentFiles = [];
            this.selectedFile = null;

            this.$http.get(apiUrl + '/repos/' + owner + '/' + repo + '/commits/history').then(commitsHTTP => {
                this.commits = commitsHTTP.body;
                this.repoNotExist = false;
                this.pending = false;
            }).catch(function (err) {
                console.error(err);
                this.repoNotExist = true;
                this.pending = false;
            });
        },
        displayFile: function (file) {
            if (!file) return;

            if (file.size === -1) {
                file.highlighted = {
                    value: file.content,
                    language: ""
                };
            } else {
                //try set language based on file extension
                try {
                    let ext = file.name.split('.')[file.name.split('.').length - 1];
                    file.highlighted = hljs.highlight(ext, file.content);
                } catch (e){
                    //if fail use auto highlight
                    file.highlighted = hljs.highlightAuto(file.content);
                }
            }
            this.selectedFile = file;
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
                        else self.stopTimeline();
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


//UTILITIES///////////////////////////////////////////
var findDeep = function (list, predicate, context) {
    for (let i = 0; i < list.length; i++) {
        if (predicate.call(context, list[i])) return list[i];
        else if (list[i].childs) return findDeep(list[i].childs, predicate, context);
    }

    return undefined;
}