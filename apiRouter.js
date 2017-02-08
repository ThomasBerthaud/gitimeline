var path = require('path');
var Git = require('nodegit');
var router = require('express').Router();

router.get('/repos/:owner/:repoName/commits/history', function (req, res) {
    var {owner, repoName} = req.params;
    if (!owner || !repoName) {
        res.status(404).send();
        return;
    }
    var pathToRepo = path.join(__dirname, `repos/${owner}_${repoName}`);
    console.log(pathToRepo);

    Git.Repository.open(pathToRepo).then(retrieveCommits).catch(function (err) {
        console.log(err);
        console.log(`https://github.com/${owner}/${repoName}`)
        Git.Clone(`https://github.com/${owner}/${repoName}`, pathToRepo)
            .then(retrieveCommits)
            .catch(function (err) {
                console.log(err);
                res.status(404).send();
            });
    });

    function retrieveCommits(repo) {
        return repo.getMasterCommit().then(function (firstComm) {
            var history = firstComm.history();
            var list = [];

            history.on('commit', function (commit) {
                list.push({
                    "author": commit.committer().name(),
                    "message": commit.message(),
                    "url": `http://localhost:3000/api/${owner}/${repoName}/commits/${commit.sha()}/files`
                });
            })

            history.on('end', function () {
                res.status(200).json(list);
            })

            history.start();
        })
    }
})

router.get('/repos/:owner/:repo/commits/:sha/files', function (req, res) {

    res.send('pouet');

})

module.exports = router;