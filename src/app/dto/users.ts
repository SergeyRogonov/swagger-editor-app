import { PostgrestError } from "@supabase/supabase-js";

interface IUserDto {
  id: number;
  email: string;
  passwordHash: string;
  created_at: string;
}

interface ISupabaseUsersDto {
    data: IUserDto[];
    error: PostgrestError | null;
}

export type { IUserDto, ISupabaseUsersDto };
