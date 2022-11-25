export function avatarLabel(name: string): string {
  return name
    .split(' ')
    .map((value) => {
      return value[0].toUpperCase();
    })
    .reduce((acc, value) => {
      return acc.concat(value);
    });
}
