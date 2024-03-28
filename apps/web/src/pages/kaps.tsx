import { Flow } from "@/components/Flow";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Kaps: React.FC<{ id: number }> = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(true); // Set initial loading state to true
    
    useEffect(() => {
        setLoading(false); // Set loading state to false after the component mounts
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="w-[100vw] h-[100vh] flex" >
            <Flow />
            <div className=" w-[40vw] bg-[#151521]" >

            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.query;
    if (typeof id === "string") {
        const numberedId = parseInt(id);
        return { props: { id: numberedId } };
    } else {
        return { props: { id: null } };
    }
}

export default Kaps;
