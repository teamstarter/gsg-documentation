---
title: 'Default usage'
metaTitle: 'Default usage'
metaDescription: 'Here we descripbe the base functionnalities of graphql-sequelize-generator'
---
# Creating your schema
## Preparing your schema
Create a schema.js, and initialize the schema with this code:
```javascript
const {
  generateModelTypes,
  generateApolloServer,
} = require("graphql-sequelize-generator");
const { WebSocketServer } = require("ws");
const { PubSub } = require("graphql-subscriptions");
const models = require("./models");
const { GraphQLObjectType, GraphQLString } = require("graphql");

const graphqlSchemaDeclaration = {};
//Models here

const types = generateModelTypes(models);

module.exports = (globalPreCallback = () => null, httpServer) => {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });

  const customMutations = {};
  customMutations.logThat = {
    type: new GraphQLObjectType({
      name: "logThat",
      fields: {
        message: { type: GraphQLString },
      },
    }),
    args: {
      message: {
        type: GraphQLString,
      },
    },
    description: "Refresh the status of the call for projects.",
    resolve: async (source, args, context, info) => {
      // Your mutation can do something here...
      console.log(args.message);

      return {
        message: args.message,
      };
    },
  };

  return {
    server: generateApolloServer({
      graphqlSchemaDeclaration,
      customMutations,
      types,
      models,
      globalPreCallback,
      wsServer,
      apolloServerOptions: {
        // Required for the tests.
        csrfPrevention: false,
        playground: true,
        // Example of socket security hook.
        subscriptions: {
          onConnect: () => {
            return true;
          },
        },
      },
      callWebhook: (data) => {
        return data;
      },
      pubSubInstance: new PubSub(),
    }),
  };
};
```



## Adding your models into your schema
Resolvers configurations are grouped into a single configuration property of **generateApolloServer** and **generateSchema**.

Here is the simplest example possible to define the "user" model:

```javascript
graphqlSchemaDeclaration.user = {
  model: models.user,
};
```

This will by default:

- Create a create "user" resolver to list all users
- Create the userCreate, userUpdate and userDelete resolvers for the related mutations
- Create a "count" resolver

Our example file looks like this :
```javascript
const {
  generateModelTypes,
  generateApolloServer,
} = require("graphql-sequelize-generator");
const { WebSocketServer } = require("ws");
const { PubSub } = require("graphql-subscriptions");
const models = require("./models");
const { GraphQLObjectType, GraphQLString } = require("graphql");

const graphqlSchemaDeclaration = {};
//Models here
graphqlSchemaDeclaration.user = {
  model: models.user,
};

graphqlSchemaDeclaration.company = {
  model: models.company,
};

const types = generateModelTypes(models);

module.exports = (globalPreCallback = () => null, httpServer) => {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });

  const customMutations = {};
  customMutations.logThat = {
    type: new GraphQLObjectType({
      name: "logThat",
      fields: {
        message: { type: GraphQLString },
      },
    }),
    args: {
      message: {
        type: GraphQLString,
      },
    },
    description: "Refresh the status of the call for projects.",
    resolve: async (source, args, context, info) => {
      // Your mutation can do something here...
      console.log(args.message);

      return {
        message: args.message,
      };
    },
  };

  return {
    server: generateApolloServer({
      graphqlSchemaDeclaration,
      customMutations,
      types,
      models,
      globalPreCallback,
      wsServer,
      apolloServerOptions: {
        // Required for the tests.
        csrfPrevention: false,
        playground: true,
        // Example of socket security hook.
        subscriptions: {
          onConnect: () => {
            return true;
          },
        },
      },
      callWebhook: (data) => {
        return data;
      },
      pubSubInstance: new PubSub(),
    }),
  };
};
```
⚠️ The model declaration with GraphQL-Sequelize-Generator follows the models declaration you did with Sequelize-CLI : https://sequelize.org/docs/v6/other-topics/migrations/ 

### Relations between endpoints

Declaring many models will add the related models AND their associations to your GraphQL schema.

For example:

```javascript
graphqlSchemaDeclaration.user = {
  model: models.user,
};
graphqlSchemaDeclaration.car = {
  model: models.car,
};
graphqlSchemaDeclaration.house = {
  model: models.house,
};
```

Will allow you to query:

```graphql
query test {
  user {
    id
    name
    house {
      id
      address
    }
    cars {
      id
      brand
    }
  }
}
```

If you have the relations set in your Sequelize folder.

⚠️ Any relation linked to a model NOT defined in the graphqlSchemaDeclaration will be ignored. It's up to you to chose what do you expose.

## We now have a fully functional server with our models. Start it and access to Apollo GraphQL playground with the URL shown in the console.