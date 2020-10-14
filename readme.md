# navpi CLI

A CLI for create dynamic mocks for [steroids](https://github.com/bildvitta/quasar-app-extension-steroids).

## Install
`npm i navpi`

## Usage

Inside your project you will create a folder for your API mock (can be outside the project too).

### CLI commands
|  [g, generate] | [m, model]  | --type  | model-name  | fields:type |
| ------------ | ------------ | ------------ | ------------ | ----------- |
| command for generate  | model entity  | model extension avaliable: `[js, json, yml]` | name of model  | fields of model and types of fields  |

### Filters
navpi generate dynamic filters based on fileds, if you have a model with `name` and `email` the dynamic filters will return of both fields. To enable the `search` filter you can pass a prop `__search: true` inside the field you want.

### Relations
navpi accept: `manyToMany`, `manyToOne`, `oneToMany`, `oneToOne`. If you use **oneToMany** you have to use **manyToOne** and vice versa, check about relations [here](https://typeorm.io/#/relations).

### Example of Usage
> - navpi new `[model-name]`
>   - ex: `navpi new api` (will create a folder named `api`).
> - inside `api` folder: `navpi [g | generate] [m | model] [--type=[js, json, yml]] [model-name] [field:type] [field:type]...`
>   * ex: `navpi g m posts name:text email:text`;
>   * ex: `navpi g m --type=js posts name:text email:text`;
>   * ex: `navpi generate model users name email phone`;
>   *  the defaul type for `--type` is `yml`;
>   * the default `type` for `field` is `text`, check [here](https://github.com/bildvitta/api) all types avaliables.

The command `navpi g m users --type=js email:email name city:select  posts:select companies:select` will generate a file inside models named `users.js` with this content:

```js
module.exports = {
  fields: {
    email: {
      name: 'email',
      type: 'email'
    },

    name: {
      name: 'name',
      type: 'text'
    },

    city: {
      name: 'city',
      type: 'select'
    },

    posts: {
      name: 'posts',
      type: 'select'
    },

    companies: {
      name: 'companies',
      type: 'select'
    },

    category: {
      name: 'category',
      type: 'select'
    }
  }
}
```

This content is only the bases, now you can add manually another contents, like options, label, value of field, relations etc. Let's configure users.js with relations:

```js
module.exports = {
  fields: {
    email: {
      name: 'email',
      type: 'email',
	  label: 'E-mal'
    },

    name: {
      name: 'name',
      type: 'text',
	  label: 'Nome',
	  __search: true // enable filter search (search will looking for name)
    },

    city: {
      name: 'city',
      type: 'select',
	  label: 'Cidade',
      __value: 'cravinhos' // if you don't pass this prop, the default value will be a random value genetaed by faker.js based on his type,
      options: [
        { label: 'Cravinhos', value: 'cravinhos' },
        { label: 'Ribeirao preto', value: 'ribeirao' },
      ]
    },

    posts: {
      name: 'posts',
      type: 'select',
      label: 'Comunicados',
      multiple: true, // activemultiple select from quasar (if used with some relation it will only work with manyToMany)
      __relation: 'posts', // indicate witch entity usersindicate which entity users will to relation
      __relationType: 'manyToMany', // type of relation
      __relationLabel: 'name', // 
    },

    companies: {
      name: 'companies',
      type: 'select',
      label: 'Empresas',
      __relation: 'companies',
      __relationType: 'oneToOne',
      __relationLabel: 'name',
    },

    category: {
      name: 'category',
      type: 'select',
      label: 'Categorias',
      __relation: 'category',
      __relationType: 'manyToOne',
      __relationLabel: 'name',
      options: [
        { label: 'teste', value: 'veritatis' }
      ]
    }
  }
}
```

## For Development

### Customizing your CLI

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

### Publishing to NPM

To package your CLI up for NPM, do this:

```shell
$ npm login
$ npm whoami
$ npm lint
$ npm test
(if typescript, run `npm run build` here)
$ npm publish
```

# License

MIT - see LICENSE

