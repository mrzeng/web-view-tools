let id = 0;

export const ID_PREFIX = `${Math.ceil(Math.random() * 10000)}_`;

export function uniqueId(): string {
  id += 1;
  return `${ID_PREFIX}${id}`;
}
