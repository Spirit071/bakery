import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crspirit8@gmail.com',
    pass: 'ierroylmretpjbvo'
  }
});

export default function sendMail(sub, con){
    const mailOptions = {
        from: 'crspirit8@gmail.com',
        to: 'sayagnathaniel@gmail.com',
        subject: sub,
        html: con
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
} 
