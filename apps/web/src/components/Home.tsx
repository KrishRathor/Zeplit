import React, { useState } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from "next/router";

export const Content: React.FC = () => {
  return (
    <div style={{ background: "#0D0D1A" }} className=" w-[85vw]">
      <Navbar />
      <div>
        <div className="text-4xl ml-4 text-white font-serif" >Workflows</div>
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
                    localStorage.removeItem('token');
                    router.push('/signin');
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

const Kap: React.FC = () => {

};
