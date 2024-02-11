import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const uploadImage = async (userId: string, file: File, name : string) => {
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);

  const snap = await getDoc(doc(db, "wardrobe", userId));
  const items = snap.data()?.items ?? [];
  items.push({
    link: downloadURL,
    name: name
  })
  await setDoc(doc(db, "wardrobe", userId), { items }, { merge : true });
}