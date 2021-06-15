const Ajv = require('ajv')
const schema_user = require('./user_schema')
const ajv = exports.ajv = new Ajv()
ajv.addSchema(schema_user, 'user')