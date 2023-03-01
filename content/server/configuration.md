---
title: 'Configuration'
description: 'Here we descripbe the generic configuration of the graphql-sequelize-generator server'
metaTitle: 'Configuration'
metaDescription: 'Here we descripbe the generic configuration of the graphql-sequelize-generator server'
---

Here is a quick overview of the configuration possible on the server.

```javascript
// You Sequelize models' folder
const models = require('./../models');

// The types must only be generated once
// if you are also using "generateSchema", instanciate the types
// before like this.
const types = generateModelTypes(models);

// Optional property, call before each resolvers hook
// Called even if a hook is not declared.
const globalPreCallback = () => {};

const server = generateApolloServer({
  // The declartion of your schema's models
  graphqlSchemaDeclaration,
  // Additionnal mutations
  customMutations,
  types,
  models,
  globalPreCallback,
  // Any options valid for an Apollo server
  apolloServerOptions,
  // A pub/sub instance if you are using the subscriptions
  pubSubInstance,
});
```
