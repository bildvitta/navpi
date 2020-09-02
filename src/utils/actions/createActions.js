const { createQueryBuilder } = require('typeorm')
const { request, response } = require('express')
const steroidsType = require('../steroidsType')

class CreateActions {
  constructor (app, models) {
    this.models = models
    this.app = app
  }

  fetchList ({ name }) {
    this.app.get(`/${name}`, async (request, response) => {
      const result = await createQueryBuilder(name).getMany()

      return response.json(steroidsType(this.models[name], result))
    })
  }

  fetchById ({ name }) {
    this.app.get(`/${name}/:id`, async (request, response) => {
      const {
        params: { id }
      } = request

      const result = await createQueryBuilder(name).where(
        `${name}.uuid = :uuid`, { uuid: id }
      ).getOne()

      return result ? response.json(result) : response.status(404).json({
        message: 'Não foi possivel encontrar alguém com esse identificador.'
      })
    })
  }

  create (entity) {
    this.app.post(`/${entity.name}`, async (request, response) => {
      const { uuid, ...required } = entity.columns

      const errors = {}
      let hasErrors = false

      for (const key in request.body) {
        if (!request.body[key]) {
          hasErrors = true
          errors[key] = 'Campo obrigatório'
        }
      }

      if (!hasErrors) {
        const result = (await createQueryBuilder()
          .insert()
          .into(entity.name)
          .values(request.body)
          .execute()
        )

        return response.status(200).json({
          status: {
            code: 200,
            text: "O item foi criado com sucesso!"
          }
        })
      }

      return response.status(400).json({
        status: {
          code: 400,
          text: 'O identificador com este item não existe!'
        }
      })
    })
  }

  update ({ name }) {
    this.app.put(`/${name}/:id`, async (request, response) => {
      const {
        body,
        params: { id }
      } = request

      const result = (await createQueryBuilder(name)
        .update()
        .set(body)
        .where(`${name}.uuid = :uuid`, { uuid: id })
        .execute()
      )

      response.status(200).json({
        status: {
          code: 200,
          text: 'Item atualizado com sucesso!'
        }
      })
    })
  }

  destroy ({ name }) {
    this.app.delete(`/${name}/:id`, async (request, response) => {
      const {
        params: { id }
      } = request

      const result = await createQueryBuilder(name)
        .delete()
        .where(`${name}.uuid = :uuid`, { uuid: id })
        .execute()

      response.status(200).json({
        status: {
          code: 200,
          text: 'Item deletado com sucesso!'
        }
      })
    })
  }
}

module.exports = CreateActions
