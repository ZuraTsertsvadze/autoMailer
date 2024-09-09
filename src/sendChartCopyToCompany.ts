import path from "path";
import { graphClient, getUserId } from "./getFilesFromOneDrive";
import fs from "fs";

export async function sendMailWithGraph() {
  const client = await graphClient();
  const userId = await getUserId("gogagoadze@gogagroup.onmicrosoft.com");

  const filePath = path.resolve(__dirname, "../assets/chart.jpeg");

  const binary64FormatOfFile = fs.readFileSync(filePath,{ encoding: 'base64', flag: 'r' },);


  const emailBody = {
    message: {
      subject: "ae  ari ari ari?",
      body: {
        contentType: "Text",
        content: "The new cafeteria is open.",
      },
      toRecipients: [
        {
          emailAddress: {
            address: "gogagoadze@gogagroup.onmicrosoft.com",
          },
        },
      ],
      attachments: [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "chart.jpeg",
          contentType: "image/jpeg",
          contentBytes: binary64FormatOfFile
        },
      ],
      
    },
saveToSentItems: true
  };
 
  // console.log(binary64FormatOfFile)
  const send = await client
    .api(`/users/${userId}/sendMail`)
    .select("id,name")
    .post(emailBody);


}
