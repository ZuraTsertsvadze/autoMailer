import xlsx from "xlsx";
import path from "path";
import fs from "fs";

interface JsonData {
  [key: string]: string | number;
}


export const fileChecker=(directory:string,name:string)=>{
    const filePath = path.join(__dirname, directory);

    if (!fs.existsSync(filePath)) {
      const workbook = xlsx.utils.book_new();
  
      // Create a new worksheet (empty)
      const worksheet = xlsx.utils.aoa_to_sheet([]); // aoa_to_sheet([]) creates an empty sheet
  
      // Append the empty worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, name);
  
      xlsx.writeFile(workbook, filePath);
 
    }
}




export const xlsxToJson = (directory:string) => {

     const filePath=path.join(__dirname,directory );

    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON, using the first row as headers
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Save the JSON data to a file
    // fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
    console.log(jsonData);

    return jsonData;
};

const saver = (savedJson:any,directory:string,name:string,data:any) => {

  const newJson = [...savedJson, data];

  const ws = xlsx.utils.json_to_sheet(newJson);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, name);

    const filePath = path.join(__dirname, directory);
    xlsx.writeFile(wb, filePath);


};


export const saveAllUsers=(data:any)=>{
  fileChecker("../assets/allUsers.xlsx","allUsers")
  const savedJson = xlsxToJson("../assets/allUsers.xlsx");
  saver(savedJson,"../assets/allUsers.xlsx","allUsers",data)

}


export const saveClickedUsers=(data:any)=>{

  fileChecker("../assets/clickedUsers.xlsx","clickedUsers")
  const savedJson = xlsxToJson("../assets/clickedUsers.xlsx");
  saver(savedJson,"../assets/clickedUsers.xlsx","clickedUsers",data)


}


export const saveNotClickedUser=()=>{

}








