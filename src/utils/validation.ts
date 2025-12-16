export function validatePicSize(
  size: string,
): size is "original" | "regular" | "small" | "thumb" | "mini" {
  return ["original", "regular", "small", "thumb", "mini"].includes(size);
}

export function validateReplyNumber(num: number): boolean {
  return num >= 1 && num <= 10;
}

export function validateR18Value(
  r18: number | undefined,
  allowR18: boolean,
): number {
  if (!allowR18) return 0;
  return r18 || 0;
}
