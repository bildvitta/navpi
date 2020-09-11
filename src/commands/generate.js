const model = {
  alias: ['m'],

  generate ({ name, fields, fileType }) {
    return {
      template: `model.${fileType}.ejs`,
      target: `models/${name}.${fileType}`,
      props: { fields }
    }
  }
}

const profiles = { model }

module.exports = {
  name: 'generate',
  alias: ['g', 'gen'],

  run: async toolbox => {
    const {
      parameters,
      print,
      template
    } = toolbox

    const optionsType = parameters.options.type || parameters.options.t || 'yml'

    const fileTypes = {
      js: ['javascript', 'js', 'jscript', 'script'],
      json: ['json'],
      yml: ['yaml', 'yml']
    }
    
    const fileKeys = Object.keys(fileTypes)
    const fileType = fileKeys.find(key => fileTypes[key].includes(optionsType))
    
    if (!fileType) {
      return print.error(
        `The '${optionsType}' is not supported, please use: ${fileKeys.join(', ')}.`
      )
    }

    // TODO: verificar existencia de um arquivo com o mesmo nome (mesmo que em outro formato e questionar sobre sua substituição.)

    const [type, name, ...fields] = parameters.array.map(
      item => item.toLowerCase()
    )

    const key = Object.keys(profiles).find(profile =>
      [profile, ...(profiles[profile].alias || [])].includes(type)
    )

    if (!key) {
      return print.error(`Generator '${type}' not found.`)
    }

    const profile = profiles[key]
    const spinner = print.spin(`Generating ${key}...`)

    try {
      const options = profile.generate({ name, fields, fileType })
      await template.generate(options)

      spinner.succeed(`Successfully generated ${key} at ${options.target}.`)
    } catch (error) {
      spinner.fail(`Error generating ${key}.`)
    }
  }
}
