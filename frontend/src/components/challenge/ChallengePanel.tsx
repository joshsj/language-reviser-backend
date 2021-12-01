import { Challenge } from "@shared/game";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import { Challenge as ChallengeUI, State } from "./Challenge";
import { Connection } from "../../connection";

const InitialChallengeCount = 3;

const ChallengePanel = defineComponent({
  name: "ChallengePanel",
  props: {
    connection: {
      type: Object as PropType<Connection>,
      required: true,
    },
  },
  setup: (props) => {
    const challenges = reactive<Challenge[]>([]);
    const stateTransitionTime = 250;
    const challengeState = ref<State | undefined>(undefined);

    const blink = (state: State) => {
      challengeState.value = state;
      setTimeout(() => (challengeState.value = undefined), stateTransitionTime);
    };

    const getChallenge = (n: number = 1) => {
      for (let i = 0; i < n; ++i) {
        props.connection.send({
          name: "newChallenge",
          body: {},
        });
      }
    };

    const currentChallenge = computed(() => challenges[0]);

    const handleAttempt = (attempt: string) =>
      props.connection.send({
        name: "attempt",
        body: { challengeId: currentChallenge.value!.challengeId, attempt },
      });

    const handleResult = (correct: boolean | "skip") => {
      blink(correct === true ? "good" : "bad");

      if (correct !== false) {
        challenges.shift();
        getChallenge();
      }
    };

    props.connection
      .onReceive("newChallenge", ({ body }) => {
        body && challenges.push(body);
      })
      .onReceive("attempt", ({ body }) => handleResult(body.result));

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
