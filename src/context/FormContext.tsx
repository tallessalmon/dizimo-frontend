import React, { createContext, useContext } from "react";

type IProps = {
  children?: React.ReactNode;
};

export interface IFormContextData {}

const FormContext = createContext<IFormContextData>({} as IFormContextData);

const FormProvider: React.FC<IProps> = ({ children }) => {
  return <FormContext.Provider value={{}}>{children}</FormContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useForm = (): IFormContextData => useContext(FormContext);

export default FormProvider;
