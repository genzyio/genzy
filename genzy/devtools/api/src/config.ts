import dotenv from "dotenv";
import path from "path";
import os from "os";

dotenv.config();

export const config = {
  port: process.env.PORT,
  userArtefactsPath: path.join(os.homedir(), '.genzy')
};
