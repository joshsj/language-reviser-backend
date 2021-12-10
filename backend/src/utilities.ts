const arrayify = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

export { arrayify };
