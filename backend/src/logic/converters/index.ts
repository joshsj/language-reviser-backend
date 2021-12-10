import { Challenge, Word } from "@/common/entities";
import { random } from "@/common/utilities";
import { ActiveChallenge } from "../../data/entities";
import { Session } from "../../dependency";
import { adjectiveConverter } from "./adjective";
import { adverbConverter } from "./adverb";
import { verbConverter } from "./verb";

type Converter<T extends Word["type"]> = {
  inEnglish: (word: Extract<Word, { type: T }>, session: Session) => EverythingChallenge;

  inFrench: (word: Extract<Word, { type: T }>, session: Session) => EverythingChallenge;
};

type EverythingChallenge = Challenge & ActiveChallenge;

const converters: { [K in Word["type"]]: Converter<K> } = {
  adjective: adjectiveConverter,
  verb: verbConverter,
  adverb: adverbConverter,
};

const toEverythingChallenge = (word: Word, session: Session): EverythingChallenge => {
  const direction = !!random(1) ? "inEnglish" : "inFrench";

  return converters[word.type][direction](word as any, session);
};

const toActiveChallenge = ({ _id, answer, clientId }: EverythingChallenge): ActiveChallenge => ({
  _id,
  answer,
  clientId,
});

// Explicit to ensure properties like 'Answer' aren't exposed
const toChallenge = ({ hint, pre, post, context, challengeId, answerLength }: EverythingChallenge): Challenge => ({
  hint,
  pre,
  post,
  context,
  challengeId,
  answerLength,
});

export { Converter, toActiveChallenge, toChallenge, toEverythingChallenge };
