import Link from "next/link"
import { useEffect, useState } from 'react'
import { getImageUrl } from "@/lib/getImage";
import Image from "next/image";

export default function HomeContent({ tables }) {
    const initialArray = [];
    const [filterTag, setFilterTag] = useState(initialArray);
    const [imageUrls, setImageUrls] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const handleTag = (tagValue) => {
        if (filterTag.includes(tagValue)) {
            const updatedArray = filterTag.filter(tag => tag !== tagValue);
            setFilterTag(updatedArray);
        } else {
            setFilterTag(oldArray => [...oldArray, tagValue]);
        }
    };

    // Formatar data
    function formatDate(dateString) {
        const months = [
            'JANEIRO',
            'FEVEREIRO',
            'MARÇO',
            'ABRIL',
            'MAIO',
            'JUNHO',
            'JULHO',
            'AGOSTO',
            'SETEMBRO',
            'OUTUBRO',
            'NOVEMBRO',
            'DEZEMBRO'
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day + 1} ${month}, ${year}`;
    }

    // Filtrar posts pela tag
    const filteredPosts =
        filterTag.length > 0
            ? tables.filter((post) => {
                const postTags = []
                post.properties.Tag.multi_select.map((tag) => {
                    postTags.push(tag.name)
                })
                return filterTag.every(tag => postTags.includes(tag));
            })
            : tables;

    // Posts em ordem de acordo com a data da postagem
    const sortedByDateFilteredPosts = [...filteredPosts].sort((a, b) => {
        const dateA = new Date(a.properties.Data.date.start);
        const dateB = new Date(b.properties.Data.date.start);

        return dateB - dateA;
    });

    // Listar todas as tags
    const allTags = [];
    tables.map((post) => {
        if (post.properties.Publicado.checkbox === true) {
            post.properties.Tag.multi_select.map((tag) => {
                if (allTags.includes(tag.name)) {
                    null
                } else { allTags.push(tag.name) }
            })
        }
    });

    //Carregar imagem do Firebase Storage e colocar no src do componente Image
    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true)
            const urls = {};

            for (const item of tables) {
                if (item.properties.Publicado.checkbox === true) {
                    const imageUrl = await getImageUrl(item.properties.Imagem.files[0].name);
                    urls[item.id] = imageUrl;
                }
            }
            setImageUrls(urls);
            setIsLoading(false)
        };

        fetchImages();
    }, [tables]);

    return (
        <div className="pl-[6rem] pr-[6rem] pt-[2rem] max-[586px]:pl-[1rem] max-[586px]:pr-[1rem]">
            {filteredPosts.length === 0 ?
                <h1 className="text-3xl text-center">Nenhum post encontrado</h1>
                :
                <h1 className="text-3xl text-center">Blog do Júlio</h1>
            }
            {filterTag.length > 0 ?
                <p className="text-center">Filtros: {filterTag.join(', ')}</p>
                :
                null
            }
            <div className="mt-[2rem] flex justify-center gap-10 flex-wrap-reverse">
                <div className="grid grid-cols-3 max-[1288px]:grid-cols-1 max-[1726px]:grid-cols-2 gap-4 max-w-[1454px] gap-y-8">
                    {sortedByDateFilteredPosts.map((item) => {
                        if (item.properties.Publicado.checkbox === true) {
                            return (
                                <Link href={`${item.id}`} key={item.id} className="border-2 border-black p-4 w-[396px] max-[464px]:w-[310px] hover:border-4 hover:-translate-y-4 transition ease-in-out hover:bg-stone-300">
                                    {isLoading ?
                                        <h4>Carregando...</h4>
                                        :
                                        <Image
                                            src={imageUrls[item.id] || ''}
                                            width={396}
                                            height={264}
                                            alt={item.properties.Titulo.title[0].plain_text}
                                            className="h-[264px]"
                                        />
                                    }
                                    <p className="text-xs">{formatDate(item.properties.Data.date.start)}</p>
                                    <p className="text-lg font-medium">{item.properties.Tipo.select.name}</p>
                                    <h3 className="text-xl font-semibold">{item.properties.Titulo.title[0].plain_text}</h3>
                                    <p>{item.properties.Descricao.rich_text[0].plain_text}</p>
                                </Link>
                            )
                        }
                    })}
                </div>
                {/* </div> */}
                <div>
                    <div className="flex gap-4">
                        {allTags.map((tag, i) => {
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleTag(tag)}
                                    className={`p-1 border-2 border-sky-500 hover:bg-sky-500/75 transition ${filterTag.includes(tag) ? 'bg-sky-500/75' : null} rounded`}
                                >
                                    {tag}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
