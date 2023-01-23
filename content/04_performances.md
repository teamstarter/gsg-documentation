---
title: 'Performances'
metaTitle: 'Performances'
metaDescription: 'Here we talk about the performances of graphql-sequelize-generator'
---

GSG uses [graphql-sequelize](https://github.com/mickhansen/graphql-sequelize) under the hood, and so it inherit it's dependency [dataloader-sequelize](https://github.com/mickhansen/dataloader-sequelize).

---
# Performances
### Dataloader-sequelize

Dataloader-sequelize (DS) is an implementation of the Facebook [dataloader](https://github.com/graphql/dataloader) for the Sequelize ORM.

DS uses hooks on the Sequelize models to intercept all queries made to the database. The ones that "look alike" are regrouped in a single query and the result of the single query is split and dispatch to the original calls. Awesome concept :)

Yet it has drawbacks. The queries must not be too complexes.

In the current implementation of DS, all queries with a "where" attributes in arguments are NOT batched. Only queries with findById and findByPk are taken in account.

This works well with the default setup of GSG but be careful of the performance impact of your custom hooks!

```javascript
list: {
    before: (findOptions, args, context, info) => {
      // DO NOT DO THIS that way!!!
      if (typeof findOptions.where === 'undefined') {
        findOptions.where = {}
      }

      // DO NOT DO THIS that way!!!
      findOptions.where = {
        [Op.and]: [findOptions.where, { companyId: context.user.companyId }]
      }

      return findOptions
    }
  },
```

For example, the example above insure that the current user can only access the entities of his company. But this will only work efficiently for root queries!

```javascript
query okQuery {
   company {
     id
   }
}

query slowQuery {
   user {
     id
     relatedCompanies {
       id
     }
   }
}
```

To solve this, you must use the relation of your database. Only apply rights if you are fetching the entities from the root.

```javascript
list: {
    before: (findOptions, args, context, info) => {
      // For exemple you can only apply the rights when it parent entity
      // is not of a given type
      if (
        info.parentType &&
        info.parentType.name !== 'user'
      ) {
        // In any case, do not add the "where" attribute if you are not using it!
        // Just adding "where = {}" will remove the batching!
        if (typeof findOptions.where === 'undefined') {
          findOptions.where = {}
        }

        findOptions.where = {
          [Op.and]: [findOptions.where, { id: context.user.organizationId }]
        }
      }

      return findOptions
    }
  },
```
