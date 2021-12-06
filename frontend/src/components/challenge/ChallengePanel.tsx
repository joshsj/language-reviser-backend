import { Container } from "@/common/dependency/container";
import { Challenge } from "@/common/entities";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import { Dependencies } from "../../dependency";
import { Challenge as ChallengeUI, State } from "./Challenge";

const InitialChallengeCount = 3;

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
    const challengeState = ref<State | undefined>(undefined);

    const blink = (state: State) => {
      challengeState.value = state;
      setTimeout(() => (challengeState.value = undefined), stateTransitionTime);
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

    const handleResult = (correct: boolean | "skip") => {
      blink(correct === true ? "good" : "bad");

      if (correct !== false) {
        correct === "skip" &&
          messenger.publish({
            name: "skip",
            message: { challengeId: currentChallenge.value!.challengeId },
          });

        challenges.shift();
        getChallenge();
      }
    };

    messenger
      .subscribe(
        "newChallenge",
        ({ message }) => message && challenges.push(message)
      )
      .subscribe("attempt", ({ message }) => handleResult(message.result));

    getChallenge(InitialChallengeCount);

    return () => (
      <div>
        {currentChallenge.value ? (
          <ChallengeUI
            challenge={currentChallenge.value}
            state={challengeState.value}
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
