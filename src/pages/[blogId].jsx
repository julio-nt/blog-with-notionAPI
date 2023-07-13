import { useRouter } from 'next/router';
import PostContent from '@/components/postContent/PostContent';
import { fetchData } from '@/lib/getTable';
import RootLayout from '@/app/layout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/getImage';
import Head from 'next/head';

export async function getStaticProps() {
    const data = await fetchData();

    return {
        props: {
            tables: data.tables,
            data: data.data
        }
    };
}

export async function getStaticPaths() {
    const data = await fetchData();
    const paths = data.tables.map((table) => ({
        params: { blogId: table.id }
    }));

    return {
        paths,
        fallback: false
    };
}

export default function PostPage({ tables, data }) {
    const router = useRouter();
    const tableId = router.query.blogId;
    const tableIndex = tables.findIndex((table) => table.id === tableId)
    const post = tables[tableIndex]
    const postInfo = data[tableIndex]
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const urls = {};

            const imageUrl = await getImageUrl(post.properties.Imagem.files[0].name);
            urls[post.id] = imageUrl;

            setImageUrls(urls);
        };

        fetchImages();
    }, [tables]);

    return (
        <RootLayout>
            <Head>
                <title>Blog App - {post.properties.Titulo.title[0].plain_text}</title>
            </Head>
            <div className='flex justify-center'>
                <div className='border-2 p-[4rem] bg-[#5496eb] drop-shadow-[-30px_30px_10px_rgba(0,0,0,0.25)] rounded-lg mt-4 mb-4'>
                    <Image
                        src={imageUrls[post.id] || ''}
                        alt='background image'
                        width={885}
                        height={700}
                        className='ml-auto mr-auto drop-shadow-xl rounded'
                    />
                    <PostContent post={post} postPage={postInfo} tables={tables} />
                </div>
            </div>
        </RootLayout>

    )
}
