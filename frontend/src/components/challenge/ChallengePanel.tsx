import { AnswerStatus } from "@/common/dependency";
import { Container } from "@/common/dependency/container";
import { Challenge } from "@/common/entities";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import { Dependencies } from "../../dependency";
import { Challenge as ChallengeUI } from "./Challenge";

const InitialChallengeCount = 3;
type TrafficLight = "red" | "orange" | "green";

const ChallengePanel = defineComponent({
  name: "ChallengePanel",

  props: {
    container: {
      type: Object as PropType<Container<Dependencies>>,
      required: true,
    },
  },

  setup: (props) => {
    const messenger = props.container.resolve("messenger");

    // TODO: better handling
    if (!messenger) {
      return;
    }

    const challenges = reactive<Challenge[]>([]);
    const stateTransitionTime = 250;
    const challengeColor = ref<TrafficLight | undefined>(undefined);

    const blink = (color: TrafficLight) => {
      challengeColor.value = color;
      setTimeout(() => (challengeColor.value = undefined), stateTransitionTime);
    };

    const getChallenge = (n: number = 1) => {
      for (let i = 0; i < n; ++i) {
        messenger.publish({
          name: "newChallenge",
          message: {},
        });
      }
    };

    const currentChallenge = computed(() => challenges[0]);

    const handleAttempt = (attempt: string) =>
      messenger.publish({
        name: "attempt",
        message: { challengeId: currentChallenge.value!.challengeId, attempt },
      });

    const handleResult = (answer: AnswerStatus | "skip") => {
      console.log(answer);

      const blinkColor: { [K in typeof answer]: TrafficLight } = {
        correct: "green",
        close: "orange",
        incorrect: "red",
        skip: "red",
      };

      blink(blinkColor[answer]);

      if (answer === "incorrect" || answer === "close") {
        return;
      }

      if (answer === "skip") {
        messenger.publish({
          name: "skip",
          message: { challengeId: currentChallenge.value!.challengeId },
        });
      }

      challenges.shift();
      getChallenge();
    };

    messenger
      .subscribe("newChallenge", ({ message }) => challenges.push(message))
      .subscribe("attempt", ({ message }) => handleResult(message.result))
      // TODO: add UI for answer
      .subscribe("skip", ({ message }) => alert(message.answer));

    getChallenge(InitialChallengeCount);

    return () => (
      <div>
        {currentChallenge.value ? (
          <ChallengeUI
            challenge={currentChallenge.value}
            stateColor={challengeColor.value}
            stateTransitionTime={stateTransitionTime}
            onAttempt={handleAttempt}
            onSkip={() => handleResult("skip")}
          />
        ) : (
          "No words found 🤔"
        )}
      </div>
    );
  },
});

export { ChallengePanel };
