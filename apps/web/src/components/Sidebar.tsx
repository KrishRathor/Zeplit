import React, { useEffect } from "react";
import { SparklesPreview } from "./ui/sperkleHeading";
import Image from "next/image";
import { Timeline, Apps } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { selectedSidebarOption } from "@/atoms/selectedSidebarOption";
import { SideBarMenuOptions } from "@/utils/enums";

export const Sidebar: React.FC = () => {
  const [selectedOption, setSelectedOption] = useRecoilState(
    selectedSidebarOption,
  );

  return (
    <div
      style={{ background: "#151521", borderRight: "1px solid gray" }}
      className=" w-[15vw]"
    >
      <div className="text-center text-3xl text-white ">
        <SparklesPreview />
      </div>

      <div>
        <ul>
          <li>
            <div
              className={`flex items-center align-middle p-2 ${selectedOption === SideBarMenuOptions.Kaps ? 'bg-[#2A3942]' : '' }`}
            >
              <Timeline className="ml-2 h-[50px] w-[50px] rounded-full bg-white" />
              <p
                className="ml-4 cursor-pointer font-serif text-2xl text-white"
                onClick={() =>
                  setSelectedOption((_prev) => SideBarMenuOptions.Kaps)
                }
              >
                MyKaps
              </p>
            </div>
          </li>
          <li className="p-2">
            <div className={`flex items-center align-middle ${selectedOption === SideBarMenuOptions.Apps ? 'bg-[#2A3942]' : ''} `}>
              <Apps className="ml-2 h-[50px] w-[50px] rounded-full bg-white" />
              <p
                className="ml-4 cursor-pointer font-serif text-2xl text-white"
                onClick={() =>
                  setSelectedOption((_prev) => SideBarMenuOptions.Apps)
                }
              >
                Apps
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
