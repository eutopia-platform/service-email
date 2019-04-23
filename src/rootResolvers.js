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

export default {
  hello: () => 'hello there!',

  sendEmail: async ({sender, receiver, subject, text, html}, context) => {
    const auth = context.headers.auth
    if (!auth || auth !== process.env.MAIL_SERVICE_PASSWORD)
      throw Error('UNAUTHORIZED')
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_SENDER_ADDRESS,
        pass: process.env.MAIL_SENDER_PASSWORD
      }
    })

    let info = await transporter.sendMail({
      from: (sender ? `"${sender}" ` : '') + process.env.MAIL_SENDER_ADDRESS,
      to: receiver,
      subject: subject,
      text: text,
      ...html && { html }
    })
  }
}
