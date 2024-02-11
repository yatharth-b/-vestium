import Image from "next/image";
import { Inter, Koulen } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "@/components/firebase/firebase"
import { Router, useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });
const koulen = Koulen({ weight: "400", subsets: ["latin"] });

export default function Home() {

  let [visible, setVisible] = useState([false, false, false, false])

  useEffect(() => {
    setInterval(() => {
      let new_arr = [];
      
      for (let i = 0; i < 4; i++) {
        new_arr.push(Math.random() <= 0.5)
      }

      setVisible(new_arr);
    }, 750)
  })

  const router = useRouter()


  return (
      <main className={`flex h-screen flex-col p-12 ${inter.className} bg-[#FF9900] overflow-hidden w-screen relative`}>

        <div className="flex flex-col flex-grow justify-end">
          <div className="flex flex-row min-w-screen items-end justify-between ">
            <motion.img src="/vestium.png" className="transform-gpu" initial={{
              y : 200
            }} animate={{
              y : 0,
              opacity: 100
            }} transition={{
              duration:0.2
            }}/>
            <motion.div className="text-[20px] rounded-lg bg-[#1E1E1E] px-8 py-2 text-white flex items-center mr-10 hover:bg-gray-900 hover:cursor-pointer opacity-0" animate={{
              opacity:1
            }} onClick={() => {
              signInWithGoogle().then((result : any) => {
                router.push('/chat')
              })
            }}>
              <span><img src="/google_icon.png" className="w-5 mr-2"/></span>
              Sign in
            </motion.div>
          </div>
        </div>
        <img src="/scratches.png" className={`absolute w-[45%] translate-x-[-200px] rotate-45 opacity-${visible[0] ? 100 : 0}`}></img>
        <img src="/scratches.png" className={`absolute w-[45%] translate-x-[200px] rotate-45 opacity-${visible[1] ? 100 : 0}`} ></img>
        <img src="/scratches.png" className={`absolute w-[45%] translate-y-[200px] translate-x-[800px] opacity-${visible[2] ? 100 : 0}`}></img>
        <img src="/scratches.png" className={`absolute w-[45%] translate-x-[-200px] rotate-45 opacity-${visible[3] ? 100 : 0}`}></img>
      </main>
  );
}
