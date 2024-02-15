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
    Tithe?: any[]
    created_at?: Date;
    updated_at?: Date;
  }