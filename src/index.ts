import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import chart from "./chart";
import emailSender from "./emailSender";
import { saveClickedUsers, saveNotClickedUser } from "./processXl";
import { getLastUsers, getFileFromDrive } from "./getFilesFromOneDrive";
import { graphApiEmailSender } from "./graphApiEmailSender";

import moment from "moment";
import "moment-msdate";

declare module "moment" {
  interface Moment {
    toOADate: () => number;
  }
}

import getStructure from "./processData";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

interface JsonData {
  [key: string]: string | number;
}

app.get("/", async (req: Request, res: Response) => {
  const lastUsers: JsonData[] | void = await getLastUsers().catch((error) =>
    console.log(error)
  );

  if (!lastUsers) return;

  lastUsers.forEach(async (user) => {
    if (!user) return;
    const scores = await getStructure(user).catch((error) =>
      console.log(error)
    );
    chart(scores);
    emailSender(scores).catch((error) => console.log(error));
    graphApiEmailSender(
      "gogagoadze@gogagroup.onmicrosoft.com",
      "chart.jpeg",
      "image/jpeg",
      "../assets/chart.jpeg",
      scores
    ).catch((error) => console.log(error));
  });

  res.send();
});

app.get("/tracking", (req, res) => {
  const { id, email, company } = req.query;

  const now = moment();

  const excelTime = now.toOADate();

  const clickedObject: any = {
    id: id,
    Email: email,
    company: company,
    "Completion time": excelTime,
  };

  saveClickedUsers(clickedObject);

  const actualUrl =
    "https://www.microsoft.com/en-us/microsoft-365/business/scheduling-and-booking-app";
  res.redirect(actualUrl);
  res.end();
});

app.get("/not", (req, res) => {
  saveNotClickedUser();

  res.end();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
