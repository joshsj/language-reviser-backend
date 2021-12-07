const Genders = ["masculine", "feminine"] as const;
type Gender = typeof Genders[number];

const Pluralities = ["singular", "plural"] as const;
type Plurality = typeof Pluralities[number];

const Subjects = ["je", "tu", "il", "nous", "vous", "ils"] as const;
type Subject = typeof Subjects[number];

const AdjectiveTypes = Object.freeze([
  "masculineSingular",
  "masculinePlural",
  "feminineSingular",
  "femininePlural",
] as const);
type AdjectiveType =
  // Intersect ensures correct implementation in array
  `${Gender}${Capitalize<Plurality>}` & typeof AdjectiveTypes[number];

export {
  Genders,
  Gender,
  Pluralities,
  Plurality,
  Subjects,
  Subject,
  AdjectiveTypes,
  AdjectiveType,
};
