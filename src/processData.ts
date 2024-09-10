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

  const data: Data = {
    name: "",
    lastName: "",
    email: "",
    id: 0,
    matrix: {},
  };
  const arr: Set<string> = new Set();

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

  data.id = jsonData["id"];
  data.name = formatText(jsonData["თქვენი სახელი"]);
  data.lastName = formatText(jsonData["თქვენი გვარი"]);
  data.email = formatText(
    jsonData[
      "ელექტრონული ფოსტა (აუცილებელია მიუთითოთ ვალიდური სამსახურებრივი ელ-ფოსტის მისამართი, წინააღმდეგ შემთხვევაში კვლევის მოკლე ანგარიში ვერ გამოგეგზავნებათ)"
    ]
  );

  // for (const [schemaKey, schemaValue] of Object.entries(jsonData)) {
  //   const formattedInputKey: string = formatText(schemaKey);
  //   const formattedInputValue: string = formatText(schemaValue);
  //   arr.push(formattedInputKey);
  //   schemaJsonData.map((schemaObj) => {
  //     const schemaObjSchema = formatText(schemaObj.schema);

  //     if (formatText(schemaObjSchema) == formattedInputKey) {
  //       for (const [schemaObjKey, schemaObjValue] of Object.entries(
  //         schemaObj
  //       )) {
  //         const formatedSchemaObjKey = formatText(schemaObjKey);
  //         const formatedSchemaObjValue = formatText(schemaObjValue);
  //         if (formattedInputValue == formatedSchemaObjValue) {
  //           schemaScoresJsonData.map((schemaScoresObj) => {
  //             const schemaScoresObjSchema = formatText(schemaScoresObj.schema);
  //             // arr.push(schemaScoresObjSchema);
  //             //!correct
  //             // arr.push(formattedInputKey);
  //             if (formatText(schemaScoresObjSchema) == formattedInputKey) {
  //               for (const [
  //                 schemaScoresObjKey,
  //                 schemaScoresObjValue,
  //               ] of Object.entries(schemaScoresObj)) {
  //                 if (formatedSchemaObjKey == schemaScoresObjKey) {
  //                   data.matrix[schemaScoresObjSchema] = schemaScoresObjValue;
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //     }
  //   });
  // }
  for (const [schemaKey, schemaValue] of Object.entries(jsonData)) {
    const formattedInputKey: string = formatText(schemaKey);
    const formattedInputValue: string = formatText(schemaValue);
    arr.add(formattedInputKey); // Add to Set, ensures no duplicates

    for (const schemaObj of schemaJsonData) {
      const schemaObjSchema = formatText(schemaObj.schema);

      if (schemaObjSchema === formattedInputKey) {
        for (const [schemaObjKey, schemaObjValue] of Object.entries(
          schemaObj
        )) {
          const formattedSchemaObjKey = formatText(schemaObjKey);
          const formattedSchemaObjValue= formatText(schemaObjValue);

          if (formattedInputValue === formattedSchemaObjValue) {
            for (const schemaScoresObj of schemaScoresJsonData) {
              const schemaScoresObjSchema = formatText(schemaScoresObj.schema);

              if (schemaScoresObjSchema === formattedInputKey) {
                for (const [
                  schemaScoresObjKey,
                  schemaScoresObjValue,
                ] of Object.entries(schemaScoresObj)) {
                  if (formattedSchemaObjKey === schemaScoresObjKey) {
                    data.matrix[schemaScoresObjSchema] = schemaScoresObjValue;
                    arr.add(schemaScoresObjSchema); // Add to Set only if it's a valid match
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  const arrResult = Array.from(arr);
  return { arrResult, schemaJsonData, schemaScoresJsonData, jsonData, data };
}
export default getStructure;