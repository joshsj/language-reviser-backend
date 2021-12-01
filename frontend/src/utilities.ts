type NoPayload = undefined;

/* Provides the payload type for an emit declaration */
function emitT<TPayload = NoPayload>(): TPayload extends NoPayload
  ? () => void
  : (_: TPayload) => void {
  return ((_: TPayload) => void 0) as any;
}

const EmptyCharacter = String.fromCharCode(0x200c); // zero-width non-joiner

export { emitT, EmptyCharacter };
