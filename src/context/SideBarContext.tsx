import React, { createContext, useContext } from "react";

interface ISideBarContext {}

export interface IModule {
  name: string;
  completed: boolean;
}
type IProps = {
  children?: React.ReactNode;
};

export const SideBarContext = createContext<ISideBarContext>(
  {} as ISideBarContext
);

export const SidebarProvider: React.FC<IProps> = ({ children }) => {
  return (
    <SideBarContext.Provider value={{}}>{children}</SideBarContext.Provider>
  );
};

export const useSideBar = (): ISideBarContext => useContext(SideBarContext);
