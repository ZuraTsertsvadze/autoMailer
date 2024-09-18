import { error } from "console";
import getFileFromDrive from "./getFilesFromOneDrive";
interface JsonData {
  [key: string]: string | number;
}
async function getStructure(jsonData: JsonData) {
  interface Data {
    name: string;
    lastName: string;
    email: string;
    company: string;
    CompletionTime: string;
    id: number;
    matrix: { [key: string]: number };
  }

  const data: Data = {
    name: "",
    lastName: "",
    email: "",
    company: "",
    CompletionTime: "",
    id: 0,
    matrix: {},
  };

  const reversScores = {
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 1,
  };

  const reverser = (number: number) => {
    const reversedScore = Object.entries(reversScores).flatMap((el, index) => {
      if (index + 1 === number) {
        return el[1];
      } else {
        return [];
      }
    });

    return reversedScore;
  };

  const questionNumber = 11;
  const elArray = Object.entries(jsonData);

  const lasElevenQuestions = elArray.slice(
    elArray.length - questionNumber,
    elArray.length
  ) as [string, string][];

  const scoresOfFive = lasElevenQuestions.slice(0, 5).map((question, index) => {
    return parseInt(question[1]);
  });

  const averigeOfFive =
    scoresOfFive.reduce((acc, current) => acc + current, 0) /
    scoresOfFive.length;

  const scoresFromFiveToLast = lasElevenQuestions
    .slice(5, lasElevenQuestions.length)
    .map((question) => {
      return parseInt(question[1]);
    });

  const averigeFromFiveToLast =
    scoresFromFiveToLast.reduce((acc, current) => acc + current, 0) /
    scoresFromFiveToLast.length;

  const reversedFour = reverser(parseInt(lasElevenQuestions[3][1]))[0];
  const reversedTen = reverser(parseInt(lasElevenQuestions[9][1]))[0];

  const schemaJsonData = await getFileFromDrive("schema.xlsx");
  const schemaScoresJsonData = await getFileFromDrive("schemaScores.xlsx");

  const scoresFromSchema = schemaScoresJsonData
    .flatMap((el) => {
      return Object.values(el);
    })
    .filter((el, index) => typeof el !== "string" && el) as number[];

  const maxScore = Math.max(...scoresFromSchema);

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
              const schemaScoresObjSchema = formatText(schemaScoresObj.schema);
              if (formatText(schemaScoresObjSchema) === formattedInputKey) {
                for (const [
                  schemaScoresObjKey,
                  schemaScoresObjValue,
                ] of Object.entries(schemaScoresObj)) {
                  if (formatedSchemaObjKey === schemaScoresObjKey) {
                    data.matrix[schemaScoresObjSchema] =
                      schemaScoresObjValue as number;
                  }
                }
              }
            });
          }
        }
      }
    });
  }
  return {
    ...data,
    averigeOfFive: averigeOfFive,
    averigeFromFiveToLast: averigeFromFiveToLast,
    reversedFour: reversedFour,
    reversedTen: reversedTen,
    maxScore: maxScore,
  };
}
export default getStructure;
