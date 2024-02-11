import Header from "@/components/header/header";
import { app, auth, db, storage } from "@/components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { User } from "firebase/auth";
import { useState } from "react";
import { Router, useRouter } from "next/router";
import { Inter } from "next/font/google";
import { uploadImage } from "@/components/firebase/storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { onSnapshot } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ChatMessage = {
  role?: string;
  content?: string;
  links?: string[];
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [outfits, setOutfits] = useState<any>();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "wardrobe", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(doc(db, "wardrobe", user.uid), {
            items: [],
          });
        }

        const unsub = onSnapshot(
          doc(db, "wardrobe", user.uid),
          { includeMetadataChanges: true },
          (doc) => {
            console.log(doc.data());
            setOutfits(doc.data()?.outfits);
          }
        );
      } else {
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });
  }, []);

  return (
    <main
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] w-screen`}
    >
      <Header></Header>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 pt-[3%] px-[5%]">
        Your Outfits
      </h2>
      <div className="w-screen px-[5%]flex flex-wrap py-[1%] px-[5%] rounded-xl">
        {outfits &&
          outfits.map((outfit: any, index: number) => {
            return (
              <div
                className="w-[100%] h-[450px] bg-black flex-1 hover:cursor-pointer flex"
                onClick={() => {
                  setModalOpen(true);
                  setSelectedIndex(index);
                }}
              >
                <div className="w-[20%] h-[100%] overflow-hidden">
                  <img
                    src={`${outfit.targetImageLink}`}
                    className="w-[100%] h-[100%] object-cover p-2 rounded-lg"
                  ></img>
                </div>
                <div className="flex flex-col w-[80%]">
                  <h2 className="scroll-m-20 border-b py-5 text-3xl font-semibold tracking-tight first:mt-0 px-[2%]">
                    Outfit Recommendation from {outfit.timeCreated}.
                  </h2>
                  <div className="p-[2%] flex flex-wrap gap-x-2">
                    {outfit.matches.map((rec: any) => {
                      return (
                        <Link href={rec.productLink}>
                          <div className="min-w-[150px] h-[175px] relative rounded-md overflow-hidden flex">
                            <img
                              src={rec.imageLink}
                              className="w-[100%] h-[100%] object-cover absolute"
                            ></img>
                            <div className="bg-gradient-to-r from-black absolute object-cover w-[100%] h-[100%]"></div>
                            <div className="absolute text-white p-[20px] self-end">
                              <div>{rec.name}</div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
