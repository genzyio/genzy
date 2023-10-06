import html2canvas from "html2canvas";
import axios from "axios";
import { API_URL } from "../../../url";

function getProjectScreenshotUrl(projectName: string) {
  return `${API_URL}/projects/${projectName}/screenshot`;
}

async function saveProjectScreenshot(projectName: string) {
  const canvas = await html2canvas(document.body, {
    allowTaint: true,
    useCORS: true,
    logging: true,
  });

  const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
  const fd = new FormData();
  fd.append("images", blob);

  axios.post(`/projects/${projectName}/screenshot`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export { getProjectScreenshotUrl, saveProjectScreenshot };
