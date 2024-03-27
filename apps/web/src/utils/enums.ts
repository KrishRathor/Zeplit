export enum SideBarMenuOptions {
    Kaps = "Kaps",
    Apps = "Apps",
}

export interface KapsType {
    id: number
    createdAt: Date
    owner: string
    title: string
    published: boolean
}