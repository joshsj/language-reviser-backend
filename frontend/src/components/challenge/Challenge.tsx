import {
  computed,
  defineComponent,
  PropType,
  StyleValue,
  ref,
  watch,
  nextTick,
} from "vue";
import { Challenge as ChallengeData } from "@/common/entities";
import { accentHelper } from "@/common/language/accents";
import { emitT, EmptyCharacter } from "../../utilities";

type InputKeyboardEvent = KeyboardEvent & { target: HTMLInputElement };

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
        [`margin-${props.marginSide}`]: props.text ? "1ch" : undefined,
      })
    );

    return () => (
      <label for={props.for} aria-hidden={!props.text} style={style.value}>
        {props.text}
      </label>
    );
  },
});

const Challenge = defineComponent({
  name: "Challenge",
  components: { Label },
  props: {
    challenge: {
      type: Object as PropType<ChallengeData>,
      required: true,
    },
    stateColor: String,
    stateTransitionTime: Number,
  },
  emits: {
    attempt: emitT<string>(),
    skip: emitT(),
  },
  setup(props, { emit }) {
    const mainStyle = computed(
      (): StyleValue => ({
        fontSize: "1.75em",
        padding: "0.25em",
        marginBottom: "0.25em",
        borderRadius: "0.2em",
        border: "0.075em solid transparent",
        transition: `border-color ease-in-out ${
          (props?.stateTransitionTime ?? 0) / 1000
        }s`,
        borderColor: props.stateColor ?? "transparent",
      })
    );

    const inputValue = ref("");
    const inputId = "challenge-input";
    const inputWidth = computed(() =>
      Math.max(
        props.challenge?.answerLength ?? 0,
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
        const letter = inputValue.value[letterIndex];

        if (!letter) {
          return;
        }

        inputValue.value =
          inputValue.value.slice(0, letterIndex) +
          accentHelper.get(letter, ev.shiftKey ? "previous" : "next") +
          inputValue.value.slice(letterIndex + 1);

        nextTick(() => ev.target.setSelectionRange(start, end));
      },
      Escape: () => emit("skip"),
    };

    const handleKeydown = (ev: KeyboardEvent) =>
      keyDownHandlers[ev.key]?.(ev as InputKeyboardEvent);

    return () => (
      <div style={{ textAlign: "center" }}>
        <div style={mainStyle.value}>
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

        <div>
          {props.challenge.context
            ? `(${props.challenge.context})`
            : EmptyCharacter}
        </div>
      </div>
    );
  },
});

export { Challenge };
