import getFileFromDrive from "./getFilesFromOneDrive";
interface JsonData {
  [key: string]: string | number;
}
async function getStructure(jsonData: JsonData) {
  interface Data {
    name: string,
    lastName:string,
    email: string,
    company:string,
    CompletionTime:string,
    id: number,
    matrix: { [key: string]: number };
  }

  const data:Data = {
    name: "",
    lastName: "",
    email: "",
    company:"",
    CompletionTime:"",
    id: 0,
    matrix: {} ,
  };

  const schemaJsonData = await getFileFromDrive("schema.xlsx");
  const schemaScoresJsonData = await getFileFromDrive("schemaScores.xlsx");

  function formatText(text: string | number): string {
    if (typeof text === "string") {
      return text
        .replace(/[\n\r]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    return toString();
  }

  data.id = jsonData["Id"] as number;
  data.name = formatText(jsonData["თქვენი სახელი"]);
  data.lastName = formatText(jsonData["თქვენი გვარი"]);
  data.company = formatText(jsonData["კომპანიის დასახელება"]);
  data.email = formatText(
    jsonData[
      "ელექტრონული ფოსტა (აუცილებელია მიუთითოთ ვალიდური სამსახურებრივი ელ-ფოსტის მისამართი, წინააღმდეგ შემთხვევაში კვლევის მოკლე ანგარიში ვერ გამოგეგზავნებათ)"
    ]
  );

  for (const [schemaKey, schemaValue] of Object.entries(jsonData)) {
    const formattedInputKey: string = formatText(schemaKey);
    const formattedInputValue: string = formatText(schemaValue);
    schemaJsonData.map((schemaObj) => {
      const schemaObjSchema = formatText(schemaObj.schema);
      if (formatText(schemaObjSchema) === formattedInputKey) {
        for (const [schemaObjKey, schemaObjValue] of Object.entries(
          schemaObj
        )) {
          const formatedSchemaObjKey = formatText(schemaObjKey);
          const formatedSchemaObjValue =
            typeof schemaObjValue === "string" && formatText(schemaObjValue);
          if (formattedInputValue === formatedSchemaObjValue) {
            schemaScoresJsonData.map((schemaScoresObj) => {
              const schemaScoresObjSchema=formatText(schemaScoresObj.schema);
              if (formatText(schemaScoresObjSchema) === formattedInputKey) {
                for (const [
                  schemaScoresObjKey,
                  schemaScoresObjValue,
                ] of Object.entries(schemaScoresObj)) {
          
                  if (formatedSchemaObjKey === schemaScoresObjKey) {
                    data.matrix[schemaScoresObjSchema] = schemaScoresObjValue as number;
                  }
                }
              }
            });
          }
        }
      }
    });
  }
  return data;
}
export default getStructure;
