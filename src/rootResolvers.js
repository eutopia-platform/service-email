const nodemailer = require('nodemailer')

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_SENDER_ADDRESS,
    pass: process.env.MAIL_SENDER_PASSWORD
  }
})

const dbSchema = 'sc_mail'
const select = async (cond, table) => await knex.select().withSchema(dbSchema).from(table).where(cond)
const selectSingle = async (cond, table) => await select(cond, table) |> (_ => #.length ?#[0] : null) ()

export default {
  hello: () => 'hello there!',

  sendEmail: async ({sender, receiver, subject, text, html}, context) => {
    const auth = context.headers.auth
    if (!auth || auth !== process.env.MAIL_SERVICE_PASSWORD)
      throw Error('UNAUTHORIZED')

    await transporter.sendMail({
      from: (sender ? `"${sender}" ` : '') + process.env.MAIL_SENDER_ADDRESS,
      to: receiver,
      subject: subject,
      text: text,
      ...html && { html }
    })
  },

  subscribeNews: async({email}) => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(String(email).toLowerCase()))
        throw Error('INVALID_EMAIL')
    
    if (await selectSingle({email}, 'news'))
      throw Error('ALREADY_SUBSCRIBED')
    await knex.withSchema(dbSchema).into('news').insert({email})

    await transporter.sendMail({
      from: process.env.MAIL_SENDER_ADDRESS,
      to: email,
      subject: 'Welcome to Productcube 🚀',
      text: `Hello,
Thanks for signing up to the Productcube newsletter!

If you haven't yet created an account, you can do so at https://productcube.io/onboarding/

See you soon!`,
      html: `<p>Hello,<br>
Thanks for signing up to the Productcube newsletter!<br>
If you haven't yet created an account, you can do so <a href="https://productcube.io/onboarding/">here</a>.<br>
See you soon!</p>`
    })
  }
}
