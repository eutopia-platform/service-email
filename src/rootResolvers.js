const knex = require('knex')({
  client: 'pg',
  version: '10.6',
  connection: {
    host: process.env.DATABASE_URL,
    database: process.env.DATABASE_NAME,
    user: 'service_mail',
    password: process.env.MAIL_DATABASE_PASSWORD
  }
})

export default {
  hello: () => 'hello there!'
}
