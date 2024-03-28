import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const GetAuthCode: React.FC = () => {

    const router = useRouter();

    const auth = api.apps.getAuthCode.useMutation({
        onSuccess: data => {
            console.log(data);
        }
    })

    const [c, setC] = useState<string | undefined>();

    useEffect(() => {
        const getCode = async () => {
            const { code } = router.query;
            console.log('Code:', code);
            if (typeof code === "string") {
                setC(code);
                await auth.mutate({
                    code
                });
            }
        };

        getCode();
    }, [router.query]);

    return (
        <div>
            {c}
        </div>
    );
}

export default GetAuthCode;
