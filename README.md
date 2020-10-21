# gsg-site

The documentation website of graphql-sequelize-generator using [Gatsby](https://www.gatsbyjs.com/starters/hasura/gatsby-gitbook-starter).

---

## Edition

---

First clone the project

```
$ git clone git@github.com:teamstarter/gsg-site.git
```

Add the Gatsby CLI if you do not have it

```
$ yarn global add gatsby-cli
```

we edit the site by modifying the .md files located in the content folder. Each menu section is represented by a folder with the same name as the root .md file of the section.

The config.json file can also be edited to change the configurations of the website (the elements of the hearder, froexample).

## Available commands

---

### Start the development server

```
$ gatsby develop
```

Gatsby will start a hot-reloading development environment accessible by default at http://localhost:8000.

Try editing the home page in src/pages/index.js. Saved changes will live reload in the browser.

### Create a production build

```
$ gatsby build
```

Gatsby will perform an optimized production build for your site, generating static HTML and per-route JavaScript code bundles.

### serve the production build locally

```
$ gatsby serve
```

Gatsby starts a local HTML server for testing your built site. Remember to build your site using gatsby build before using this command.
