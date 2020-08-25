const { build } = require('gluegun')

async function run (argv) {
  const cli = build()
    .brand('navpi')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'navpi-*', hidden: true })
    .help()
    .version()
    .create()

  const toolbox = await cli.run(argv)
  return toolbox
}

module.exports = { run }
