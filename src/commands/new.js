module.exports = {
  name: 'new',
  alias: ['n', 'create'],
  description: 'Creates a new naVpi application.',

  run: async toolbox => {
    const { filesystem, meta, parameters, print, prompt } = toolbox
    const [name] = parameters.array

    function breakLine () {
      print.info('')
    }

    if (!name) {
      return print.error('Please provide a valid project name.')
    }

    if (filesystem.exists(name)) {
      breakLine()
      print.error(`There is already a folder named ${name} here.`)

      const answer = await prompt.confirm('Do you want to overwrite it?')

      if (!answer) {
        breakLine()
        print.info(print.colors.muted('Exited.'))

        return null
      }

      filesystem.remove(name)
    }

    // Create the directory.
    filesystem.dir(name)

    // TODO: adicionar outros arquivos estruturais, por hora só está criando a pasta.

    // Done!
    breakLine()
    print.success(`Generated ${name} with naVpi v${meta.version()}.`)

    breakLine()
    print.info('Now, just:')
    print.info(`  $ cd ${name}`)
    print.info('  $ navpi serve')
    breakLine()
  }
}
