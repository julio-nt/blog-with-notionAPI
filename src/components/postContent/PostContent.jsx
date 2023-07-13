import Image from 'next/image';

export default function PostContent({ post, postPage, tables }) {
    const title = post.properties.Titulo.title[0].plain_text
    const author = post.properties.Autor.select.name
    const date = post.properties.Data.date.start

    console.log('post page', postPage)

    //Formatar data
    function formatDate(dateString) {
        const months = [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} de ${month} de ${year}`;
    }

    //Lista com outros posts
    const morePosts = tables
        .filter((table) => table.properties.Publicado.checkdiv === true)
        .slice(0, 5);

    const jsx = []
    postPage.results.map((block) => {
        if (block.type === 'paragraph') {
            jsx.push(<p sx={{
                color: block.paragraph.color
            }}>{block.paragraph.rich_text[0]?.plain_text}</p>)
        }
        if (block.type === 'paragraph' && block.paragraph.rich_text.length === 0) {
            jsx.push(<br />)
        }
        if (block.type === 'bulleted_list_item') {
            jsx.push(
                <ul>
                    <li>
                        {block.bulleted_list_item.rich_text[0]?.plain_text}
                    </li>
                </ul>)
        }
        if (block.type === 'quote') {
            jsx.push(
                <div className='border-l-2'>
                    <p className='pl-2'><span>“</span>{block.quote.rich_text[0]?.plain_text}</p>
                </div>)
        }
        if (block.type === 'embed') {
            jsx.push(
                <Image
                    src={block.embed.url}
                    width={883}
                    height={583}
                    alt='Imagem post'
                />
            )
        }
        if (block.type === 'image') {
            jsx.push(
                <Image
                    src={block.image.external ? block.image.external.url : block.image.file.url}
                    width={883}
                    height={583}
                    alt='Imagem post'
                    style={{ width: '100%', height: 'auto' }}
                />
            )
        }
    })
    return (
        <div className='flex justify-center'>
            <div className='max-w-[885px] flex flex-col justify-center'>
                <h1 className='text-4xl font-semibold mb-2 mt-4'>{title}</h1>
                <div className='mb-4'>
                    <h5>Autor: {author}</h5>
                    <h5>{formatDate(date)}</h5>
                </div>
                <hr className='mb-10' />
                <div>
                    <div>
                        <div>{jsx}</div>
                    </div>
                    {/* <div>
                        <h3>Notícias Recentes</h3>
                        <div>
                            {morePosts.map((post, i) => {
                                return (
                                    <div key={i}>
                                        <h3 href={`/blog/${post.id}`}>{post.properties.Titulo.title[0].plain_text}</h3>
                                        <p>{post.properties.Descricao.rich_text[0].plain_text}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
