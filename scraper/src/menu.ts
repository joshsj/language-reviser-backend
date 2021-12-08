import _prompt from "prompt";

_prompt.message = "";
_prompt.delimiter = " ::";
_prompt.colors = false;

const Optionality = ["required", "optional"] as const;
type Optionality = typeof Optionality[number];

const prompt = <TOption = string, TRequired extends Optionality = "required">(
  question: string,
  required: TRequired,
  options: ReadonlyArray<TOption> = [],
  type: Revalidator.Types | Revalidator.Types[] = "string"
): Promise<TRequired extends "required" ? TOption : TOption | undefined> => {
  const [description, pattern] = options.length
    ? [`${question} [${options.join(", ")}]`, new RegExp(options.join("|"))]
    : [question];

  return new Promise((resolve, reject) =>
    _prompt.get(
      {
        properties: {
          [question]: {
            type,
            description,
            pattern,
            required: required === "required",
          },
        },
      },

      (err, result) =>
        err ? reject(err) : resolve(result[question] as TOption)
    )
  );
};

const yesNo = (question: string = "okay?") =>
  prompt<"y" | "n">(question, "required", ["y", "n"]);

const collect = async <TOption extends string, TDone extends string>(
  question: string,
  options: ReadonlyArray<TOption> = [],
  done: TDone
): Promise<TOption[]> => {
  const loop = () =>
    prompt<TOption | TDone>(question, "required", [...options, done]);

  const values: TOption[] = [];

  while (true) {
    const result = await loop();

    if (!result || result === done) {
      break;
    }

    // breaking on result === done means
    // result will only be TOptions
    values.push(result as TOption);
  }

  return values;
};

export { prompt, yesNo, collect, Optionality };
