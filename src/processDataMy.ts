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
  companyName: String;
  id: number | string;
  matrix: { [key: string]: string };
}

async function processData(user: JsonData, schema: any, schemaScores: any) {
  for (const [userKey, userValue] of Object.entries(user)){
    schema.map((schemaObjc: any) => {
      if (schemaObjc.schema === userKey) {
        for(const [schemaKey,schemaValue] of Object.entries(schemaObjc)){

          if (schemaValue===userValue) {

            console.log(userValue);


          }

        }
      
      
      }
    })
  }
}
export default processData;
