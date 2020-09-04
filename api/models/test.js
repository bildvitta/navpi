const field = {
  fields: [
    {
      name: 'name',
      type: 'text',
      __value: '{{name.firstName}} {{name.lastName}}'
    },
    
    {
      name: 'email',
      type: 'text',
      __value: '{{internet.email}}'
    }
  ],

  metadata: {
    title: 'Testando',

    requestHeaders ({ request }) {
      return request.headers
    }
  }
}

module.exports = field