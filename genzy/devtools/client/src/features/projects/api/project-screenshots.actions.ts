import axios from "axios";
import { API_URL } from "../../../url";
import { toBlob } from "html-to-image";

function getProjectScreenshotUrl(projectName: string) {
  return `${API_URL}/projects/${projectName}/screenshot`;
}

async function saveProjectScreenshot(projectName: string) {
  toBlob(document.querySelector(".react-flow") as HTMLElement, {
    filter: (node) => {
      const notContainsClass = (className: string) => !node?.classList?.contains(className);
      return notContainsClass("react-flow__minimap") && notContainsClass("react-flow__controls");
    },
  })
    .then((blob: any) => {
      const fd = new FormData();
      fd.append("images", blob);
      sendProjectScreenshot(projectName, fd);
    })
    .catch((error) => console.log(error));
}

function sendProjectScreenshot(projectName: string, formData: FormData) {
  axios.post(`/projects/${projectName}/screenshot`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export { getProjectScreenshotUrl, saveProjectScreenshot };
