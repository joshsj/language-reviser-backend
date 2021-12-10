const random = (max: number, min: number = 0) =>
  min + Math.round(Math.random() * (max - min));

export { random };
