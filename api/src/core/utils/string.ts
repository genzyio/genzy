export function trimCharactersFromEnd(text: string, character: string) {
  const separator = character.replace(/\\/g, "\\\\");
  const regex = new RegExp(`${separator}+$`);
  return text.replace(regex, "");
}
