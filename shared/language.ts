const Genders = ["masculine", "feminine"] as const;
type Gender = typeof Genders[number];

const Pluralities = ["singular", "plural"] as const;
type Plurality = typeof Pluralities[number];

const Subjects = ["je", "tu", "il", "nous", "vous", "ils"] as const;
type Subject = typeof Subjects[number];

type VerbForms = { [K in Subject]: string };

/* 
  Note:
  Optional members are better defined with "| undefined" over "?",
  as it still requires a prop in the schema definition
*/

type BaseWord<TType extends string> = {
  type: TType;
  english: string;
  context: string | undefined
};

type Noun = BaseWord<"noun"> & { gender: Gender } & {
  [K in `${Gender}${Capitalize<Plurality>}`]: string;
};

type Verb = BaseWord<"verb"> & {
  infinitive: string;
  irregularForms: VerbForms | undefined;
};

type Word = Noun | Verb;

export {
  BaseWord,
  Word,
  Noun,
  Verb,
  Genders,
  Gender,
  Pluralities,
  Plurality,
  Subjects,
  Subject,
  VerbForms,
};
