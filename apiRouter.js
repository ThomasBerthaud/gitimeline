var path = require('path');
var Git = require('nodegit');
var router = require('express').Router();

router.get('/commits/history', function (req, res) {
  var repoName = req.query.url ? req.query.url.split('/')[req.query.url.split('/').length - 1] : null;
  if (!repoName) {
    res.status(404).send();
    return;
  }
  var pathToRepo = path.join(__dirname, 'repos/' + repoName);

  Git.Repository.open(pathToRepo).then(retrieveCommits).catch(function (err) {
    console.log(err);
    Git.Clone(req.query.url, pathToRepo)
    .then(retrieveCommits)
    .catch(console.log);
  });

  function retrieveCommits(repo) {
    return repo.getMasterCommit().then(function (firstComm) {
      var history = firstComm.history();
      var list = [];

      history.on('commit', function(commit){
        list.push({
          "author": commit.committer().name(),
          "message": commit.message(),
          "sha": commit.sha()
        });
      })

      history.on('end', function () {
        res.status(200).json(list);
      })

      history.start();
    })
  }
})

module.exports = router;