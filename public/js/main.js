var apiUrl = 'http://localhost:3000/api';
var gitHubColors = null;

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
        maxSize: 100
    },
    created: function () {
        this.$http.get(apiUrl + '/GitHubColors/ext')
            .then(request => { gitHubColors = request.body })
            .catch(console.error);
    },
    computed: {
        svgWidth: function () {
            return window.innerWidth;
        },
        svgHeight: function () {
            return window.innerHeight - document.getElementById('nav').offsetHeight;
        },
        reversedCommitsSha: function () {
            return this.commits.map(function (com) {
                return com.sha;
            }).reverse();
        },
    },
    watch: {
        commitSelected: function (sha) {
            if (!sha || !this.repoInfos) return;
            if (this.selectedFile) {
                this.displayFile(this.selectedFile);
            } else {
                this.displayGraph();
            }
        }
    },
    methods: {
        displayGraph: function () {
            this.selectedFile = null;
            let self = this;
            let filesTreeUrl = `${apiUrl}/repos/${this.repoInfos.owner}/${this.repoInfos.repo}/commits/${this.commitSelected}/files`;
            let svg = d3.select("svg"),
                margin = 20,
                width = +(svg.style("width").slice(0, -2)),
                height = +(svg.style("height").slice(0, -2)),
                diameter = width > height ? height : width,
                toDelete = svg.select("g");

            //TODO make a transition
            let g = svg.append("g").attr("transform", "translate(" + ((width - diameter) / 2 + diameter / 2) + "," + ((height - diameter) / 2 + diameter / 2) + ")");

            let color = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);

            let pack = d3.pack()
                .size([diameter - margin, diameter - margin])
                .padding(2);

            d3.json(filesTreeUrl, function (error, root) {
                if (error) throw error;

                root = d3.hierarchy(root)
                    .sum(function (d) { return d.size; })
                    .sort(function (a, b) { return b.name - a.name; });

                let focus = root,
                    nodes = pack(root).descendants(),
                    view;

                let circle = g.selectAll("circle")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                    .style("fill", function (d) { return d.children ? color(d.depth) : calcColor(d.data.name); })
                    .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

                let text = g.selectAll("text")
                    .data(nodes)
                    .enter().append("text")
                    .attr("class", "label")
                    .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
                    .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
                    .text(function (d) { return d.data.name; });

                let node = g.selectAll("circle,text");

                svg.on("click", function () { zoom(root); });

                zoomTo([root.x, root.y, root.r * 2 + margin]);

                toDelete.remove();

                function zoomTo(v) {
                    let k = diameter / v[2]; view = v;
                    node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                    circle.attr("r", function (d) { return d.r * k; });
                }
                function zoom(d) {
                    if (d.children) {
                        let focus0 = focus; focus = d;

                        let transition = d3.transition()
                            .duration(d3.event.altKey ? 7500 : 750)
                            .tween("zoom", function (d) {
                                let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                                return function (t) { zoomTo(i(t)); };
                            });

                        transition.selectAll("text")
                            .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                            .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
                            .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                            .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
                    } else {
                        self.displayFile(d.data);
                    }
                }
            });
        },
        displayFile: function (file) {
            let url = `${apiUrl}/repos/${this.repoInfos.owner}/${this.repoInfos.repo}/commits/${this.commitSelected}/files/${file.path}`;
            this.$http.get(url).then(request => {
                file = _.extend(file, request.body);
                //try set language based on file extension
                try {
                    let ext = file.name.split('.')[file.name.split('.').length - 1];
                    file.highlighted = hljs.highlight(ext, file.content);
                } catch (e) {
                    //if fail use auto highlight
                    file.highlighted = hljs.highlightAuto(file.content);
                }
                console.log(file)
                this.selectedFile = file;
            }).catch(err => {
                let errorMessage = "Erreur : Ce fichier n'existe pas !";
                this.selectedFile = {
                    name: file.name,
                    path: file.path,
                    size: 0,
                    content: errorMessage,
                    highlighted: {value: errorMessage}
                }
            })
        },
        trim: function (string) {
            let length = 10;
            return string.length > length ?
                string.substring(0, length - 3) + "..." :
                string;
        },
        getHistory: function () {
            if (!this.repoUrl) {
                console.log('need to give a repo url');
                return;
            }

            let infos = this.repoUrl.split('/');
            let owner = infos.slice(-2, -1);
            let repo = infos.slice(-1);
            let commitsUrl = `${apiUrl}/repos/${owner}/${repo}/commits`;

            this.repoInfos = { owner, repo };
            this.pending = true;
            this.commitSelected = null;
            this.currentFiles = [];
            this.selectedFile = null;

            this.$http.get(commitsUrl).then(commitsHTTP => {
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

/////////////////UTILITIES//////////////
function calcColor(name) {
    if (name && gitHubColors) {
        let ext = name.split('.')[name.split('.').length - 1];
        if (gitHubColors[ext] && gitHubColors[ext].color) {
            return gitHubColors[ext].color;
        }
    }
    return "#ccc";
}