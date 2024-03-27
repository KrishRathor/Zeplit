import { Content } from "@/components/Home";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Home: React.FC = () => {

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
            <Content />
        </div>
    )
}

export default Home;