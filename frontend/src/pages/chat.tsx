import Image from "next/image";
import { Inter, Koulen } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "@/components/firebase/firebase";
import { Router, useRouter } from "next/router";
import Header from "@/components/header/header";
import { app, auth, db, storage } from "@/components/firebase/firebase";

import { Input } from "@/components/ui/input";
import { onAuthStateChanged } from "firebase/auth";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { userAgent } from "next/server";

type ChatMessage = {
  role: string;
  content: string;
};

const inter = Inter({ subsets: ["latin"] });
const koulen = Koulen({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [user, setUser] = useState<any>(null);

  const messageRef = useRef<HTMLInputElement>(null);

  const get_resp = async (chatHistory: ChatMessage[]) => {
    const response = await fetch("/api/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: chatHistory,
      }),
    });
    return response.json();
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });
  }, []);

  const handleSubmitMessage = async () => {
    console.log("ok");
    if (messageRef.current && messageRef.current.value) {
      console.log("ok");
      let newMessages = [
        ...chatHistory,
        {
          role: "user",
          content: messageRef.current.value,
        },
      ];
      setChatHistory(newMessages);
      setLoadingResponse(true);
      messageRef.current.value = "";

      const response = await fetch("/api/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });
      let response_data = await response.json();
      console.log(response_data);
      if (response.status == 200) {
        newMessages = [...newMessages, response_data.message.message];
        setChatHistory(newMessages);
      }

      setLoadingResponse(false);
    }
  };

  const getDate = () => {
    let currentDate = new Date();

    // Array of month names
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get month and day
    let month = monthNames[currentDate.getMonth()];
    let day = currentDate.getDate();

    // Format the date
    let formattedDate = month + " " + day;
    return formattedDate;
  };

  return (
    <main
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] overflow-hidden w-screen items-center`}
    >
      <Header></Header>
      {user ? (
        <div className="flex flex-col w-[60%] h-[100%]">
          <div className="flex flex-col h-[80%] max-h-[80%] items-start justify-start w-[100%] mt-[5%] overflow-y-auto">
            {chatHistory.length == 0 ? (
              <>
                <motion.div
                  className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-[#FFFAE1] text-left"
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1,
                  }}
                >
                  {getDate()}.
                </motion.div>
                <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-[#FFFAE1] text-left">
                  Hi {user.displayName}, how can I help you today?
                </div>
              </>
            ) : (
              <>
                <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-[#FFFAE1] text-left">
                  Hi Yatharth, how can I help you today?
                </div>
                {chatHistory.map((message, i) => {
                  if (message.role == "user") {
                    return (
                      <motion.div
                        className="self-end scroll-m-20 border-b text-xl font-semibold text-[#FFFAE1] bg-[#ea580c] px-4 py-2 rounded-full"
                        initial={{
                          y: 100,
                          opacity: 0,
                        }}
                        animate={{
                          y: 0,
                          opacity: 100,
                        }}
                        key={i}
                      >
                        {message.content}
                      </motion.div>
                    );
                  } else {
                    return (
                      <motion.div
                        className="scroll-m-20 border-b text-xl font-semibold text-[#1d1d1d] bg-[#FFFAE1] px-4 py-2 rounded-full"
                        initial={{
                          y: 100,
                          opacity: 0,
                        }}
                        animate={{
                          y: 0,
                          opacity: 100,
                        }}
                        key={i}
                      >
                        {message.content}
                      </motion.div>
                    );
                  }
                })}
                {loadingResponse ? (
                  <div className="scroll-m-20 border-b bg-[#FFFAE1] px-4 py-2 rounded-full">
                    <img src="/loading.gif" className="w-[50px]"></img>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>

          <div className="flex flex-row w-[100%] items-center">
            <Input
              type="email"
              placeholder="Ask me for any styling advice!"
              disabled={loadingResponse}
              ref={messageRef}
            />
            <Button onClick={handleSubmitMessage} className="w-[10%] p-2">
              <span>
                <img src="/send_symbol.svg" />
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}