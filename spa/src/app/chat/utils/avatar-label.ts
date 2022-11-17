export function avatarLabel(name: string): string {
  return name
    .split(' ')
    .filter((value) => value.toLowerCase() != value.toUpperCase())
    .map((value) => value[0].toUpperCase())
    .reduce((acc, value) => acc.concat(value));
}
