import _prompt from "prompt";

const prompt = <TOption extends string = string>(
  question: string,
  options: TOption[] = []
): Promise<TOption> => {
  _prompt.message = "";
  _prompt.delimiter = " ::";

  const pattern = options.length ? new RegExp(options.join("|")) : undefined;

  return new Promise((resolve, reject) =>
    _prompt.get(
      {
        properties: {
          [question]: {
            type: "string",
            required: true,
            description: options.length
              ? `${question} (${[...options]})`
              : question,
            pattern,
          },
        },
      },

      (err, result) =>
        err ? reject(err) : resolve(result[question] as TOption)
    )
  );
};

export { prompt };
