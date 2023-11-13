const Languages = {
  js: "Javascript",
  ts: "Typescript",
} as const;

// TODO: Save icons in public/static folder.
const LanguageIcons = {
  ts: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
  js: "https://www.freepnglogos.com/uploads/javascript-png/javascript-vector-logo-yellow-png-transparent-javascript-vector-12.png",
} as const;

export { Languages, LanguageIcons };
