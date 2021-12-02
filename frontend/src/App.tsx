import { Container } from "@/common/dependency/container";
import { defineComponent, PropType, ref } from "vue";
import { ChallengePanel } from "./components/challenge/ChallengePanel";
import { Cornered } from "./components/general/Cornered";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { Dependencies } from "./dependency";

const App = defineComponent({
  name: "App",

  props: {
    container: {
      type: Object as PropType<Container<Dependencies>>,
      required: true,
    },
  },

  setup: (props) => {
    const settingsShowing = ref(false);

    const cornerIcon = (
      <div style={{ cursor: "pointer" }}>
        {settingsShowing.value ? "✏️" : "⚙️"}
      </div>
    );

    return () => (
      <div>
        <Cornered
          content={cornerIcon}
          cornerStyle={{
            corner: "topRight",
            relativeTo: "viewport",
            offset: "33%",
          }}
          onClick={() => (settingsShowing.value = !settingsShowing.value)}
        />

        <div class="page content-center">
          {!settingsShowing.value ? (
            <ChallengePanel container={props.container} />
          ) : (
            <SettingsPanel />
          )}
        </div>
      </div>
    );
  },
});

export { App };
