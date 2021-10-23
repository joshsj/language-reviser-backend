import { computed, defineComponent, PropType, StyleValue, ref } from "vue";
import { Challenge } from "@shared/game";
import { emitT } from "../utilities";

type State = "good" | "bad";

const stateColor = { good: "mediumseagreen", bad: "tomato" };

const Label = defineComponent({
  name: "Label",
  props: {
    text: String,
    for: { type: String, required: true },
    marginSide: { type: String as PropType<"left" | "right">, required: true },
  },
  setup(props) {
    const style = computed(
      (): StyleValue => ({
        [`margin-${props.marginSide}`]: "1rem",
      })
    );

    return () => (
      <label for={props.for} aria-hidden={!props.text} style={style.value}>
        {props.text}
      </label>
    );
  },
});

const _Challenge = defineComponent({
  name: "Challenge",
  components: { Label },
  props: {
    challenge: { type: Object as PropType<Challenge>, required: true },
    state: String as PropType<State>,
    stateTransitionTime: Number,
  },
  emits: { attempt: emitT<string>() },
  setup(props, { emit }) {
    const style = computed(
      (): StyleValue => ({
        padding: "0.75rem",
        borderRadius: "0.2em",
        border: "0.075em solid transparent",
        transition: `border-color ease-in-out ${
          (props?.stateTransitionTime ?? 0) / 1000
        }s`,
        borderColor: props.state ? stateColor[props.state] : undefined + "ch",
      })
    );

    const inputValue = ref("");
    const inputId = "challenge-input";
    const inputStyle = computed(
      (): StyleValue => ({
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        width: `${Math.max(
          props.challenge.answer.length,
          props.challenge.hint?.length ?? 0
        )}ch`,
      })
    );

    const handleAttempt = (e: KeyboardEvent) => {
      if (e.key !== "Enter") {
        return;
      }

      const trimmed = inputValue.value.trim();
      trimmed.length && emit("attempt", "cool");
    };

    return () => (
      <div class="challenge" style={style.value}>
        <Label text={props.challenge.pre} for={inputId} marginSide="right" />

        <input
          v-model={inputValue.value}
          id={inputId}
          placeholder={props.challenge.hint}
          style={inputStyle.value}
          spellcheck="false"
          onKeypress={handleAttempt}
        />

        <Label text={props.challenge.post} for={inputId} marginSide="left" />
      </div>
    );
  },
});

export { _Challenge as Challenge, State };
