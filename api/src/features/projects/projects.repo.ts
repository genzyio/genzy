import moment from "moment";
import dbConnection from "../../core/database/database.utils";
import { CreateProject, type ProjectId, type Project } from "./projects.models";

function Get(): Promise<Project[]> {
  return new Promise((resolve, _) => {
    dbConnection.all(`SELECT * FROM Projects`, [], (error, rows) => (error ? resolve([]) : resolve(rows as Project[])));
  });
}

function GetByName(projectName: string): Promise<Project | null> {
  return new Promise((resolve, _) => {
    dbConnection.get(`SELECT * FROM Projects WHERE NAME = ?`, [projectName], (error, row) =>
      error ? resolve(null) : resolve(row as Project)
    );
  });
}

function Add(project: Project): Promise<void> {
  return new Promise((resolve, reject) => {
    dbConnection.run(
      `INSERT INTO Projects (name, path, createdAt) VALUES (?, ?, ?)`,
      [project.name, project.path, moment().format()],
      (error) => (error ? reject(error) : resolve())
    );
  });
}

function Delete(projectId: ProjectId): Promise<void> {
  return new Promise((resolve, reject) => {
    dbConnection.run(`DELETE FROM Projects WHERE ID = ?`, [projectId], (error) => (error ? reject(error) : resolve()));
  });
}

export type ProjectsRepo = {
  Get(): Promise<Project[]>;
  GetByName(projectName: string): Promise<Project | null>;
  Add(project: CreateProject): Promise<void>;
  Delete(projectId: ProjectId): Promise<void>;
};

export const projectsRepo: ProjectsRepo = {
  Get,
  GetByName,
  Add,
  Delete,
};
