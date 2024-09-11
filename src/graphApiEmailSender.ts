import path from "path";
import { graphClient, getUserId } from "./getFilesFromOneDrive";
import fs from "fs";

export async function graphApiEmailSender(email:string,name:string,type:string,directory:string) {
  const client = await graphClient();
  const userId = await getUserId("gogagoadze@gogagroup.onmicrosoft.com");

  const filePath = path.resolve(__dirname, directory);

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
            address: email,
          },
        },
      ],
      attachments: [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name:name, 
          contentType: type,
          contentBytes: binary64FormatOfFile
        },
      ],
      
    },
  saveToSentItems: true
  };
 
 
  const send = await client
    .api(`/users/${userId}/sendMail`)
    .select("id,name")
    .post(emailBody);


}


