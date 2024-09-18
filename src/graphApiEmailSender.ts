import path from "path";
import { graphClient, getUserId } from "./getFilesFromOneDrive";
import fs from "fs";

export async function graphApiEmailSender(
  companyEmail: string,
  fileName: string,
  type: string,
  directory: string,
  data: any
) {
  if (!data) return;
  const { email, name, lastName, company } = data;
  const client = await graphClient();
  const userId = await getUserId("gogagoadze@gogagroup.onmicrosoft.com").catch(
    (error) => console.log(error)
  );

  const filePath = path.resolve(__dirname, directory);

  const binary64FormatOfFile = fs.readFileSync(filePath, {
    encoding: "base64",
    flag: "r",
  });

  const emailBody = {
    message: {
      subject: `${email}  ${name} ${lastName}  ${company}`,
      body: {
        contentType: "Text",
        content: `${email}  ${name} ${lastName}  ${company}`,
      },
      toRecipients: [
        {
          emailAddress: {
            address: companyEmail,
          },
        },
      ],
      attachments: [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: fileName,
          contentType: type,
          contentBytes: binary64FormatOfFile,
        },
      ],
    },
    saveToSentItems: true,
  };

  const send = await client
    .api(`/users/${userId}/sendMail`)
    .select("id,name")
    .post(emailBody)
    .catch((error) => console.log(error));
}
