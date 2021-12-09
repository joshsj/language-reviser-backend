import { Container } from "@/common/dependency/container";
import { Dependencies } from "../dependency";

const wrapLogger = (container: Container<Dependencies>) => {
  const log = container.resolve("logger") ?? (() => void 0);

  if (!log) {
    return () => void 0;
  }

  return (n: number, s: string) => log(`migration ${n} :: ${s}`);
};

// TODO: probably move into separate files
const migrate = async (container: Container<Dependencies>) => {
  const words = container.resolve("words");
  const activeChallenges = container.resolve("activeChallenges");
  const log = wrapLogger(container);

  if (!(words && activeChallenges)) {
    // TODO error handling
    return;
  }

  {
    log(1, "update words to ensure 'categories' field exists");

    const field = "categories";

    await words.updateMany(
      { [field]: { $exists: false } },
      { $set: { [field]: [] } }
    );
  }
};

export { migrate };
