# GitHub Timeline

implementation of an app idea from [app-ideas](https://github.com/florinpop17/app-ideas/blob/master/Projects/3-Advanced/GitHub-Timeline-App.md)


**Tier:** 3-Advanced

API's and graphical representation of information are hallmarks of modern
web applications. GitHub Timeline combines the two to create a visual history
of a users GitHub activity.

The goal of GitHup Timeline is accept a GitHub user name and produce a
timeline containing each repo and annotated with the repo names, the date
they were created, and their descriptions. The timeline should be one that
could be shared with a prospective employer. It should be easy to read and
make effective use of color and typography.

Only public GitHub repos should be displayed.

## User Stories

- [ ] User can enter a GitHub user name
- [ ] User can click a 'Generate' button to create and display the named
      users repo timeline
- [ ] User can see a warning message if the GitHub user name is not a valid
      GitHub user name.

## Bonus features

- [ ] User can see a summary of the number of repos tallied by the year they
      were created

## Useful links and resources

GitHub offers two API's you may use to access repo data. You may also choose
to use an NPM package to access the GitHub API.

Documentation for the GitHub API can be found at:

- [GitHub REST API V3](https://developer.github.com/v3/)
- [GitHub GraphQL API V4](https://developer.github.com/v4/)

Sample code showing how to use the GitHub API's are:

- [GitHub REST API client for JavaScript ](https://github.com/octokit/rest.js/)
- [GitHub GraphQL API client for browsers and Node](https://github.com/octokit/graphql.js)

You can use this CURL command to see the JSON returned by the V3 REST API for
your repos:

```
curl -u "user-id" https://api.github.com/users/user-id/repos
```

## Example projects

- [CSS Timeline](https://codepen.io/NilsWe/pen/FemfK)
- [Building a Vertical Timeline With CSS and a Touch of JavaScript](https://codepen.io/tutsplus/pen/QNeJgR)

# Documentation

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for production

build for production: 

```bash
npm run build
```

start the application in production mode: 
```bash
npm start
```
The application will start at http://localhost:3000 by default. The default port can be changed with -p, like so:
```bash
npm start -p 4000
```

## Run linter

run ESLint for all files in the `pages`, `components`, and `lib` directories.
```bash
npm run lint
```
## Run tests

First run unit tests:

```bash
npm test
```

You can also generate a test coverage:
```bash
npm run coverage
```
see result in `coverage` folder