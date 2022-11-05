export function classes(...classes: Array<string | false>): string {
  return classes.filter(c => c !== false).join(' ');
}
