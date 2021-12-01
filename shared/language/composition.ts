const Genders = ["masculine", "feminine"] as const;
type Gender = typeof Genders[number];

const Pluralities = ["singular", "plural"] as const;
type Plurality = typeof Pluralities[number];

const Subjects = ["je", "tu", "il", "nous", "vous", "ils"] as const;
type Subject = typeof Subjects[number];

const NounTypes = Object.freeze([
  "masculineSingular",
  "masculinePlural",
  "feminineSingular",
  "femininePlural",
] as const);
type NounType =
  // Intersect ensures correct implementation in array
  `${Gender}${Capitalize<Plurality>}` & typeof NounTypes[number];

export {
  Genders,
  Gender,
  Pluralities,
  Plurality,
  Subjects,
  Subject,
  NounTypes,
  NounType,
};
