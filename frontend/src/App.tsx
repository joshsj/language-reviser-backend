import { Challenge } from "@shared/game";
import { defineComponent, ref } from "vue";
import { Challenge as ChallengeUI, State } from "./components/Challenge";

const App = defineComponent({
  name: "App",
  setup: () => {
    const stateTransitionTime = 250;
    const challengeState = ref<State | undefined>(undefined);

    const testChallenge: Challenge = {
      answer: "answer",
      hint: "hint",
      pre: "pre",
      post: "post",
    };

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
          challenge={testChallenge}
          state={challengeState.value}
          stateTransitionTime={stateTransitionTime}
          onAttempt={console.log}
        />
      </div>
    );
  },
});

export { App };
