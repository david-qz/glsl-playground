import { ProgramData } from '../../common/api-types.js';
import pool from '../database.js';

type ProgramRow = {
  id: string,
  user_id: string,
  title: string,
  vertex_source: string,
  fragment_source: string,
  did_compile: boolean,
  created_at: string,
  modified_at: string
};

export default class Program implements ProgramData {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly vertexSource: string;
  readonly fragmentSource: string;
  readonly didCompile: boolean;
  readonly createdAt: string;
  readonly modifiedAt: string;

  constructor(row: ProgramRow) {
    this.id = row.id;
    this.userId = row.user_id;
    this.title = row.title;
    this.vertexSource = row.vertex_source;
    this.fragmentSource = row.fragment_source;
    this.didCompile = row.did_compile;
    this.createdAt = row.created_at;
    this.modifiedAt = row.modified_at;
  }

  static async getById(id: string): Promise<Program | undefined> {
    const { rows } = await pool.query<ProgramRow>('select * from programs where id = $1', [id]);
    if (!rows[0]) return undefined;
    return new Program(rows[0]);
  }

  static async insert(userId: string, data: Partial<ProgramData>): Promise<Program> {
    const { rows } = await pool.query<ProgramRow>(
      `
      insert into programs (user_id, title, vertex_source, fragment_source, did_compile)
      values ($1, $2, $3, $4, $5)
      returning *;
      `,
      [userId, data.title, data.vertexSource, data.fragmentSource, data.didCompile]
    );

    // If there isn't a row, the above query would have thrown.
    return new Program(rows[0]!);
  }

  async update(id: string, partial: Partial<ProgramData>): Promise<Program | undefined> {
    const updated = { ...this as ProgramData, ...partial };

    const { rows } = await pool.query<ProgramRow>(
      `
      update programs set
        title = $2,
        vertex_source = $3,
        fragment_source = $4,
        did_compile = $5
      where id = $1
      returning *;
      `,
      [
        id,
        updated.title,
        updated.vertexSource,
        updated.fragmentSource,
        updated.didCompile
      ]
    );

    if (!rows[0]) return undefined;
    return new Program(rows[0]);
  }

  async delete(): Promise<void> {
    await pool.query<ProgramRow>('delete from programs where id = $1', [this.id]);
  }
}
