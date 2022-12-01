export type ApiError = {
  status: number,
  message: string
};

export type UserToken = {
  id: string,
  email: string
};

export interface ProgramData {
  id: string;
  userId: string;
  title: string;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  didCompile: boolean;
  createdAt: string;
  modifiedAt: string;
}
