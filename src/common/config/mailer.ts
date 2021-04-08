import nodemailer = require("nodemailer");
  

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'dcrubiano01@gmail.com', // Pasar estas variables a entorno
      pass: 'hiqwphoqojecfoiw', // Pasar estas variables a entorno
    },
});

// tsctsknkrpfccrti

transporter.verify()
.then(() => {
    // console.log('Listo para enviar emails');
})
.catch(err => {
  console.log('Este es el error' + err);
});
