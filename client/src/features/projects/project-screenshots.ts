import html2canvas from "html2canvas";
import { API_URL } from "../../url";
import { type Project } from "./projects-models";
import axios from "axios";

function getProjectScreenshotUrl({ name }: Project) {
  return `${API_URL}/projects/${name}/screenshot`;
}

async function saveProjectScreenshot() {
  const canvas = await html2canvas(document.body, {
    allowTaint: true,
    useCORS: true,
    logging: true,
  });

  const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
  const fd = new FormData();
  fd.append("images", blob);

  // TODO: Pass project name
  axios.post(`/projects/test6/screenshot`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export { getProjectScreenshotUrl, saveProjectScreenshot };
