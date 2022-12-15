export type ApiError = {
  status: number;
  message: string;
};

export type UserToken = {
  id: string;
  email: string;
};

export interface ProgramData {
  id: string;
  userId: string;
  title: string;
  vertexSource: string;
  fragmentSource: string;
  didCompile: boolean;
  createdAt: string;
  modifiedAt: string;
}
