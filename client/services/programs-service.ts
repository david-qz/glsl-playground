import type { ApiError, ProgramData } from "../../common/api-types";
import type { Result } from "../../common/result";
import apiPrefix from "./api-prefix";

export async function getById(id: string): Promise<Result<ProgramData>> {
  const response = await fetch(`${apiPrefix}/programs/${id}`);
  const json: unknown = await response.json();

  if (!response.ok) return new Error((json as ApiError).message);

  return json as ProgramData;
}

export async function getUsersPrograms(): Promise<Result<Array<ProgramData>>> {
  const response = await fetch(`${apiPrefix}/programs`);
  const json: unknown = await response.json();

  if (!response.ok) return new Error((json as ApiError).message);

  return json as Array<ProgramData>;
}

export async function create(program: ProgramData): Promise<Result<ProgramData>> {
  const response = await fetch(`${apiPrefix}/programs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(program),
  });
  const json: unknown = await response.json();

  if (!response.ok) return new Error((json as ApiError).message);

  return json as ProgramData;
}

export async function update(program: ProgramData): Promise<Result<ProgramData>> {
  const response = await fetch(`${apiPrefix}/programs/${program.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(program),
  });
  const json: unknown = await response.json();

  if (!response.ok) return new Error((json as ApiError).message);

  return json as ProgramData;
}

export async function deleteProgram(programId: string): Promise<Result<ProgramData>> {
  const response = await fetch(`${apiPrefix}/programs/${programId}`, {
    method: "DELETE",
  });
  const json: unknown = await response.json();

  if (!response.ok) return new Error((json as ApiError).message);

  return json as ProgramData;
}
