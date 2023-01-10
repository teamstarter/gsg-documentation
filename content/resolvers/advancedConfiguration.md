---
title: 'Advanced configuration'
metaTitle: 'Advanced configuration'
metaDescription: 'Here we descripbe the advanced configurations of graphql-sequelize-generator'
---

Here is a sum-up of everything you can configure in a model declaration:

```javascript
graphqlSchemaDeclaration.user = {
  model: models.user,
  // You can specify any of those, will default to this list if not set.
  actions: ['list', 'create', 'delete', 'update', 'count'],
  // You can specify any of those, no subscriptions are created by default.
  subscriptions: ['create', 'update', 'delete'],
  // Exclude from root allows you to only define a model as a relation
  // to other models. It will not be listed in the root of the GraphQL
  // tree but will be available as child of other nodes.
  // Can be useful when you don't want to set the default rights for
  // a model.
  excludeFromRoot: false,
  // You can exclude some fields from the models. They will be be listed nor
  // available in a response. Useful for passwords and secrets in general.
  excludeFields: ['surveyAnswerRequest']
  // "before" is a list of functions to be called before
  // each resolvers of the model.
  before: [
    async (args, context, info) => {
      // Global before hook only have args, context and info.
      // You can use many functions or just one.

      // Use it if you need to do something before each endpoint
      if (!context.bootDate) {
        throw new Error('Boot date is missing!')
      }

      if (info.xxx) {
        throw new Error('Xxx is provided when it should not!')
      }

      // Typical usage:
      // * Protect an endpoint
      // * Verify entity existance

      // ex:
      // if (!context.user.role !== 'admin') {
      //   throw new Error('You must be admin to use this endpoint!')
      // }

      // The function returns nothing
    }
  ],
  list: {
    // By default only attributes required in the GraphQL query
    // are fetched. You can disable this if you need to
    // post-process many properties not in the base query.
    // When false, all attributes will be fetched.
    removeUnusedAttributes: false,
    // Additional arguments can be added to the default ones.
    extraArg: { anotherArg: { type: GraphQLInt } },
    // A hook that will be called before the fetch in the database.
    // The returned object, "findOptions", will be directly given to
    // the find[One/All] after.
    before: async (findOptions, args, context, info) => {
      if (typeof findOptions.where === 'undefined') {
        findOptions.where = {}
      }
      findOptions.where = {
        [Op.and]: [findOptions.where, { departmentId: [1] }]
      }
      return findOptions
    },
    // A hook called after the data is fetched.
    // Can be used for post-processing or triggering log.
    after: async (result, args, context, info) => {
      if (result && typeof result.length !== 'undefined') {
        for (const user of result) {
          if (user.name === 'Test 5 c 2') {
            user.name = `Mr ${user.name}`
          }
        }
      }

      return result
    },
    // If you want to overwrite the list resolver totally, you can.
    // When doing so the after and before will not be called.
    resolver: async (source, args, context) => {
      // custom code
      return [{id: 1, ...}]
    }
  },
  // The followings hooks are just here to demo their signatures.
  // They are not required and can be omited if you don't need them.
  create: {
    extraArg: { anotherArg: { type: GraphQLInt } },
    before: async (source, args, context, info) => {
      // You can restrict the creation if needed
      return args.user
    },
    after: async (newEntity, source, args, context, info) => {
      // You can log what happened here
      return newEntity
    },//
    subscriptionFilter: (payload, args, context) => {
      // Exemple of subscription check
      if (context.user.role !== 'admin') {
        return false
      }
      return true
    }
  },
  update: {
    extraArg: { anotherArg: { type: GraphQLInt } },
    before: async (source, args, context, info) => {
      // You can restrict the creation if needed
      return args.user
    },
    after: async (
      updatedEntity,
      entitySnapshot,
      source,
      args,
      context,
      info
    ) => {
      // You can log what happened here
      return updatedEntity
    },
    //
    subscriptionFilter: (payload, args, context) => {
      // Exemple of subscription check
      if (context.user.role !== 'admin') {
        return false
      }
      return true
    }
  },
  delete: {
    extraArg: { anotherArg: { type: GraphQLInt } },
    before: async (where, source, args, context, info) => {
      // You can restrict the creation if needed
      return where
    },
    after: async (deletedEntity, source, args, context, info) => {
      // You can log what happened here
      return deletedEntity
    },
    //
    subscriptionFilter: (payload, args, context) => {
      // Exemple of subscription check
      if (context.user.role !== 'admin') {
        return false
      }
      return true
    }
  },
  // When you want to add additional mutations,
  // you can add them here if they are related to the model.
  // Or in the server customMutations if they are not related.
  // This hook exists to easily understand what mutations impact the model.
  additionalMutations: {
     toggleMyProperty: {
        type: myUserOutputType,
        description:
          'Enable or disable a group for the current user.',
        args: {
          groupId: { type: GraphQLInt }
        },
        resolve: async (source, { groupId }, context, info) => {
          // your mutation code...
          return { user: updateUser }
        }
      }
    }
  },
  // You can add custom subscription if needed
  additionalSubscriptions: {
    fileUpdated: {
      type: modelTypes.outputTypes.file,
      args: {
        authorId: { type: GraphQLInt }
      },
      subscribe: withFilter(
        () => pubSub.asyncIterator('fileUpdated'),
        (payload, variables, context) => {
          if (!context.user || !payload) {
            return false
          }
          if (payload.fileUpdated.authorId !== variables.authorId) {
            return false
          }
          return true
        }
      )
    }
  }
}
```

You can also declare a fully custom endpoint who will not depend on the model. It will simply be added to the schema as a native GraphQL endpoint but no hooks will be available.

```javascript
graphqlSchemaDeclaration.myCustomCarEndpoint = () => {
  const car = new GraphQLObjectType({
    name: 'questionsScore',
    description: 'A score per question',
    fields: {
      name: { type: GraphQLString },
      type: { type: GraphQLString },
      constructor: { type: GraphQLString },
    },
  });

  return {
    type: new GraphQLList(car),
    args: {
      constructor: { type: GraphQLString },
    },
    resolve: async (source, args, context) => {
      // Fetch the cars...
      return result;
    },
  };
};
```
