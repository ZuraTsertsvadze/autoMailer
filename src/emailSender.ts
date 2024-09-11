import nodeMailer from "nodemailer";
import path from "path";

const transportOptions = {
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "gogagoadze@outlook.com",
    pass: "llpsgqgmzksfzzvx",
  },
  tls: {
    rejectUnauthorized: false // Optional, for self-signed certificates
  },
};

interface Data {
  name: string;
  lastName: string;
  email: string;
  company:string;
  id: number ;
  matrix: { [key: string]: number };
}

const emailSender = async (data: Data | undefined) => {
  if (!data) return;
  const { email, name, lastName, id,company } = data;

  const EmailContentHtml = `
<h1>კომპანიის შეფასება </h1>
<p>გამარჯობათ ბატონო ${name} აუდიტორული კომპანია შ.პ.ს "ჰერა" გიგზავნით თქვენი კომპანიის შეფასების შედეგებს</p>
<a href='http://localhost:3000/tracking?id=${id}&email=${email}&company=${company}'>Book visit with us</a>
`;

  const transporter = nodeMailer.createTransport(transportOptions);

  const info = await transporter.sendMail({
    from: "gaga <gogagoadze@outlook.com>",
    to: `${email}`,
    subject: "კომპანიის შეფასება",
    html: EmailContentHtml,
    attachments: [
      {
        filename: "chart.jpeg",
        path: path.join(__dirname, "../assets/chart.jpeg"),
      },
      {
        filename: "GEC PRESENTATION.pdf",
        path: path.join(__dirname, "../assets/GEC PRESENTATION.pdf"),
      },
    ],
  });

  console.log("Message sent" + info.messageId);
  console.log("Message rejected" + info.rejected);
  console.log("Message accepted" + info.accepted);
};

export default emailSender;
