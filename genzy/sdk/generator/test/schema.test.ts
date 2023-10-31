import axios from "axios";
import { generateTSClient } from "../src";
import type { ExtendedMetaInfo } from "../src/types";

describe("Tests", () => {
  it("should generate TS client", async () => {
    const response = await axios.get("http://localhost:4000/api/v1/meta");

    const meta = response.data as ExtendedMetaInfo;

    generateTSClient(meta, "./out", "http://localhost:4000/api/v1");
  });
});
