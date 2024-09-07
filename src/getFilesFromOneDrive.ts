import { Client } from "@microsoft/microsoft-graph-client";
import msal from "@azure/msal-node";
import axios from "axios";
import xlsx from "xlsx";

import path from "path";
import { fileChecker, xlsxToJson, saver } from "./processXl";
interface JsonData {
  [key: string]: string | number;
}

const msalConfig = {
  auth: {
    clientId: "be9e4c90-962d-4740-9ed5-83d2d5d65233",
    authority: `https://login.microsoftonline.com/24ba79d5-27a3-4338-927d-fa67d687420c`,
    clientSecret: "2538Q~bJs1u_lsVBZ.yaUCKj3s2DjAz1cKre~dpi",
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

async function getAccessToken() {
  const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
  const token = authResponse && authResponse.accessToken;
  return token;
}

async function graphClient() {
  const accessToken = await getAccessToken();
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken); // First parameter takes an error if you can't get an access token.
    },
  });

  return client;
}

async function getUserId(userPrincipalName: string) {
  const client = await graphClient();
  const user = await client.api(`/users/${userPrincipalName}`).get();
  return user.id;
}

async function getFileFromDrive(filename: string) {
  const client = await graphClient();
  const userId = await getUserId("gogagoadze@gogagroup.onmicrosoft.com");

  const file = await client
    .api(`/users/${userId}/drive/root/children`)
    .select("id,name")
    .get();
  const files = file.value;
  const [fileObj] = files.filter((file: { id: string; name: string }) => {
    if (file.name === filename) {
      return file;
    }
  });

  const fileId = fileObj.id;

  const item = client.api(`/users/${userId}/drive/items/${fileId}/content`);

  async function fetchAndParseExcel() {
    const accessToken = await getAccessToken();

    const response = await axios({
      method: "GET",
      url: `https://graph.microsoft.com/v1.0/users/${userId}/drive/items/${fileId}/content`,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => console.log(error));

    // Convert the binary content to a buffer
    let workbook = xlsx.read(response?.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    // Get the worksheet data
    const worksheet = workbook.Sheets[sheetName];

    const json: JsonData[] = xlsx.utils.sheet_to_json(worksheet);

    return json;
  }
  return await fetchAndParseExcel();

}

export const getLastUsers = async () => {
  const allUsers: JsonData[] = await getFileFromDrive(
    "ბიზნეს პროცესების განვითარების ფაზების დიაგნოსტიკის კითხვარი.xlsx"
  );

  fileChecker("../assets/allUsersServer.xlsx", "allUsersServer");

  const directory = path.join(__dirname, "../assets/allUsersServer.xlsx");

  let workbook = xlsx.readFile(directory);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const allUsersServer: JsonData[] = xlsx.utils.sheet_to_json(worksheet);

  const lastUsers = allUsers.map((user: JsonData) => {
    const lastIndexOfServerUsers = allUsersServer.length - 1;
    const lastElementOfServerUsers: JsonData =
      allUsersServer[lastIndexOfServerUsers];


      if (
        user?.["Completion time"] > lastElementOfServerUsers?.["Completion time"]
 
      ) {
        return user;
      } else {
        return;
      }
  
  });

  const emptyArray: [] = [];

  if (allUsers.length !== 0) {
    saver(
      allUsers,
      "../assets/allUsersServer.xlsx",
      "allUsersServer",
      emptyArray
    );
  }

  return lastUsers;

};

export default getFileFromDrive;
