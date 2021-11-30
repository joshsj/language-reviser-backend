import { Challenge } from "@shared/game";
import { defineComponent, PropType, reactive, ref } from "vue";
import { Challenge as ChallengeUI, State } from "./components/Challenge";
import { Connection } from "./connection";

const InitialChallengeCount = 3;

const App = defineComponent({
  name: "App",
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
          body: undefined,
        });
      }
    };

    const handleAttempt = (attempt: string) =>
      props.connection.send({
        name: "attempt",
        body: {
          attempt,
          // TODO: update to answer id
          actual: challenges[0]!.answer,
        },
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
        challenges.push(body);
      })
      .onReceive("attempt", ({ body }) => handleResult(body.result));

    getChallenge(InitialChallengeCount);

    return () => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChallengeUI
          challenge={challenges[0]}
          state={challengeState.value}
          stateTransitionTime={stateTransitionTime}
          onAttempt={handleAttempt}
          onSkip={() => handleResult("skip")}
        />
      </div>
    );
  },
});

export { App };
