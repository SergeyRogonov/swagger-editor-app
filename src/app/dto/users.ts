import { PostgrestError } from "@supabase/supabase-js";

interface IUserDto {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

interface ISupabaseUsersDto {
  data: IUserDto[];
  error: PostgrestError | null;
}

interface ISupabasePasswordUsersDto {
  data: Array<{
    id: IUserDto["id"];
    password_hash: IUserDto["password_hash"];
  }>;
  error: PostgrestError | null;
}

export type { IUserDto, ISupabaseUsersDto, ISupabasePasswordUsersDto };
