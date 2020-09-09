# navpi CLI

A CLI for create dynamic mocks for [steroids](https://github.com/bildvitta/quasar-app-extension-steroids).

## Install
`npm i navpi`

## Usage

Inside your project you will create a folder for your API mock (can be outside the project too).

> - navpi new `[folder-name]`
	* ex: `navpi new api` (will create a folder named `api`).
- inside `api` folder: `navpi [g | generate] [m | model] [model-name] [field:type] [field:type]...`
	* ex: `navpi g m posts name:text email:text`;
	* ex: `navpi generate model users name email phone`;
	* the default `type` for `field` is `text` check [here](https://github.com/bildvitta/api) all types avaliables.

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
