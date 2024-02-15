export interface IProps {
    isModalVisible?:boolean;
    handleCancel:()=>void;
    getData:()=>void;
    width?:number
  }

  export interface IForm {
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
  }