import { Flow } from "@/components/Flow";
import { api } from "@/utils/api";
import { KapsType } from "@/utils/enums";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Kaps: React.FC<{ id: number }> = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [kap, setKap] = useState<KapsType>();
    
    const getKap = api.kaps.getKapById.useMutation({
        onSuccess: data => {
            if (data.code === 200) {
                data.kap && setKap(data.kap);
            } else {
                toast(data.message);
            }
        }
    })

    useEffect(() => {
        const k = async () => {
            await getKap.mutate({
                id
            })
        }
        k();
    }, [])

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="w-[100vw] h-[100vh] flex" >
            <Flow />
            <div className="text-white w-[40vw] bg-[#0D0D1A]" >
                <p className="text-3xl mt-4 text-white text-center" >{kap?.title}</p>
                <p className="text-md text-gray-400 text-center ml-4" >by {kap?.owner}</p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { id } = context.query;
    if (typeof id === "string") {
        const numberedId = parseInt(id);
        return { props: { id: numberedId} };
    } else {
        return { props: { id: null } };
    }
}

export default Kaps;
