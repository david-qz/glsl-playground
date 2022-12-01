import pool from '../database.js';

type ProgramRow = {
  id: string,
  user_id: string,
  title: string,
  vertex_shader_source: string,
  fragment_shader_source: string,
  did_compile: boolean,
  created_at: string,
  modified_at: string
};

export interface ProgramData {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly vertexShaderSource: string;
  readonly fragmentShaderSource: string;
  readonly didCompile: boolean;
  readonly createdAt: string;
  readonly modifiedAt: string;
}

export default class Program implements ProgramData {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly vertexShaderSource: string;
  readonly fragmentShaderSource: string;
  readonly didCompile: boolean;
  readonly createdAt: string;
  readonly modifiedAt: string;

  constructor(row: ProgramRow) {
    this.id = row.id;
    this.userId = row.user_id;
    this.title = row.title;
    this.vertexShaderSource = row.vertex_shader_source;
    this.fragmentShaderSource = row.fragment_shader_source;
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
      insert into programs (user_id, title, vertex_shader_source, fragment_shader_source, did_compile)
      values ($1, $2, $3, $4, $5)
      returning *;
      `,
      [userId, data.title, data.vertexShaderSource, data.fragmentShaderSource, data.didCompile]
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
        vertex_shader_source = $3,
        fragment_shader_source = $4,
        did_compile = $5
      where id = $1
      returning *;
      `,
      [
        id,
        updated.title,
        updated.vertexShaderSource,
        updated.fragmentShaderSource,
        updated.didCompile
      ]
    );

    if (!rows[0]) return undefined;
    return new Program(rows[0]);
  }
}
