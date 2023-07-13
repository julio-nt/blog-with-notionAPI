import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/config";

export async function getImageUrl(imageName) {
    const imageRef = ref(storage, `blog/${imageName}`)
    try {
        const src = await getDownloadURL(imageRef)
        return src
    } catch (error) {
        return console.error("Error getting image URL:", error);
        // const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/amazilia-site.appspot.com/o/blog%2FheaderImg1.png?alt=media&token=5143c6c3-4f0b-4ce6-86e6-bdd5bfc6648e'
        // return defaultImage;
    }
}