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

### Errors
navpi has some validations like: `required`, `minLength`, `maxLenght`, `min`. and if you need that the field starts with some errors you can pass the prop `__errors` do the field.

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
	  label: 'E-mall',
	  required: true,
	  __errors: ['Invalid e-mail'] // field email starts with error
    },

    name: {
      name: 'name',
      type: 'text',
	  label: 'Nome',
	  minLength: 3,
	  __search: true // enable filter search (search will looking for name)
    },

    city: {
      name: 'city',
      type: 'select',
	  label: 'Cidade',
      __value: 'cravinhos', // if you don't pass this prop, the default value will be a random value genetaed by faker.js based on his type
      options: [
        { label: 'Cravinhos', value: 'cravinhos' },
        { label: 'Ribeirao preto', value: 'ribeirao' },
      ]
    },

    posts: {
      name: 'posts',
      type: 'select',
      label: 'Comunicados',
      multiple: true, // active multiple select from quasar (if used with some relation it will only work with manyToMany)
      __relation: 'posts', // indicate which entity users will to relation
      __relationType: 'manyToMany', // type of relation
      __relationLabel: 'name', // key to create the `options`. Ex: if passed `__relationLabel: 'name', the label of options will the same of results key `name`.
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
      __relationType: 'manyToOne', // inside the model "category" you have to create a relation with users with relation "manyToOne"
      __relationLabel: 'name'
    }
  }
}
```

Now that we configure the model we have to run the command `navpi sync` to create the database, then we run `navpi seed` to populate the database, after that run `navpi server` now the server is running ready to be used.

> `navpi sync`
> `navpi seed`
> `navpi server` (server is running on port 5051).

If we create a request `GET` to `http://localhost:5051/users` it will return something like that:
```json
{
  "results": [
    {
      "uuid": "03b84618-cc85-4bb1-a163-ec39580eb870",
      "email": "Natalie39@gmail.com",
      "name": "Voluptates ea et distinctio omnis consequuntur pariatur beatae hic.",
      "city": "cravinhos",
      "posts": [],
      "companies": null,
      "category": null
    },
    {
      "uuid": "081db3e5-6b67-414b-9235-933fdbf670e8",
      "email": "Karlie_OKeefe54@gmail.com",
      "name": "Et exercitationem modi consequatur saepe ducimus praesentium mollitia non.",
      "city": "cravinhos",
      "posts": [],
      "companies": null,
      "category": null
    }
  ],
  "count": 2,
  "errors": {
    "email": [
      "Invalid e-mail"
    ]
  },
  "fields": {
    "email": {
      "name": "email",
      "type": "email",
      "label": "E-mall",
      "required": true
    },
    "name": {
      "name": "name",
      "type": "text",
      "label": "Nome",
      "minLength": 3
    },
    "city": {
      "name": "city",
      "type": "select",
      "label": "Cidade",
      "options": [
        {
          "label": "Cravinhos",
          "value": "cravinhos"
        },
        {
          "label": "Ribeirao preto",
          "value": "ribeirao"
        }
      ]
    },
    "posts": {
      "name": "posts",
      "type": "select",
      "label": "Comunicados",
      "multiple": true,
      "options": [
        {
          "label": "Nihil rerum aut.",
          "value": "99f21e3e-e448-4184-8f0c-8000bedb194e"
        },
        {
          "label": "Rerum facilis fugit.",
          "value": "2a8e62d3-9086-43de-ade0-c85aaf334f35"
        }
      ]
    },
    "companies": {
      "name": "companies",
      "type": "select",
      "label": "Empresas",
      "options": [
        {
          "label": "Quae eveniet aliquam.",
          "value": "347179b4-905e-4376-be16-dd5db7296351"
        },
        {
          "label": "Sed architecto facilis culpa corporis nulla voluptatem.",
          "value": "8307bab2-29cb-483d-bc49-259a9cdf6cb2"
        },
        {
          "label": "Aperiam eum molestiae.",
          "value": "08d1b0c7-2ba5-4630-aa9d-18d26d3d5691"
        }
      ]
    },
    "category": {
      "name": "category",
      "type": "select",
      "label": "Categorias",
      "options": [
        {
          "label": "Consequuntur et rerum.",
          "value": "d0be651d-3fef-457b-99f3-174fd3770b19"
        },
        {
          "label": "Voluptas omnis corrupti.",
          "value": "e3fa103e-b0c1-4a1d-bd4e-dfdc4d7b8695"
        },
        {
          "label": "Sunt magni rem aut fugiat ullam iure.",
          "value": "0d258cb2-05aa-4fc1-a21b-35076540feb7"
        }
      ]
    }
  },
  "status": {
    "code": 200
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
