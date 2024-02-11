import Header from "@/components/header/header";
import { app, auth, db, storage } from "@/components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { User } from "firebase/auth";
import { useState } from "react";
import { Router, useRouter } from "next/router";
import { Inter } from "next/font/google";
import { uploadImage } from "@/components/firebase/storage";

import { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const messageRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
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

    console.log(selectedFiles)

  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  return (
    <main
      className={`flex h-screen flex-col ${inter.className} bg-[#1E1E1E] overflow-hidden w-screen items-center`}
    >
      <Header></Header>
      <div className="w-[80%] min-w-[80%] flex flex-col h-[100%] mt-[100px]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Upload Clothes</CardTitle>
            <CardDescription>
              Upload your wardrobe to vestium to get the best experience.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger>
                <Button>Upload</Button>
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
                ></Input>
                <Button onClick={handleUpload}>Upload</Button>
                <DialogDescription className="text-red-500">{error}</DialogDescription>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
