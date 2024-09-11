import nodemailer from "nodemailer";

// Mail gönderme fonksiyonu
export const sendRegisterMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Mail detayları
    const mailOptions = {
      from: `"YourApp Name" <${process.env.SMTP_FROM_EMAIL}>`, // Kimden
      to, // Kime
      subject, // Konu
      text, // Düz metin
      html, // React bileşeninden gelen HTML içeriği
    };

    // Maili gönder
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error(error.stack); // Hata izini de yazdır
  }
};
