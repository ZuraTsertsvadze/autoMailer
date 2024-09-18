import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { graphApiEmailSender } from "./graphApiEmailSender";
import moment from "moment";
import "moment-msdate";
import { name } from "@azure/msal-node/dist/packageMetadata";

declare module "moment" {
  interface Moment {
    toOADate: () => number;
  }
}

interface JsonData {
  [key: string]: string | number;
}

export const fileChecker = (directory: string, name: string) => {
  const filePath = path.join(__dirname, directory);

  if (!fs.existsSync(filePath)) {
    const workbook = xlsx.utils.book_new();

    // Create a new worksheet (empty)
    const worksheet = xlsx.utils.aoa_to_sheet([]); // aoa_to_sheet([]) creates an empty sheet

    // Append the empty worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, name);

    xlsx.writeFile(workbook, filePath);
  }
};

export const xlsxToJson = (directory: string) => {
  const filePath = path.join(__dirname, directory);

  const workbook = xlsx.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON, using the first row as headers
  const jsonData: JsonData[] = xlsx.utils.sheet_to_json(worksheet);

  // Save the JSON data to a file
  // fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2));

  return jsonData;
};

export const saver = (
  savedJson: any,
  directory: string,
  name: string,
  data: any
) => {
  const newJson = [savedJson, data].flat();

  const ws = xlsx.utils.json_to_sheet(newJson);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, name);

  const filePath = path.join(__dirname, directory);
  xlsx.writeFile(wb, filePath);
};

export const saveAllUsers = (data: any) => {
  fileChecker("../assets/allUsers.xlsx", "allUsers");
  const savedJson = xlsxToJson("../assets/allUsers.xlsx");
  saver(savedJson, "../assets/allUsers.xlsx", "allUsers", data);
};

export const saveClickedUsers = (data: any) => {
  fileChecker("../assets/clickedUsers.xlsx", "clickedUsers");
  const savedJson = xlsxToJson("../assets/clickedUsers.xlsx");

  saver(savedJson, "../assets/clickedUsers.xlsx", "clickedUsers", data);
};

export const saveNotClickedUser = () => {
  const allUsersServerJson = xlsxToJson("../assets/allUsersServer.xlsx");

  const now = moment();

  const excelTimeTwoWeeksBack = now.toOADate() - 14;

  const usersOfTwoWeeksServer = allUsersServerJson.map((user) => {
    if ((user?.["Completion time"] as number) >= excelTimeTwoWeeksBack) {
      return user;
    }
  });

  const clickedUsersJson = xlsxToJson("../assets/clickedUsers.xlsx");

  const usersOfTwoWeeksClicked = clickedUsersJson.map((user) => {
    if ((user?.["Completion time"] as number) >= excelTimeTwoWeeksBack) {
      return user;
    }
  });

  const clickedUsers = usersOfTwoWeeksClicked.map((clickedUser) => {
    return clickedUser?.Email;
  });

  const notClickedUsers = usersOfTwoWeeksServer.flatMap((user) => {
    const email =
      user?.[
        "ელექტრონული ფოსტა (აუცილებელია მიუთითოთ ვალიდური სამსახურებრივი ელ-ფოსტის მისამართი, წინააღმდეგ შემთხვევაში კვლევის მოკლე ანგარიში ვერ გამოგეგზავნებათ)"
      ];
    if (!clickedUsers.includes(email)) {
      return {
        email: email,
        company: user?.["კომპანიის დასახელება"],
        name: user?.["თქვენი სახელი"],
        lastName: user?.["თქვენი გვარი"],
        id: user?.Id,
      };
    }
    return [];
  });

  fileChecker("../assets/notClickedUsers.xlsx", "notClickedUsers");

  saver(
    [],
    "../assets/notClickedUsers.xlsx",
    "notClickedUsers",
    notClickedUsers
  );

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  const data = {
    email: "gogagoadze@outlook.com",
    company: "",
    name: "notclickeduser",
    lastName: `${formattedDate}`,
    id: "",
  };

  graphApiEmailSender(
    "gogagoadze@gogagroup.onmicrosoft.com",
    "notClickedUsers.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "../assets/notClickedUsers.xlsx",
    data
  );
};
