const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  let info = await transporter.sendMail({
    from: '"Hi 👻" <abc@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;










// const nodemailer =require('nodemailer')
// const asyncHandler = require("express-async-handler")



// const sendEmail = asyncHandler(async(data, req, res) => {
// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: process.env.MAIL_ID,  // Corrige aquí
//     pass: process.env.MP,    
// },
// });
      
//       // async..await is not allowed in global scope, must use a wrapper

//         // send mail with defined transport object
// let info = await transporter.sendMail({
//   from: '"Hi 👻" <abc@gmail.com>', // sender address
//   to: data.to, // list of receivers
//   subject: data.subject, // Subject line
//   text: data.text, // plain text body
//   html: data.html, // html body
// });
      
//         console.log("Message sent: %s", info.messageId);
// 				console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// });


// module.exports = sendEmail;