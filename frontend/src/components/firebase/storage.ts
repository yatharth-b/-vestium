import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const uploadImage = async (userId: string, file: File, name : string) => {
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
      console.error(error);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        let vec_response = await fetch('http://localhost:3001/wardrobe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            imageUrl: downloadURL
          })
        })
        
        if (vec_response.status == 200) {
          const snap = await getDoc(doc(db, "wardrobe", userId));
          const items = snap.data()?.items ?? [];
          items.push({
            link: downloadURL,
            name: name
          })
          await setDoc(doc(db, "wardrobe", userId), { items }, { merge : true });
        }
      
      });
    }
  );
}