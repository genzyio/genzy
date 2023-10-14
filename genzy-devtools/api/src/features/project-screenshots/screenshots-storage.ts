import { type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../../config";

const screenshotsPath = path.join(config.userArtefactsPath, "screenshots");
const ONE_MB = 1 * 1024 * 1024;

function getScreenshot(projectName: string): Promise<fs.ReadStream> {
  return new Promise((resolve, reject) => {
    const projectScreenshotPath = path.join(screenshotsPath, `${projectName}.png`);

    if (!fs.existsSync(projectScreenshotPath)) {
      return reject();
    }

    const projectScreenshot = fs.createReadStream(projectScreenshotPath);
    resolve(projectScreenshot);
  });
}

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, screenshotsPath);
  },
  filename: function (request, file, cb) {
    const projectName = request.params.name || "default";
    cb(null, `${projectName}.png`);
  },
});

const uploader = multer({
  storage: storage,
  limits: { fileSize: ONE_MB },
  fileFilter: function (request, file, cb) {
    const isPngMimetype = /png/.test(file.mimetype);
    if (isPngMimetype) {
      return cb(null, true);
    }

    cb(Error(`Error: File upload only supports the png filetype`));
  },
}).single("images");

function ensureScreenshotsFolderExists() {
  if (!fs.existsSync(screenshotsPath)) {
    fs.mkdirSync(screenshotsPath);
  }
}

function uploadScreenshot(request: Request, response: Response): Promise<void> {
  ensureScreenshotsFolderExists();

  return new Promise((resolve, reject) => {
    uploader(request, response, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export { getScreenshot, uploadScreenshot };
