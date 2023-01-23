---
title: 'Advanced configuration'
metaTitle: 'Advanced configuration'
metaDescription: 'Here we descripbe the advanced configurations of graphql-sequelize-generator'
---
# Advanced configuration
## Here is a sum-up of everything you can configure in a model declaration:

### Model declaration of example "user", with {options} to be set
```javascript
graphqlSchemaDeclaration.user = {
  {options}
}
```
---
## Options you can set :
### model
Will use the model from your sequelize models file
```javascript
model: models.user,
```

### actions and subscriptions
```javascript
// You can specify any of those, will default to this list if not set.
actions: ['list', 'create', 'delete', 'update', 'count'],

// You can specify any of those, no subscriptions are created by default.
subscriptions: ['create', 'update', 'delete'],
```

  ### excludeFromRoot
Exclude from root allows you to only define a model as a relation to other models. It will not be listed in the root of the GraphQL tree but will be available as child of other nodes. Can be useful when you don't want to set the default rights for a model.
```javascript
excludeFromRoot: false, //define this model as a relation to other models (not listed in the root of the GraphQL tree)
```

  
### excludeFields
You can exclude some fields from the models. They will be be listed nor available in a response. Useful for passwords and secrets in general.
```javascript
excludeFields: ['fieldToExclude'],
```
### before
"before" is a list of functions to be called before each resolvers of the model.
```javascript
 before: [
    async (args, context, info) => {
    // Global before hook only have args, context and info. You can use many functions or just one.

// Examples
    if (!context.xxx) {
      throw new Error('xxx is missing!')
    }

    if (info.xxx) {
      throw new Error('xxx is provided when it should not!')
      }
    }
  ]
```

#### Typical usage
  - Protect and endpoint
  - Verify entity existence

Exemple:
```javascript
if (!context.user.role !== 'admin') {
  throw new Error('You must be admin to use this endpoint!')
}
// The function returns nothing
```
----
### List option with... options to be set ! Option-ception ? Ince-option ?
```javascript
list: {
  {options}
  }
```
  
  #### List options you can set :
  ##### removeUnusedAttributes
By default only attributes required in the GraphQL query are fetched. You can disable this if you need to post-process many properties not in the base query. When false, all attributes will be fetched.
```javascript
removeUnusedAttributes: false, //all attributes will be fetched
```

##### anotherArg
Additional arguments can be added to the default ones.
```javascript
extraArg: { anotherArg: { type: GraphQLInt } }, //The argument "anotherArg" will be added
```
##### before and after hooks
"before" is a hook that will be called before the fetch in the database. The returned object, "findOptions", will be directly given to the find[One/All] after.
```javascript
before: async (findOptions, args, context, info) => {
    findOptions.where = {conditions}
  return findOptions
},


```
"after" is a hook called after the data is fetched. Can be used for post-processing or triggering log.
```javascript
    after: async (result, args, context, info) => {
      // Post processing

      return result
    },
```
##### Overwriting the list resolver
If you want to overwrite the list resolver totally, you can.
When doing so the after and before will not be called.
```javascript
    resolver: async (source, args, context) => {
      // custom code
      return [{id: 1, ...}]
    },
```

#### Optional hooks
The followings hooks are just here to demo their signatures. They are not required and can be omited if you don't need them.
##### create
```javascript
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
```
##### update
```javascript
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
  }
```

##### delete
```javascript
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
  }
```

#### Adding custom mutations
When you want to add custom mutations, you can add them here if they are related to the model. Or in the server customMutations if they are not related.

This hook exists to easily understand which mutations impact the model.
```javascript
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
```

#### Adding custom subscriptions
You can add custom subscription if needed
```javascript
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
```

#### Declaring a custom endpoint
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
