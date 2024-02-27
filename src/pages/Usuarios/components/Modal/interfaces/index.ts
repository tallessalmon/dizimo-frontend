export interface IProps {
  isModalVisible?: boolean;
  handleCancel: () => void;
  getData: () => void;
  width?: number;
}

export interface IForm {
  username: string;
  profile: string;
  password: string;
  name: string;
  community: string;
  phone: string;
  email?: string;
  status: boolean;
}
