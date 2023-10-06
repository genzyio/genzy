import { api } from "./server";
import { decoratedService } from "./client";

if (process.argv.length > 2) {
  const cmd = process.argv[2];

  if (cmd === "client") {
    decoratedService
      .test("123", "luka")
      .then((r) => console.log(r))
      .catch((e) => console.log(e));
  } else {
    const PORT = 3030;
    api.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  }
}
