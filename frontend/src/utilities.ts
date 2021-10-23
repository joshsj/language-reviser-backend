/* Provides the payload type for an emit declaration */
function emitT<TPayload>() {
  return (_: TPayload) => void 0;
}

export { emitT };
