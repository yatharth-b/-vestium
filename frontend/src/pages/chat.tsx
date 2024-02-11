import Image from "next/image";
import { Inter, Koulen } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "@/components/firebase/firebase";
import { Router, useRouter } from "next/router";
import Header from "@/components/header/header";
import { app, auth, db, storage } from "@/components/firebase/firebase";

import { Input } from "@/components/ui/input";
import { User, onAuthStateChanged } from "firebase/auth";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { userAgent } from "next/server";

type ChatMessage = {
  role?: string;
  content?: string;
  links?: string[];
};

const inter = Inter({ subsets: ["latin"] });
const koulen = Koulen({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [apiHistory, setApiHistory] = useState<ChatMessage[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    console.log("api history");
    console.log(apiHistory);
    if (messageRef.current && messageRef.current.value) {
      let newMessage = messageRef.current.value;
      let newMessages = [
        ...chatHistory,
        {
          role: "user",
          content: newMessage,
        },
      ];
      console.log("New messages");
      console.log(newMessages);
      console.log("\n\n");
      setChatHistory(newMessages);
      setLoadingResponse(true);
      messageRef.current.value = "";

      let newAPIHistory = [
        ...apiHistory,
        {
          role: "user",
          content: newMessage,
        },
      ];

      console.log(newAPIHistory);

      const response = await fetch("http://localhost:3001/recommend/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_history: newAPIHistory,
          keywords,
          userId: user!.uid,
        }),
      });
      let response_data = await response.json();

      console.log(response_data);
      // console.log(response_data);
      if (response.status == 200) {
        setApiHistory(
          response_data.conversation_history.map((obj: any) => ({ ...obj }))
        );
        setKeywords(response_data.keywords);

        // let newChatHistory = [...chatHistory, response_data.conversation_history[newMessages.length - 1]];
        let newChatHistory = [
          ...newMessages,
          {
            role: "assistant",
            content: response_data.content,
          },
        ];
        // newChatHistory[newChatHistory.length - 1].content = response_data.content;

        if (response_data.recommendations) {
          
        }

        if (response_data.links) {
          newChatHistory.push({
            links: [...response_data.links],
          });
        }

        // let newChatHistory = [...chatHistory, {"role": "assistant", "content": response_data.content}];

        setChatHistory(newChatHistory);
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
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] w-screen items-center`}
    >
      <Header></Header>
      {user ? (
        <div className="flex flex-col w-[60%] h-[90%] justify-between">
          <div className="flex flex-col items-start justify-start w-[100%] h-[90%] overflow-y-auto">
            {chatHistory.length == 0 ? (
              <>
                <motion.div
                  className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-[#FFFAE1] text-left pt-10"
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1,
                  }}
                >
                  {getDate()}.
                </motion.div>
                <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-[#FFFAE1] text-left ">
                  Hi {user.displayName}, how can I help you today?
                </div>
              </>
            ) : (
              <>
                <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-[#FFFAE1] text-left pt-10">
                  Hi {user.displayName}, how can I help you today?
                </div>
                {chatHistory.map((message, i) => {
                  if (message.role == "user") {
                    return (
                      <motion.div
                        className="self-end scroll-m-20 border-b text-l font-semibold text-[#FFFAE1] bg-[#ea580c] px-4 py-2 rounded-full mt-5 mr-4"
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
                  } else if (message.links) {
                    return (
                      <div className="flex flex-wrap gap-x-2 gap-y-2 py-4 px-2">
                        {message.links.map((link) => {
                          return (
                            <motion.img
                              className="h-[150px] rounded-md"
                              src={link}
                              initial={{
                                y: 100,
                                opacity: 0,
                              }}
                              animate={{
                                y: 0,
                                opacity: 100,
                              }}
                            ></motion.img>
                          );
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <motion.div
                        className="scroll-m-20 border-b text-l font-semibold text-[#1d1d1d] bg-[#FFFAE1] px-4 py-2 rounded-full mt-5"
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
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitMessage()
          }}>
            <div className="flex flex-row w-[100%] items-center h-[10] pb-10">
              <Input
                type="email"
                placeholder="Ask me for any styling advice!"
                disabled={loadingResponse}
                ref={messageRef}
                className="h-[100%]"
              />
              <Button
                onClick={handleSubmitMessage}
                className="ml-5 w-[10%] p-2 h-[110%]"
                disabled={loadingResponse}
              >
                <span>
                  <img src="/send_symbol.svg" />
                </span>
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
