var path = require("path");
var Git = require("nodegit");
var _ = require("underscore");
var router = require("express").Router();

router.get("/repos/:owner/:repoName/commits", async (req, res) => {
  try {
    const repo = await getGitRepo(req.params);
    const firstComm = await repo.getHeadCommit();
    var history = firstComm.history();
    var list = [];

    history.on("commit", (commit) => {
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
      res.status(404).send();
    });

    history.start();
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
});

router.get("/repos/:owner/:repoName/commits/:sha/files", async (req, res) => {
  try {
    const repo = await getGitRepo(req.params);
    const commit = await repo.getCommit(req.params.sha);
    const tree = await commit.getTree();
    const filesTree = { name: req.params.repoName, children: [] };
    const promises = [];
    const walker = tree.walk(false);

    walker.on("end", async trees => {
      trees.forEach(async entry => {
        let node = { name: entry.name() };
        let hook = filesTree.children;
        if (entry.isFile()) {
          node.size = 0;
          if (entry.isBlob()) {
            const blobPromise = entry.getBlob();
            promises.push(blobPromise);
            const blob = await blobPromise;
            node.size = blob
              .content()
              .toString()
              .split("\n").length;
          }
        } else {
          node.children = [];
        }
        entry
          .path()
          .split("/")
          .slice(0, -1)
          .forEach(folder => {
            hook = hook.find(child => child.name === folder).children;
          });
        hook.push(node);
      });
      await Promise.all(promises);
      res.status(200).send(filesTree);
    });
    walker.start();
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
});

var getGitRepo = async params => {
  const { owner, repoName } = params;
  const pathToRepo = path.join(__dirname, `repos/${owner}_${repoName}`);
  if (!owner || !repoName) {
    throw new Error("wrong parameters");
  }

  try {
    return await Git.Repository.open(pathToRepo);
  } catch (err) {
    console.log("error while opening", err);
    try {
      return await Git.Clone(
        `https://github.com/${owner}/${repoName}`,
        pathToRepo
      );
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = router;
