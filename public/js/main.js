var apiUrl = 'http://localhost:3000/api';
var GitHubColorsP = null;

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
    created: function(){
        GitHubColorsP = this.$http.get(apiUrl + '/GitHubColors/ext');
        GitHubColorsP.catch(console.error);
    },
    computed: {
        svgWidth: function () {
            return window.innerWidth;
        },
        svgHeight: function () {
            return window.innerHeight - document.getElementById('nav').height;
        },
        reversedCommitsSha: function () {
            return this.commits.map(function (com) {
                return com.sha;
            }).reverse();
        },
        currentFilesStyled: function () {
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

                    GitHubColorsP.then(gitHubColors => {
                        if (file.style.borderColor === "gitHub") {
                            let ext = file.name.split('.')[file.name.split('.').length - 1];
                            if (gitHubColors[ext] && gitHubColors[ext].color) {
                                file.style.borderColor = gitHubColors[ext].color;
                            } else {
                                file.style.borderColor = '#ccc';
                            }
                        }
                    })
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

            let filesStyled = [];
            let max = Math.max(_.pluck(this.currentFiles), getSize);
            let min = Math.min(_.pluck(this.currentFiles), getSize);
            let distance = this.maxSize - this.minSize;
            if (max === min) max++; //avoid error when only one file
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
            var displayGraph = url => {
                var svg = d3.select("svg"),
                    margin = 20,
                    diameter = +svg.attr("width"),
                    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
            
                var color = d3.scaleLinear()
                    .domain([-1, 5])
                    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                    .interpolate(d3.interpolateHcl);
            
                var pack = d3.pack()
                    .size([diameter - margin, diameter - margin])
                    .padding(2);
            
                d3.json(url, function (error, root) {
                    if (error) throw error;
                    console.log(root);
            
                    root = d3.hierarchy(root)
                        .sum(function (d) { return d.size; })
                        .sort(function (a, b) { return b.value - a.value; });
            
                    var focus = root,
                        nodes = pack(root).descendants(),
                        view;
            
                    var circle = g.selectAll("circle")
                        .data(nodes)
                        .enter().append("circle")
                        .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                        .style("fill", function (d) { return d.children ? color(d.depth) : null; })
                        .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
            
                    var text = g.selectAll("text")
                        .data(nodes)
                        .enter().append("text")
                        .attr("class", "label")
                        .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
                        .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
                        .text(function (d) { return d.data.name; });
            
                    var node = g.selectAll("circle,text");
            
                    svg
                        .style("background", color(-1))
                        .on("click", function () { zoom(root); });
            
                    zoomTo([root.x, root.y, root.r * 2 + margin]);
            
                    function zoom(d) {
                        var focus0 = focus; focus = d;
            
                        var transition = d3.transition()
                            .duration(d3.event.altKey ? 7500 : 750)
                            .tween("zoom", function (d) {
                                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                                return function (t) { zoomTo(i(t)); };
                            });
            
                        transition.selectAll("text")
                            .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                            .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
                            .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                            .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
                    }
            
                    function zoomTo(v) {
                        var k = diameter / v[2]; view = v;
                        node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                        circle.attr("r", function (d) { return d.r * k; });
                    }
                });
            }

            if (!sha || !this.repoInfos) return;
            displayGraph(apiUrl + '/repos/' + this.repoInfos.owner + '/' + this.repoInfos.repo + '/commits/' + sha + '/files', (err) => {
                console.log(err);
            });
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
                //TODO MESSAGE OR SOMETHING
            }).catch(err => {
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
                } catch (e) {
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