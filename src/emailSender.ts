import { error } from "console";
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
    rejectUnauthorized: false, // Optional, for self-signed certificates
  },
};

interface Data {
  name: string;
  lastName: string;
  email: string;
  company: string;
  id: number;
  matrix: { [key: string]: number };
  averigeOfFive: number;
  averigeFromFiveToLast: number;
  reversedFour: number;
  reversedTen: number;
}

const emailSender = async (data: Data | undefined | void) => {
  if (!data) return;
  const {
    email,
    name,
    lastName,
    id,
    company,
    averigeOfFive,
    averigeFromFiveToLast,
    reversedFour,
    reversedTen,
  } = data;

  const matrixAverige =
    Object.entries(data.matrix)
      .map((matrixElement, index) => matrixElement[1])
      .reduce((acc, current) => acc + current, 0) /
    Object.entries(data.matrix).length;
  const matrixAverageFormatted = !Number.isInteger(matrixAverige)
    ? matrixAverige.toFixed(1)
    : matrixAverige;
  const averageOfFiveFormatted = !Number.isInteger(averigeOfFive)
    ? averigeOfFive.toFixed(1)
    : averigeOfFive;
  const averigeFromFiveToLastFormatted = !Number.isInteger(
    averigeFromFiveToLast
  )
    ? averigeFromFiveToLast.toFixed(1)
    : averigeFromFiveToLast;

  const EmailContentHtml = `
<img alt="companyLogo" src="cid:unique@companyLogo.png" width="400px">
<h1 style="margin-top: 20px">მოგესალმებით ${name},</h1>
<div style="margin-top: 10px">დიდი მადლობა დაინტერესებისთვისა და მონაწილეობისთვის.</div>
<div style="margin-top: 10px">გიგზავნით თქვენს შედეგებს და მათი განმარტების მოკლე აღწერას თანდართულ ფაულად.</div>
<div style="margin-top: 10px">ბიზნეს პროცესების მართვის საშუალო დონე:  ${matrixAverageFormatted}</div>
<div style="margin-top: 10px">კომპანაში არსებული შიდა კომუნიკაციის საშუალო დონე:  ${averageOfFiveFormatted}</div>
<div style="margin-top: 10px">კომპანიაში არსებული სტარუტურულ ურთიერთობებს შორის კონფლიქტის საშუალო დონე:  ${averigeFromFiveToLastFormatted}</div>
<img alt="chartImage" src="cid:unique@chart.jpeg" style="margin-top: 10px">
<div style="margin-top: 20px">შედეგების დამატებითად განხილვის სურვილის შემთხვევაში, მოხარული ვიქნებით ჩანიშნოთ 
30-წუთიანი ონლაინ შეხვედრა<br> ჩვენს გუნდთან თქვენთვის ხელსაყრელ დროს. 
შეხვედრის ჩანიშვნა შეგიძლია მოცემული  ლინკით: <a href='http://localhost:3000/tracking?id=${id}&email=${email}&company=${company}'>ლინკი</a></div>
<div style="margin-top: 10px">გისურვებთ წარმატებას.</div>
<div  style="margin-top: 10px">გიორგი სიმონგულაშვილი</div>
<div>GEC-ის ბიზნეს განვითარების გუნდი</div>
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
        cid: "unique@chart.jpeg",
      },
      {
        filename: "GEC PRESENTATION.pdf",
        path: path.join(__dirname, "../assets/GEC PRESENTATION.pdf"),
      },
      {
        filename: "companyLogo.png",
        path: path.join(__dirname, "../assets/companyLogo.png"),
        cid: "unique@companyLogo.png",
      },
    ],
  });

  console.log("Message sent" + info.messageId);
  console.log("Message rejected" + info.rejected);
  console.log("Message accepted" + info.accepted);
};

export default emailSender;
