import React, { useState } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import Image from "next/image";
import { api } from "@/utils/api";

export const Content: React.FC = () => {

  const c = api.kaps.createKap.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  return (
    <div style={{ background: "#0D0D1A" }} className="w-[85vw]">
      <Navbar />
      <div>
        <div className="ml-4 font-serif text-4xl text-white">Workflows</div>
        <div className="m-5 h-[70vh] overflow-y-auto">
          {
            [1,1,1].map(item => (
              <div className="mt-4" >
                <Kap title="Zapier" published={true} />
              </div>
            ))
          } 
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        className="m-4 flex cursor-pointer justify-end"
        onClick={toggleDropdown}
      >
        <Person2Icon className="h-[50px] w-[50px] rounded-full bg-white" />
      </div>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Dropdown content */}
          <div className="py-1">
            <div className="flex items-center justify-evenly">
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </button>
              <AccountCircleIcon />
            </div>
            <div className="flex items-center justify-evenly">
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <SettingsIcon />
            </div>
            <div className="flex items-center justify-evenly">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/signin");
                }}
              >
                Logout
              </button>
              <LogoutIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface KapProps {
  title: string;
  published: boolean
}

const Kap: React.FC<KapProps> = (props) => {
  const { title, published } = props;

  return (
    <div
      className="mx-auto flex w-[80%] items-center justify-between rounded-md border p-4"
      style={{ background: "#151521" }}
    >
      <div className="flex w-[30%] items-center justify-between">
        <div className="flex">
          <div>
            <Image src={"/gmail.webp"} alt="gmailLogo" width={40} height={40} />
          </div>
          <div>
            <Image src={"/drive.png"} alt="gmailLogo" width={40} height={40} />
          </div>
          <div>
            <Image
              src={"/notion.webp"}
              alt="gmailLogo"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div className="cursor-pointer">
          <p className="text-2xl text-white">{title}</p>
        </div>
        <div></div>
      </div>
      <div>
        <label className="me-5 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={(e) => console.log(e.target.checked)}
            checked={published}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-purple-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800"></div>
        </label>
      </div>
    </div>
  );
};
