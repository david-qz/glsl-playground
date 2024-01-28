import { Insertable, Selectable, Updateable } from "kysely";
import { Programs, Users } from "./generated";

export type User = Selectable<Users>;
export type UserInsert = Insertable<Users>;
export type UserUpdate = Updateable<Users>;

export type Program = Selectable<Programs>;
export type ProgramInsert = Insertable<Programs>;
export type ProgramUpdate = Updateable<Programs>;
