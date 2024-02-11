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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

type Item = {
  link: string;
  name: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const messageRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [items, setItems] = useState<Item[] | null>(null);

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
            console.log(doc)
            setItems(doc.data()?.items);
          }
        );
      } else {
        router.push("/");
      }
    });
  }, []);

  function handleUpload() {
    if (messageRef.current && messageRef.current.value) {
    } else {
      setError("Item name can't be empty!");
      return;
    }

    if (selectedFiles.length == 0) {
      setError("Please upload the picture of the item!");
      return;
    }

    uploadImage(user!.uid, selectedFiles[0], messageRef.current.value).then((response) => {
        router.reload();
      }
    );
  }

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  return (
    <main
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] overflow-hidden w-screen items-center`}
    >
      <Header></Header>
      <div className="w-[80%] min-w-[80%] flex flex-col h-[100%] mt-[100px]">
        <Card className="w-[350px] mb-10">
          <CardHeader>
            <CardTitle>Upload Clothes</CardTitle>
            <CardDescription>
              Upload your wardrobe to vestium to get the best experience.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger className="bg-[#ea580c] p-[2%] rounded-md">
                Upload
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Item</DialogTitle>
                  <DialogDescription>
                    Our algorithms will vectorize your clothing item for
                    recommending outfits from across the web.
                  </DialogDescription>
                </DialogHeader>
                <Input type="file" onChange={handleFileChange}></Input>
                <Input
                  placeholder="What's the name of this item?"
                  ref={messageRef}
                />
                <Button onClick={handleUpload}>Upload</Button>
                <DialogDescription className="text-red-500">
                  {error}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <div className="border-t-2 pt-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-[#FFFAE1]">
            Your Wardrobe
          </h1>
          <div className="flex flex-wrap mt-5">
            {items?.map((item: Item) => {
              return (
                <Card className="min-w-[350px] h-[200px] flex-1">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
