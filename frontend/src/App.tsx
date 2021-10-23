import { Challenge } from "@shared/game";
import { defineComponent, PropType, reactive, ref } from "vue";
import { Challenge as ChallengeUI, State } from "./components/Challenge";
import { Connection } from "./connection";

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

    const nextChallenge = () => {
      challenges.shift();
      props.connection.send({ name: "newChallenge", categories: ["verb"] });
    };

    const handleAttempt = (attempt: string) =>
      props.connection.send({
        name: "attempt",
        attempt,
        // TODO: update to answer id
        actual: challenges[0]!.answer,
      });

    props.connection
      .onReceive("newChallenge", (c) => challenges.push(c))
      .onReceive("attempt", ({ result }) => {
        blink(result === "correct" ? "good" : "bad");

        result !== "incorrect" && nextChallenge();
      });

    nextChallenge();

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
        />
      </div>
    );
  },
});

export { App };
