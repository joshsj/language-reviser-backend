import { defineComponent, PropType, ref } from "vue";
import { ChallengePanel } from "./components/challenge/ChallengePanel";
import { Cornered } from "./components/general/Cornered";
import { SettingsPanel } from "./components/settings/SettingsPanel";
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
    const settingsShowing = ref(false);

    return () => (
      <div>
        <Cornered
          content={
            <div style={{ cursor: "pointer" }}>
              {settingsShowing.value ? "✏️" : "⚙️"}
            </div>
          }
          cornerStyle={{
            corner: "topRight",
            relativeTo: "viewport",
            offset: "33%",
          }}
          onClick={() => (settingsShowing.value = !settingsShowing.value)}
        />

        <div class="page content-center">
          {!settingsShowing.value ? (
            <ChallengePanel connection={props.connection} />
          ) : (
            <SettingsPanel />
          )}
        </div>
      </div>
    );
  },
});

export { App };
