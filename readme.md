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
	  required: true
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
      "uuid": "0e043bd8-544b-482d-bc57-7791914933aa",
      "email": "Vada_DAmore70@yahoo.com",
      "name": "Similique quo perspiciatis nobis sed non beatae.",
      "city": "cravinhos",
      "posts": [],
      "companies": null,
      "category": null
    },
    {
      "uuid": "11e9e50e-1daf-478e-9458-b8a9c418014e",
      "email": "Penelope85@yahoo.com",
      "name": "Facilis dolor quo vero totam enim odit totam dolores.",
      "city": "cravinhos",
      "posts": [],
      "companies": null,
      "category": null
    }
  ],
  "count": 2,
  "fields": {
    "email": {
      "name": "email",
      "type": "email",
      "label": "E-mall"
    },
    "name": {
      "name": "name",
      "type": "text",
      "label": "Nome"
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
          "label": "Neque quis enim.",
          "value": "9fa42fbd-78ef-45d6-92bd-16d213e74dbd"
        },
        {
          "label": "Ab aspernatur qui qui inventore laborum vero impedit.",
          "value": "789985cc-d781-40c0-8b6f-86290185959c"
        }
      ]
    },
    "companies": {
      "name": "companies",
      "type": "select",
      "label": "Empresas",
      "options": [
        {
          "label": "Amet dolorem quo repellat officiis iusto excepturi ipsa iusto.",
          "value": "a1c44b37-889e-4bfa-b39f-46e6fef5ef1d"
        },
        {
          "label": "Sapiente quae dignissimos saepe magnam iusto.",
          "value": "ad7ae2ce-e6f4-4194-9e05-56b1563d0eb7"
        },
        {
          "label": "Necessitatibus non dolor dolorum molestias cupiditate.",
          "value": "cb3cf784-fa4a-4cb2-813a-392127f813fe"
        }
      ]
    },
    "category": {
      "name": "category",
      "type": "select",
      "label": "Categorias",
      "options": [
        {
          "label": "Et dicta suscipit ullam in tenetur aut labore porro minima.",
          "value": "55b879d7-90dd-4ed1-9847-5c20c1dbbc73"
        },
        {
          "label": "Odio tenetur dolor id omnis incidunt adipisci maxime ullam.",
          "value": "b4619d14-c486-4366-bab4-1a04ca863a2c"
        },
        {
          "label": "Quam numquam aut.",
          "value": "b9703268-e786-424f-b1cc-421724f855a4"
        },
        {
          "label": "Sint nesciunt commodi ut enim cum minus ex.",
          "value": "bc2b3121-ee13-4efc-ab49-565351e40f4a"
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