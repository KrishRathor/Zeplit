import { emailCode } from "@/atoms/emailCode";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [email, setEmail] = useState<string>("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const codeFromBackend = useRecoilValue(emailCode);
  const router = useRouter();

  const handleChange = (index: number, e: any) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < inputRefs.length - 1) {
      //@ts-ignore
      inputRefs[index + 1].current.focus();
    }
  };

  const verify = api.email.verifyEmail.useMutation({
    onSuccess: (data) => {
      router.push("/signin");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let code = "";
    otp.map((item) => (code += item));

    if (code === JSON.stringify(codeFromBackend)) {
      const email = router.query.e;
      email && typeof email === "string" ? setEmail(email) : "";
      console.log(email);
      if (email && typeof email === "string") {
        await verify.mutate({
          email: email,
          correct: true,
        });
      }
    } else {
        console.log(`Incorrect Code`);
    }
  };

  return (
    <div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black py-12">
        <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-6 pb-9 pt-10 shadow-xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="text-3xl font-semibold">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {email}</p>
              </div>
            </div>

            <div>
              <form action="" method="post">
                <div className="flex flex-col space-y-16">
                  <div className="mx-auto flex w-full max-w-xs flex-row items-center justify-between">
                    {inputRefs.map((ref, index) => (
                      <div key={index} className="h-16 w-16">
                        <input
                          //@ts-ignore
                          ref={ref}
                          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg text-black outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
                          type="text"
                          name={`otp-${index}`}
                          maxLength={1}
                          value={otp[index]}
                          onChange={(e) => {
                            handleChange(index, e);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        className="flex w-full flex-row items-center justify-center rounded-xl border border-none bg-blue-700 py-5 text-center text-sm text-white shadow-sm outline-none"
                        onClick={handleSubmit}
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
                      <p>Didn't recieve code?</p>{" "}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
