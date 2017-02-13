var path = require('path');
var Git = require('nodegit');
var router = require('express').Router();

router.get('/repos/:owner/:repoName/commits/history', function (req, res) {
    getGitRepo(req.params).then(function (repo) {
        return repo.getMasterCommit().then(function (firstComm) {
            var history = firstComm.history();
            var list = [];

            history.on('commit', function (commit) {
                list.push({
                    "date": commit.date(),
                    "author": commit.committer().name(),
                    "message": commit.message(),
                    "sha": commit.sha()
                });
            })

            history.on('end', function () {
                res.status(200).json(list);
            })

            history.on('error', function (err) {
                console.log(err);
                res.status(500).send();
            });

            history.start();
        })
    }).catch(function (err) {
        console.log(err);
        res.status(404).send();
    })
})

router.get('/repos/:owner/:repoName/commits/:sha/files', function (req, res) {
    getGitRepo(req.params).then(function (repo) {
        return repo.getCommit(req.params.sha).then(function (commit) {
            return commit.getTree().then(function (tree) {
                var files = [], promises = [];

                var walker = tree.walk(false);

                walker.on('entry', function (entry) {
                    let file = {
                        name: entry.name(),
                        path: entry.path(),
                        type: entry.type()
                    }
                    if (entry.isBlob()) {
                        promises.push(entry.getBlob().then(function (blob) {
                            file.size = blob.content().toString().split("\n").length;
                        }));
                    }
                    files.push(file);
                })

                walker.on('end', function () {
                    Promise.all(promises).then(function () {
                        res.status(200).send(files)
                    }).catch(function (err) {
                        console.log(err);
                        res.status(500).send();
                    });
                })

                walker.start();
            })
        });
    }).catch(function (err) {
        console.log(err);
        res.status(404).send();
    })
})

router.get('/repos/:owner/:repoName/commits/:sha/diffStats', function (req, res) {
    getGitRepo(req.params).then(function (repo) {
        return repo.getCommit(req.params.sha).then(function (commit) {
            return commit.getDiff().then(function (arrayDiffs) {
                var promises = [];
                arrayDiffs.forEach(function (diff) {
                    promises.push(diff.patches());
                })

                return Promise.all(promises).then(function (arrayDiffs) {
                    arrayDiffs = arrayDiffs.map(function (arrayConvenientPatch) {
                        return arrayConvenientPatch.map(function (patch) {
                            return { stats: patch.lineStats(), file: patch.newFile().path() };
                        });
                    });
                    res.status(200).send(arrayDiffs);
                })
            })
        });
    }).catch(function (err) {
        console.log(err);
        res.status(404).send();
    })
})

var getGitRepo = function (params) {
    var {owner, repoName} = params;
    var pathToRepo = path.join(__dirname, `repos/${owner}_${repoName}`);
    return new Promise(function (resolve, reject) {
        if (!owner || !repoName) {
            reject('wrong parameters');
            return;
        }

        Git.Repository.open(pathToRepo).then(resolve).catch(function (err) {
            console.log('error while opening', err);
            Git.Clone(`https://github.com/${owner}/${repoName}`, pathToRepo)
                .then(resolve)
                .catch(function (err) {
                    console.log('error while downloading', err);
                    reject(err);
                });
        });
    });
}

module.exports = router;