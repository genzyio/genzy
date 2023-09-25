import * as nunjucks from "nunjucks";
import * as path from "path";
import { langToClientViewsDir, langToServerViewsDir } from "./constants";

export function createEnv(
  isServer: boolean,
  language:
    | keyof typeof langToClientViewsDir
    | keyof typeof langToServerViewsDir
) {
  const env = nunjucks.configure(
    path.resolve(
      __dirname,
      (isServer ? langToServerViewsDir : langToClientViewsDir)[language]
    ),
    { autoescape: true }
  );

  env.addFilter(
    "capitalizeFirstLetter",
    function (val, cb) {
      if (!val) {
        cb(null, val);
        return;
      }
      cb(null, `${val[0].toUpperCase()}${val.substring(1)}`);
    },
    true
  );

  return env;
}
