import { api } from "@/utils/api";
import Image from "next/image";
import React from "react";

export const Apps: React.FC = () => {
    return (
        <div style={{ background: '#0D0D1A' }} className="w-[85vw]" >
            <div className=" text-4xl text-gray-400 font-sans mt-8 mx-auto w-fit " >
                Integrate with Apps to make automated workflows...
            </div>
            <div className="flex flex-wrap m-8" >
                <Gmail />
            </div>
        </div>
    )
}

const Gmail: React.FC = () => {

    const authGmail = api.apps.gmailConnect.useMutation({
        onSuccess: data => {
            window.location.href = data.url;
        }
    })

    return (
        <div className=" border w-[20vw] h-[30vh] rounded-md" >
            <div className="mx-auto w-fit" >
                <Image
                    src={'/gmail.webp'}
                    alt="gmail-logo"
                    width={200}
                    height={200}
                />
            </div>
            <div className="mx-auto w-fit" >
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                        await authGmail.mutate({});  
                    }}
                >
                    Connect
                </button>
            </div>
        </div>
    )
}