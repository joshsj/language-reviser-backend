import { CSSProperties } from "vue";

type RelativeTo = "viewport" | "parent";
type Corner = "topRight";

type CornerStyle = {
  corner: Corner;
  relativeTo: RelativeTo;
  offset?: string;
};

const cornerValues = {
  topRight: (relativeTo: RelativeTo, offset: string): CSSProperties => {
    const unit = relativeTo === "parent" ? "%" : "vw";
    const transform = `translate(calc(-1 * (100% + ${offset})), ${offset})`;

    return { top: "0", left: `100${unit}`, transform };
  },
};

const cornerStyle = ({
  corner,
  relativeTo,
  offset = "0",
}: CornerStyle): CSSProperties => ({
  position: "absolute",
  ...cornerValues[corner](relativeTo, offset),
});

export { cornerStyle, CornerStyle };
