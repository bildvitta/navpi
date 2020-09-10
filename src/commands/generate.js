const model = {
  alias: ['m'],

  generate ({ name, fields }, templateType = 'yml') {
    return {
      template: `model.${templateType}.ejs`,
      target: `models/${name}.${templateType}`,
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

    let { type: templateType } = parameters.options

    const avaliableTypes = ['javascript', 'js', 'yml', 'json']

    if (templateType && !avaliableTypes.includes(templateType)) {
      return print.error(
        `type: "${templateType}" is not supported, the avaliable types are: javascript * js * json * yml`
      )
    }

    templateType = templateType === 'javascript' ? 'js' : templateType

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
      const options = profile.generate({ name, fields }, templateType)
      await template.generate(options)

      spinner.succeed(`Successfully generated ${key} at ${options.target}.`)
    } catch (error) {
      spinner.fail(`Error generating ${key}.`)
    }
  }
}
