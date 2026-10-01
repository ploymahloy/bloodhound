/**
 * Simple classNames helper for conditional classes.
 */
export const cn = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}
