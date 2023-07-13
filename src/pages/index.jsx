import RootLayout from "@/app/layout";
import HomeContent from "@/components/home/HomeContent";
import { fetchData } from '@/lib/getTable'
import { useEffect, useState } from "react";
import { storage } from "../../firebase/config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import Head from "next/head";

export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: {
      tables: data.tables,
      data: data.data,
    }
  };
}

export default function Home({ tables }) {

  const storageRef = ref(storage, 'blog');
  const url = []

  useEffect(() => {
    const uploadImages = async () => {
      const images = []

      tables.forEach((result) => {
        images.push(result.properties.Imagem.files[0].file.url)
        console.log('aqui ', result)
      })

      try {
        for (const imageUrl of images) {
          const fileName = imageUrl.split("?")[0].split("/").pop();
          const blogRef = ref(storageRef, fileName);
          const response = await fetch(imageUrl)
          const blob = await response.blob()

          await uploadBytes(blogRef, blob);
          const currentUrl = await getDownloadURL(
            ref(storage, `blog/${fileName}`)
          );
          url.push(currentUrl)
          console.log('upload feito!')
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }

    uploadImages()
    console.log('TODAS AS TABELAS ', tables)
    // console.log('TODAS AS IMAGENS ', images)

  }), [tables]

  return (
    <RootLayout>
      <Head>
        <title>Blog App</title>
      </Head>
      <HomeContent tables={tables} />
    </RootLayout>
  )
}
