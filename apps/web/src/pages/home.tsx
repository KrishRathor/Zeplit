import { selectedSidebarOption } from "@/atoms/selectedSidebarOption";
import { Apps } from "@/components/Apps";
import { Content } from "@/components/Home";
import { Sidebar } from "@/components/Sidebar";
import { SideBarMenuOptions } from "@/utils/enums";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

const Home: React.FC = () => {
    const selectedOption = useRecoilValue(selectedSidebarOption);
    const router = useRouter();

    useEffect(() => {
        if (window !== undefined) {
            const token = localStorage.getItem('token');
            !token && router.push('/signin');
        }
    }, [])

    return (
        <div className="flex h-screen w-screen m-0 p-0 overflow-y-auto" >
            <Sidebar />
            {
                selectedOption === SideBarMenuOptions.Kaps ? 
                    <Content /> : 
                selectedOption === SideBarMenuOptions.Apps ? 
                    <Apps /> : 
                ''
            }
        </div>
    )
}

export default Home;