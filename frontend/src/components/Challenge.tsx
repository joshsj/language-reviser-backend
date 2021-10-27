import {
  computed,
  defineComponent,
  PropType,
  StyleValue,
  ref,
  watch,
  nextTick,
} from "vue";
import { Challenge } from "@shared/game";
import { AccentHelper, emitT } from "../utilities";

type InputKeyboardEvent = KeyboardEvent & { target: HTMLInputElement };

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
    challenge: Object as PropType<Challenge>,
    state: String as PropType<State>,
    stateTransitionTime: Number,
    accentHelper: Object as PropType<AccentHelper>,
  },
  emits: {
    attempt: emitT<string>(),
    skip: emitT(),
  },
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
    const inputWidth = computed(() =>
      Math.max(
        props.challenge?.answer.length ?? 0,
        props.challenge?.hint?.length ?? 0
      )
    );
    const inputStyle = computed(
      (): StyleValue => ({
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        width: `${inputWidth.value}ch`,
      })
    );

    watch(
      () => props.challenge,
      () => (inputValue.value = "")
    );

    const keyDownHandlers: Record<string, (ev: InputKeyboardEvent) => void> = {
      " ": (ev) => ev.preventDefault(),
      Enter: () => emit("attempt", inputValue.value),
      Tab: (ev) => {
        ev.preventDefault();

        const [start, end] = [
          ev.target.selectionStart!,
          ev.target.selectionEnd!,
        ];
        const letterIndex = start - 1;

        inputValue.value =
          inputValue.value.slice(0, letterIndex) +
          props.accentHelper?.next(inputValue.value[letterIndex]!) +
          inputValue.value.slice(letterIndex + 1);

        nextTick(() => ev.target.setSelectionRange(start, end));
      },
      Escape: () => emit("skip"),
    };

    const handleKeydown = (ev: KeyboardEvent) =>
      keyDownHandlers[ev.key]?.(ev as InputKeyboardEvent);

    return () => (
      <div class="challenge" style={style.value}>
        <Label text={props.challenge?.pre} for={inputId} marginSide="right" />

        <input
          v-model={inputValue.value}
          id={inputId}
          placeholder={props.challenge?.hint}
          maxlength={inputWidth.value}
          style={inputStyle.value}
          onKeydown={handleKeydown}
          spellcheck="false"
        />

        <Label text={props.challenge?.post} for={inputId} marginSide="left" />
      </div>
    );
  },
});

export { _Challenge as Challenge, State };
