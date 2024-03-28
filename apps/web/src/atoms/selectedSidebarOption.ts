import { SideBarMenuOptions } from "@/utils/enums";
import { atom } from "recoil";

export const selectedSidebarOption = atom({
    key: 'selectedSidebarOption',
    default: SideBarMenuOptions.Kaps
})