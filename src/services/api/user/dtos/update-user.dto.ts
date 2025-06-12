export interface UpdateUserDTO {
  id: string;
  name: string;
  email: string;
  password?: string;
  token?: string | null;
}
