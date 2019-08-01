var path = require("path");
var Git = require("nodegit");
var GithubColor = require("github-colors");
var router = require("express").Router();

router.get("/GithubColors/ext(/:extension)?", function(req, res) {
  if (!req.params.extension) {
    var extensions = GithubColor.init(true);
    res.json(extensions);
  } else {
    var extInfos = GithubColor.ext(req.params.extension);
    res.send(extInfos);
  }
});

router.get("/repos/:owner/:repoName/commits", function(req, res) {
  getGitRepo(req.params)
    .then(function(repo) {
      return repo.getHeadCommit().then(function(firstComm) {
        var history = firstComm.history();
        var list = [];

        history.on("commit", function(commit) {
          list.push({
            date: commit.date(),
            author: commit.committer().name(),
            message: commit.message(),
            sha: commit.sha()
          });
        });

        history.on("end", function() {
          res.status(200).json(list);
        });

        history.on("error", function(err) {
          console.log(err);
          res.status(500).send();
        });

        history.start();
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(404).send();
    });
});

router.get("/repos/:owner/:repoName/commits/:sha/files", function(req, res) {
  getGitRepo(req.params)
    .then(function(repo) {
      return repo.getCommit(req.params.sha).then(function(commit) {
        return commit.getTree().then(function(tree) {
          var filesTree = { name: req.params.repoName, children: [] },
            promises = [],
            walker = tree.walk(false);

          walker.on("entry", function(entry) {
            let node,
              hook = filesTree.children;
            if (entry.isFile()) {
              node = { path: entry.path(), name: entry.name(), size: 0 };
              if (entry.isBlob()) {
                promises.push(
                  entry.getBlob().then(function(blob) {
                    node.size = blob
                      .content()
                      .toString()
                      .split("\n").length;
                  })
                );
              }
            } else {
              node = { name: entry.name(), children: [] };
            }
            entry
              .path()
              .split("\\")
              .slice(0, -1)
              .forEach(folder => {
                hook = hook.find(child => child.name === folder).children;
              });
            hook.push(node);
          });

          walker.on("end", function() {
            Promise.all(promises)
              .then(() => {
                res.status(200).send(filesTree);
              })
              .catch(error => {
                console.log(error);
                res.status(500).send();
              });
          });

          walker.start();
        });
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(404).send();
    });
});

router.get("/repos/:owner/:repoName/commits/:sha/files/:path", function(
  req,
  res
) {
  getGitRepo(req.params)
    .then(function(repo) {
      return repo.getCommit(req.params.sha).then(function(commit) {
        return commit
          .getEntry(req.params.path.replace(/\\/g, "/"))
          .then(function(entry) {
            if (entry && entry.isBlob()) {
              return entry.getBlob().then(function(blob) {
                res.status(200).send({ content: blob.content().toString() });
              });
            } else {
              res.status(404).send();
            }
          });
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(404).send();
    });
});

var getGitRepo = function(params) {
  var { owner, repoName } = params;
  var pathToRepo = path.join(__dirname, `repos/${owner}_${repoName}`);
  var cloneOptions = {
    fetchOpts: {
      callbacks: {
        transferProgress: function(log) {
          console.log(
            `transfer : ${log.receivedObjects()} / ${log.totalObjects()} (${log.indexedObjects()})`
          );
        }
      }
    }
  };
  return new Promise(function(resolve, reject) {
    if (!owner || !repoName) {
      reject("wrong parameters");
      return;
    }

    Git.Repository.open(pathToRepo)
      .then(resolve)
      .catch(function(err) {
        console.log("error while opening", err);
        Git.Clone(
          `https://github.com/${owner}/${repoName}`,
          pathToRepo,
          cloneOptions
        )
          .then(resolve)
          .catch(function(err) {
            console.log("error while downloading", err);
            reject(err);
          });
      });
  });
};

module.exports = router;
