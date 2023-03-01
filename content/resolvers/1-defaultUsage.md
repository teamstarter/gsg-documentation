---
title: 'Default usage'
metaTitle: 'Default usage'
metaDescription: 'Here we descripbe the base functionnalities of graphql-sequelize-generator'
---

Resolvers configurations are grouped into a single configuration property of **generateApolloServer** and **generateSchema**.

Here is the simplest example possible to define the "user" model:

```javascript
graphqlSchemaDeclaration.user = {
  model: models.user,
};
```

Assuming "models" is your import of the Sequelize models folder.

This will by default:

- Create a create "user" resolver to list all users
- Create the userCreate, userUpdate and userDelete resolvers for the related mutations
- Create a "count" resolver

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

> ⚠️
> Any relation linked to a model NOT defined in the graphqlSchemaDeclaration will be ignored. It's up to you to chose what do you expose.
