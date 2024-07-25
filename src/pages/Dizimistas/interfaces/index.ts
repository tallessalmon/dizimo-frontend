export interface IDizimista {
    id: number;
    fullName: string;
    community: string;
    address: string;
    number: number;
    district: string;
    city: string;
    zip: number;
    email?: string;
    phone?: string;
    cpf: string;
    birthday: Date;
    gender: string;
    user_id: number;
    Tithe?: ITithe[]
    created_at?: Date;
    updated_at?: Date;
  }

  export interface ITithe {
    id: number,
    date: string | Date;
    value: number;
    community: string;
    mode_pay: string;
    bank_id: number;
    created_at: string | Date;
    updated_at: string | Date;
    user?: IUser;
  }

  export interface IUser {
    id: number;
    profile: string;
    password: string;
    username: string;
    name: string;
    community: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
  }