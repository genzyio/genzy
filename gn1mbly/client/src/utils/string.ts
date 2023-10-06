const special = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeenth",
  "eighteenth",
  "nineteenth",
] as const;

const deca = ["twent", "thirt", "fort", "fift", "sixt", "sevent", "eight", "ninet"] as const;

function stringifyNumber(number: number): string {
  if (number < 20) return special[number];

  if (number % 10 === 0) return deca[Math.floor(number / 10) - 2] + "ieth";

  return deca[Math.floor(number / 10) - 2] + "y-" + special[number % 10];
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export { stringifyNumber, capitalizeFirstLetter };
