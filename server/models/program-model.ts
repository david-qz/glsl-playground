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

export default class Program {
  id: string;
  userId: string;
  title: string;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  didCompile: boolean;
  createdAt: string;
  modifiedAt: string;

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
}
