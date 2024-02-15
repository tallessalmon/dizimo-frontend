import { ReactElement } from "react"

export interface IPages {
    id: number,
    icon: ReactElement,
    path: string,
    title: string,
    hasSubMenu: boolean,
    subMenu?: IPages[],
    page: ReactElement,
    allow: string[]
}
