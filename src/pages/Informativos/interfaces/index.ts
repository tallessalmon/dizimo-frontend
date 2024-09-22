export interface IInformation {
  id?: number;
  abrangence: string;
  message: string;
  image: string;
  user_id: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  user?: IUsers;
}

interface IUsers {
  id: number;
  username: string;
  name: string;
  password: string;
  profile: string;
  active: boolean;
  senior_id: number;
  cars_allow: string;
  created_at: Date;
  updated_at: Date;
}
