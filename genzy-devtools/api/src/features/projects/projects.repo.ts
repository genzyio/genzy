import moment from "moment";
import database from "../../core/database/database.utils";
import { CreateProject, type ProjectId, type Project } from "./projects.models";

function get(): Promise<Project[]> {
  return new Promise((resolve, _) => {
    database.connection.all(`SELECT * FROM Projects`, [], (error, rows) =>
      error ? resolve([]) : resolve(rows as Project[]),
    );
  });
}

function getByName(projectName: string): Promise<Project | null> {
  return new Promise((resolve, _) => {
    database.connection.get(`SELECT * FROM Projects WHERE NAME = ?`, [projectName], (error, row) =>
      error ? resolve(null) : resolve(row as Project),
    );
  });
}

function add(project: CreateProject): Promise<void> {
  return new Promise((resolve, reject) => {
    database.connection.run(
      `INSERT INTO Projects (name, path, createdAt) VALUES (?, ?, ?)`,
      [project.name, project.path, moment().format()],
      (error) => (error ? reject(error) : resolve()),
    );
  });
}

function remove(projectId: ProjectId): Promise<void> {
  return new Promise((resolve, reject) => {
    database.connection.run(`DELETE FROM Projects WHERE ID = ?`, [projectId], (error) =>
      error ? reject(error) : resolve(),
    );
  });
}

export type ProjectsRepo = {
  get(): Promise<Project[]>;
  getByName(projectName: string): Promise<Project | null>;
  add(project: CreateProject): Promise<void>;
  remove(projectId: ProjectId): Promise<void>;
};

export const projectsRepo: ProjectsRepo = {
  get,
  getByName,
  add,
  remove,
};
