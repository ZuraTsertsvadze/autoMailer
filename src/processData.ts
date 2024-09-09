interface JsonData {
  [key: string]: string | number;
}

interface InfoStructure {
  [key: string]: { [key: string]: string | number };
}

interface Data {
  name: string;
  lastName: string;
  email: string;
  companyName:String;
  id: number | string;
  matrix: { [key: string]: string };
}







async function processData(jsonData: JsonData) {





  
  console.log(jsonData)

  const infoStructure: InfoStructure = {}

}
export default processData;
