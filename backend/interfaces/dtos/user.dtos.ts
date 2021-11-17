export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  permissionLevel?: number;
}

export interface PutUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissionLevel: number;
}

export interface PatchUserDto extends Partial<PutUserDto> {}

export interface UserTokenDto {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  permissionLevel?: number;
}
