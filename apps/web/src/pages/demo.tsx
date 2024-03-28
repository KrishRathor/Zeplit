import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";

const Demo: React.FC = () => {

    const router = useRouter();

    const authGmail = api.apps.gmailConnect.useMutation({
        onSuccess: data => {
            console.log(data);
            window.location.href = data.url;
        }
    })

    return (
        <div>
            <button onClick={async () => {
                await authGmail.mutate({});
            }} >Connect to Gmail</button>
        </div>
    )
}

export default Demo;