export function avatarLabel(name: string): string {
  const tmp = name
    .split(' ')
    .filter((value) => value.toLowerCase() != value.toUpperCase())
    .map((value) => value[0].toUpperCase());

  if (tmp.length === 0) {
    return '';
  }

  return tmp.reduce((acc, value) => acc.concat(value));
}
