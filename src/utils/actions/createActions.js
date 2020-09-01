const { createQueryBuilder } = require('typeorm')

class CreateActions {
  constructor (app) {
    this.app = app
  }

  fetchList ({ name }) {
    this.app.get(`/${name}`, async (req, res) => {
      const response = await createQueryBuilder(name).getMany()

      return res.send(response)
    })
  }

  fetchById ({ name }) {
    console.log('cheguei')
    this.app.get(`/${name}/:id`, async (req, res, next) => {
      const {
        params: { id }
      } = req

      const response = await createQueryBuilder(name).where(
        `${name}.uuid = :uuid`, { uuid: id }
      ).getOne()

      res.send(response || 'Não foi possivel encontrar nenhum usuario com este registro :(')
      next()

    })
  }
}

module.exports = CreateActions
