import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import chart from "./chart"
import emailSender from "./emailSender";
import processData from "./processData";
import {saveAllUsers,saveClickedUsers,saveNotClickedUser} from "./processXl";
import getFileFromDrive,{getLastUsers} from "./getFilesFromOneDrive";
import {sendMailWithGraph} from  "./sendChartCopyToCompany"

import { ConfidentialClientApplication, Configuration, LogLevel } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json())

interface Data {
  name: string;
  lastName: string;
  email: string;
  id: number | string;
  matrix: { [key: string]: string };
}



const data = {
  "id": "2",
  "submitTime": "9/2/2024 1:45:07 PM",
  "თქვენი სახელი": "ზაზა",
  "თქვენი გვარი": "ნოზაძე",
  "კომპანიის დასახელება": "zazagroup",
  "თანამშრომელთა რაოდენობა კომპანიაში": "2",
  "ელექტრონული ფოსტა (აუცილებელია მიუთითოთ ვალიდური სამსახურებრივი ელ-ფოსტის მისამართი, წინააღმდეგ შემთხვევაში კვლევის მოკლე ანგარიში ვერ გამოგეგზავნებათ)":
    "zazanozadze@gmail.com",
  "მოწოდებული ინფორმაცია დამუშავდება „პერსონალურ მონაცემთა დაცვის შესახებ“ საქართველოს კანონის შესაბამისად, წინამდებარე კითხვარიდან მიღებული ინფორმაციის ინტერპრეტაციისა და შედეგების ანგარიშის რესპონდენტი":
    "ვეთანხმები",
  "პროცესის საზღვრები":
    "თანამშრომლების/სტრუქტურული ერთეულების საქმიანობის საზღვრები ჩამოყალიბებულია, თუმცა მათ შორის ურთიერთქმედების წერტილები მკაფიოდ არ არის განსაზღვრული/სტანდარტიზებული.",
  "პროცესების აღწერილობები":
    "პროცესები ფრაგმენტულადაა დოკუმენტირებული და უმეტესწილად ასახავენ სტრუქტურული ერთეულების შიდა საქმიანობას.",
  "თამანშრომლების ფუნქციები და როლები":
    "თანამშრომელთა როლები და სამუშაოს დიზაინი დინამიურია და მაქსიმალურად ერგება გარემო ცვლილებებს. პროცესების გაუმჯობესების გუნდებში მონაწილეობა, საუკეთესო პრაქტიკების იდენტიფიცირება და გაზიარება თანამშრომელთა ერთ-ერთი ფორმალური ფუნქციაა.",
  "მომხმარებელზე ორიენტირებული ბიზნეს პროცესები":
    "კომპანიაში ერთმნიშვნელოვნად იდენტიფიცირებულია და ყველასთვის გასაგებია საკვანძო მომწოდებლები და მომხმარებელთა სეგმენტები. მომხმარებელთა საჭიროებების გათვალისწინება ხდება, თუმცა კომპანია უმეტესწილად მაინც ფოკუსირებულია შიდა საქმიანობაზე.",
  "პროცესების ინდიკატორები":
    "კომპანიაში ინდიკატორებით იზომება და ფასდება პროცესების შესრულება და შედეგები.",
  "მმართველობის როლი":
    "პროცესის მმართველი აქტიურად წაახალისებს გუნდის წევრებს, რათა მათ გამოცადონ ახალი იდეები და წვლილი შეიტანონ პროცესების უწყვეტ გაუმჯობესებაში. პროცესის მმართველი უწყვეტი გაუმჯობესების კულტურის ერთ-ერთი მთავარი შემოქმედია.",
  "გადაწყვეტილებების მიღების პრაქტიკები":
    "მნიშვნელოვანი გადაწყვეტილებები კომპანიაში უფრო მეტად მიიღება ხარისხობრივ შეფასებებზე დაყრდნობით, ვიდრე რაოდენობრივი მონაცემების საფუძველზე. ძირითადი გადაწყვეტილების მიმღები პირი დირექტორია, თუმცა გარკვეული გადაწყვეტილების დელეგირება, სიტუაციიდან გამომდინარე, ხდება მენეჯერებზე.",
  "პროცესების გაუმჯობესების პრაქტიკები":
    "კომპანიაში დანერგილია პროცესების განვითარების სისტემური მეთოდოლოგია და მიდგომა (მაგ. Lean, Six Sigma, Rummler Process Improvement Methodology და ა.შ.) გაუმჯობესების ღონისძიებების ეფექტიანობა ფასდება, რაოდენობრივი ინდიკატორებით კომპანიის სტრატეგიულ მიზნებთან და ამოცანებთან მიმართებაში.",
  "ინფორმაციული ტექნოლოგიები":
    "კომპანიის IT სისტემები ინტეგრირებულია. არსებული IT სისტემები პროცესების იდენტიფიცირების ანალიზის, მოდელირების და გაუმჯობესების უმნიშვნელოვანესი წყაროა.",
};

interface JsonData {
  [key: string]: string | number;
}



app.get("/",async (req: Request, res: Response) => {




//   const allUsers: JsonData[] = await getFileFromDrive(
//     "ბიზნეს პროცესების განვითარების ფაზების დიაგნოსტიკის კითხვარი.xlsx"
//   );

//  const scores=await getFileFromDrive('schema.xlsx')


//  const schemaScores=await getFileFromDrive('schemaScores.xlsx')

// saveAllUsers(data)
//  if(!req.body)return 
//   const data:Data|undefined=await processData(req.body)
const mad={
  "name": "ზაზა",
  "lastName": "ნოზაძე",
  "email": "2",
  "id": "2",
  "matrix": {
    "პროცესის საზღვრები": "2",
    "პროცესების აღწერილობები": "2",
    "თამანშრომლების ფუნქციები და როლები": "5",
    "მომხმარებელზე ორიენტირებული ბიზნეს პროცესები": "2",
    "პროცესების ინდიკატორები": "3",
    "მმართველობის როლი": "5",
    "გადაწყვეტილებების მიღების პრაქტიკები": "2",
    "პროცესების გაუმჯობესების პრაქტიკები": "4",
    "ინფორმაციული ტექნოლოგიები": "4"
  }
}

sendMailWithGraph()
// const gag:any=processData(data)
//   chart(mad);
//   emailSender(data).catch((e)=>console.log(e))
// console.log(req.body)
  res.send("Express + TypeScript Server")
});

// const clicks:any=[]
// console.log(clicks)
// const dataClicked:any={id:'2',email:"zaza@zoz.com",company:'zoro'}

app.get('/tracking', (req, res) => {
  const { id, email,company} = req.query;

  function unixToJulian(unixTimestamp: number) {
    const julianDateStart = 2440587.5;
    const milisecndInDay = 86400000;
    return julianDateStart + unixTimestamp / milisecndInDay;
  }

const twoWeeksBackInMiliseconds = Date.now()
const julianDate=unixToJulian(twoWeeksBackInMiliseconds)
const clickedObject:any={"id":id,"Email":email,"company":company,"Completion time":julianDate}
 

  const clickedJson=JSON.stringify(clickedObject)
  // console.log(clickedJson)
  saveNotClickedUser()
  // saveClickedUsers(clickedObject)
  // saveAllUsers(data)
  // Record the click event with email
  // clicks.push({ id, email, timestamp: new Date() });
  // console.log(clicks)
  // Redirect to the actual URL
  // const actualUrl = 'https://m.media-amazon.com/images/I/61zcSevCQ1L._AC_UF1000,1000_QL80_.jpg';
  // res.redirect(actualUrl);
  res.end()
});





app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});