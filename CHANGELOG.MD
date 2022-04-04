# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.4.0 - 04-04-2022
### Adicionado
- Adicionado novo método `onSuccessSubmit` no utils `formatResponse.js`

### Modificado
- Alterado retorno nos métodos `create` e `update` do `controller.js`, retornando agora um objeto `{ result: {...}, status: { code: 200 } }`.

### Removido
- Removido alguns códigos inúteis dentro de `controller.js`.
