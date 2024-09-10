import getFileFromDrive from "./getFilesFromOneDrive";
interface JsonData {
  [key: string]: string | number;
}
async function getStructure(jsonData: JsonData) {
  interface Data {
    name: string;
    lastName: string;
    email: string;
    id: number | string;
    matrix: { [key: string]: string | number };
  }

  const data: any = {
    ...jsonData,
    matrix: {},
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
  for (const [schemaKey, schemaValue] of Object.entries(jsonData)) {
    const formattedInputKey: string = formatText(schemaKey);
    const formattedInputValue: string = formatText(schemaValue);
    schemaJsonData.map((schemaObj) => {
      const schemaObjSchema = formatText(schemaObj.schema);
      if (formatText(schemaObjSchema) == formattedInputKey) {
        for (const [schemaObjKey, schemaObjValue] of Object.entries(
          schemaObj
        )) {
          const formatedSchemaObjKey = formatText(schemaObjKey);
          const formatedSchemaObjValue = formatText(schemaObjValue);
          if (formattedInputValue == formatedSchemaObjValue) {
            schemaScoresJsonData.map((schemaScoresObj) => {
              const schemaScoresObjSchema = formatText(schemaScoresObj.schema);
              if (formatText(schemaScoresObjSchema) == formattedInputKey) {
                for (const [
                  schemaScoresObjKey,
                  schemaScoresObjValue,
                ] of Object.entries(schemaScoresObj)) {
                  if (formatedSchemaObjKey == schemaScoresObjKey) {
                    data.matrix[schemaScoresObjSchema] = schemaScoresObjValue;
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
