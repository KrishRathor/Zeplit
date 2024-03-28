import { fetchKaps } from "@/atoms/fetchKaps";
import { api } from "@/utils/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const Popup = ({ onClose }: any) => {
    const [kapName, setKapName] = useState<string>("");
    const toggleKaps = useSetRecoilState(fetchKaps);

    const createKap = api.kaps.createKap.useMutation({
        onSuccess: data => {
            if (data.code !== 201) {
                toast(data.message);
            } else {
                toggleKaps(prev => !prev);
            }
        }
    })
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-lg text-black font-bold mb-4">Create Kap</h2>
          <form>
            <div>
              <label className="block mb-2 text-sm font-medium text-black">
                Kap Name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="kap_name"
                required
                onChange={(e) => setKapName((_prev) => e.target.value)}
              />
            </div>
  
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={async e => {
                e.preventDefault();
                await createKap.mutate({
                    title: kapName
                })
                onClose();
              }}
            >
              Create
            </button>
            <button
              className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    );
  };