const nodemailer = require('nodemailer');

var mailquery = (dataobj) => {
    console.log('asdf',dataobj);
    return new Promise((resolve, reject) => {
                        


                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        // host: 'smtp.ethereal.email',
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: process.env.gmailuser, // generated ethereal user
                            pass: process.env.gmailpass // generated ethereal password
                        }
                    });

                    let htmlbody = `<b>Name : </b>${dataobj.fullname}<br/>
                                <b>Mobile : </b>${dataobj.mobile}<br/>
                                <b>Email : </b>${dataobj.email}<br/>
                                <b>Message : </b>${dataobj.message}<br/>
                                <b>Db Id : </b>${dataobj.id}<br/>`;
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"99Nearme Support" <99nearme@gmail.com>', // sender address
                        to: 'faisalkhanshah@gmail.com', // list of receivers
                        subject: 'Query ✔', // Subject line
                        // text: 'Hello world?', // plain text body
                        html: htmlbody // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                             reject(error);
                        }
                        else{
                            let res = {
                                info,
                                url:nodemailer.getTestMessageUrl(info)
                            }
                            resolve(res);
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                       
                        }

                    });
                });
    });
  }
  
  module.exports = {
  mailquery,

  }