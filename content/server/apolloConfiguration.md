---
title: 'Apollo configuration'
metaTitle: 'Apollo configuration'
metaDescription: 'Here we descripbe the apollo configurations for graphql-sequelize-generator'
---

This library is based on [apollo-server](https://www.npmjs.com/package/apollo-server). You can configure the Apollo server with all the possible configuration of basic usage.

```javascript
const server = generateApolloServer({
  // Here is an example of an apollo server configuration
  apolloServerOptions: {
    playground: true,
    // Example of context modification.
    context: ({ req, connection }) => {
      const contextDataloader = createContext(models.sequelize);

      // Connection is provided when a webSocket is connected.
      if (connection) {
        // check connection for metadata
        return {
          ...connection.context,
          [EXPECTED_OPTIONS_KEY]: contextDataloader,
        };
      }

      // This is an example of context manipulation.
      return {
        ...req,
        bootDate: '2017-01-01',
        [EXPECTED_OPTIONS_KEY]: contextDataloader,
      };
    },
    // Example of socket security hook.
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        return true;
      },
    },
  },
});
```
