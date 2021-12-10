const random = (max: number, min: number = 0) => min + Math.round(Math.random() * (max - min));

const arrayify = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

export { random, arrayify };
