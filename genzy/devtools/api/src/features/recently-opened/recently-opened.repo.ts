import moment from "moment";
import database from "../../core/database/database.utils";
import { type RecentlyOpenedProject, type CreateRecentlyOpened, type RecentlyOpened } from "./recently-opened.models";

function get(): Promise<RecentlyOpenedProject[]> {
  return new Promise((resolve, _) => {
    database.connection.all(
      `SELECT p.id, p.name, p.path, p.createdAt, r.openedAt
      FROM Projects AS p
      LEFT JOIN RecentlyOpened AS r ON p.id = r.projectId
      ORDER BY
        CASE
          WHEN r.openedAt IS NOT NULL THEN r.openedAt
          ELSE p.createdAt
        END DESC;`,
      [],
      (error, rows) => (error ? resolve([]) : resolve(rows as RecentlyOpenedProject[])),
    );
  });
}

function getByName(projectName: string): Promise<RecentlyOpened | null> {
  return new Promise((resolve, _) => {
    database.connection.get(
      `SELECT * FROM RecentlyOpened WHERE projectId = (SELECT id FROM Projects WHERE name = ?)`,
      [projectName],
      (error, row) => (error ? resolve(null) : resolve(row as RecentlyOpened)),
    );
  });
}

function add(recentlyOpened: CreateRecentlyOpened): Promise<void> {
  return new Promise((resolve, reject) => {
    database.connection.run(
      `INSERT INTO RecentlyOpened (projectId, openedAt) VALUES (?, ?)`,
      [recentlyOpened.projectId, moment().format()],
      (error) => (error ? reject(error) : resolve()),
    );
  });
}

function update(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    database.connection.run(
      `UPDATE RecentlyOpened SET openedAt = ? WHERE projectId = (SELECT id from Projects WHERE name = ?)`,
      [moment().format(), projectName],
      (error) => (error ? reject(error) : resolve()),
    );
  });
}

function remove(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    database.connection.run(
      `DELETE FROM RecentlyOpened WHERE projectId = (SELECT id from Projects WHERE name = ?)`,
      [projectName],
      (error) => (error ? reject(error) : resolve()),
    );
  });
}

export type RecentlyOpenedRepo = {
  get(): Promise<RecentlyOpenedProject[]>;
  getByName(projectName: string): Promise<RecentlyOpened | null>;
  add(recentlyOpened: CreateRecentlyOpened): Promise<void>;
  update(projectName: string): Promise<void>;
  remove(projectName: string): Promise<void>;
};

export const recentlyOpenedRepo: RecentlyOpenedRepo = {
  get,
  getByName,
  add,
  update,
  remove,
};
