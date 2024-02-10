import Image from "next/image";
import { Inter, Koulen } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "@/components/firebase/firebase";
import { Router, useRouter } from "next/router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Input } from "@/components/ui/input";

import Link from "next/link";
import { useTheme } from "next-themes";

const inter = Inter({ subsets: ["latin"] });
const koulen = Koulen({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [chatHistory, setChatHistory] = useState([]);

  // useEffect(() => {

  // }, [setTheme])

  return (
    <main
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] overflow-hidden w-screen items-center`}
    >
      <div className="flex items-center gap-x-8 self-start bg-[#181818] w-screen p-[2%]">
        <img src="/vestium_orange.png" className="h-10" />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Chat
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-10">
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Wardrobe
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex flex-col w-[60%] h-[100%]">
        <div className="flex flex-col h-[80%] max-h-[80%] items-start justify-start w-screen mt-[5%]">
          {chatHistory.length == 0 ? (
            <>
              <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-[#FFFAE1] text-left">
                Feb 11.
              </div>
              <div className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-[#FFFAE1] text-left">
                Hi Yatharth, how can I help you today?
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <Input type="email" placeholder="Ask me for any styling advice!" />
      </div>
    </main>
  );
}
