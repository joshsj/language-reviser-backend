import { defineComponent, PropType } from "vue";
import { emitT } from "../../utilities";
import { CornerStyle, cornerStyle } from "../utilities";

const Cornered = defineComponent({
  name: "Cornered",
  props: {
    content: {
      type: Object as PropType<string | JSX.Element>,
      required: true,
    },
    cornerStyle: {
      type: Object as PropType<CornerStyle>,
      required: true,
    },
  },
  emits: { click: emitT() },
  setup: (props, { emit }) => {
    return () => (
      <div style={cornerStyle(props.cornerStyle)} onClick={() => emit("click")}>
        {props.content}
      </div>
    );
  },
});

export { Cornered };
