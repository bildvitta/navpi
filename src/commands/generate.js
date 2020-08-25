const model = {
  alias: ['m'],

  generate ({ name, fields }) {
    return {
      template: 'model.yml.ejs',
      target: `models/${name}.yml`,
      props: { fields }
    }
  }
}

const profiles = { model }

module.exports = {
  name: 'generate',
  alias: ['g', 'gen'],

  run: async toolbox => {
    const { parameters, print, template } = toolbox

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
      const options = profile.generate({ name, fields })
      await template.generate(options)

      spinner.succeed(`Successfully generated ${key} at ${options.target}.`)
    } catch (error) {
      spinner.fail(`Error generating ${key}.`)
    }
  }
}
