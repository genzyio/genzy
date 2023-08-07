import dbConnection from "../../core/database/database.utils";
import { type Project } from "./projects.models"


function GetByName(projectName: string): Promise<Project | null> {
  return new Promise((resolve, _) => {
    dbConnection.get(
      `SELECT * FROM Projects WHERE NAME = ?`,
      [projectName],
      (error, row) => error ? resolve(null) : resolve(row as Project)
    );
  })
}


function Add(project: Project): Promise<void> {
  return new Promise((resolve, reject) => {
    dbConnection.run(
      `INSERT INTO Projects (name, path) VALUES (?, ?)`,
      [project.name, project.path],
      (error) => error ? reject(error) : resolve()
    );
  })
}

export type ProjectsRepo = {
  GetByName(projectName: string): Promise<Project | null>;
  Add(project: Project): Promise<void>;
}

export const projectsRepo: ProjectsRepo = {
  GetByName,
  Add
};