import React, { useEffect, useState } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import Image from "next/image";
import { api } from "@/utils/api";
import { KapsType } from "@/utils/enums";
import { Popup } from "./Popup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fetchKaps } from "@/atoms/fetchKaps";
import { HorizontalSkeleton } from "./HorizontalSkeleton";

export const Content: React.FC = () => {
  const [kaps, setKaps] = useState<KapsType[] | null>();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [kapsLoading, setKapsLoading] = useState<boolean>(true);
  const fetchKapsToggle = useRecoilValue(fetchKaps);

  const getKaps = api.kaps.getAllKapsOfUser.useMutation({
    onSuccess: (data) => {
      if (data.code === 200) {
        setKapsLoading(false);
        const sortedKaps = data.kaps?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setKaps((_prev) => sortedKaps);
      }
    },
  });

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  useEffect(() => {
    const kap = async () => {
      await getKaps.mutate();
    };
    kap();
  }, [showPopup, fetchKapsToggle]);

  return (
    <div style={{ background: "#0D0D1A" }} className="w-[85vw]">
      <Navbar />
      <div>
        <div className="mx-auto flex w-[75vw] justify-between">
          <div className="ml-4 font-serif text-4xl text-white">Workflows</div>
          <div className="" onClick={togglePopup}>
            <Button />
          </div>
        </div>
        {
          kapsLoading && <div className="mx-auto w-[30vw]"><HorizontalSkeleton /></div>
        }
        <div className="m-5 h-[70vh] overflow-y-auto">
          {kaps &&
            kaps.map((item) => (
              <div key={item.id} className="mt-4">
                <Kap
                  title={item.title}
                  id={item.id}
                  published={item.published}
                />
              </div>
            ))}
        </div>
      </div>
      {showPopup && <Popup onClose={togglePopup} />}
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
  published: boolean;
  id: number;
}

const Kap: React.FC<KapProps> = (props) => {
  const { title, published, id } = props;
  const [toggleStatus, setToggleStatus] = useState<boolean>(published);
  const setFetchKapsToggle = useSetRecoilState(fetchKaps);
  const router = useRouter();

  const updateKapPublish = api.kaps.togglePublishStatusOfKap.useMutation({
    onSuccess: (data) => {
      if (data.code !== 200) {
        toast(data.message);
      }
    },
  });

  const deleteKap = api.kaps.deleteKap.useMutation({
    onSuccess: (data) => {
      if (data.code !== 200) {
        toast(data.message);
      } else {
        setFetchKapsToggle(prev => !prev);
      }
    },
  });

  return (
    <div
      className="mx-auto flex w-[80%] items-center justify-between rounded-md border p-4"
      style={{ background: "#151521" }}
      key={id}
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
        <div className="cursor-pointer" onClick={() => {
          router.push(`/kaps?id=${id}`)
        }} >
          <p className="text-2xl text-white">{title}</p>
        </div>
        <div></div>
      </div>
      <div className="flex w-[10%] justify-between">
        <div
          className="cursor-pointer text-red-600"
          onClick={async (_e) => {
            await deleteKap.mutate({ id });
          }}
        >
          <DeleteOutlineIcon className=" h-[30px] w-[30px]" />
        </div>
        <div>
          <label className="me-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              value=""
              className="peer sr-only"
              onChange={async (e) => {
                await updateKapPublish.mutate({
                  id: id,
                  published: e.target.checked,
                });
                setToggleStatus((prev) => !prev);
              }}
              checked={toggleStatus}
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-purple-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

const Button: React.FC = () => {
  return (
    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        New Kap
      </span>
    </button>
  );
};
