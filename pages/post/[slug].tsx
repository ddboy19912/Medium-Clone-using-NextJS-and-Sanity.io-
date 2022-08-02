import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from "react-portable-text"


interface Props {
    posts: Post;
}

const Post = ({posts} : Props) => {
    console.log(posts) 
  return (
    <main>
        <Header />
        <img className="w-full h-60 object-cover " src={urlFor(posts.mainImage).url()!} alt="" />

<article className='max-w-3xl mx-auto p-5'>
    <h1 className="text-4xl mt-10 mb-3" >{posts.title}</h1>
    <h2 className='text-xl font-light text-gray-500 mb-2' >{posts.description}</h2>
<div className="flex items-center gap-3 ">
    <img className="h-10 w-10 rounded-full" src={urlFor(posts.author.image).url()!} alt="" />
    <p className="text-sm font-extralight">Blog Post by <span className="text-green-600">{posts.author.name}</span> - Published at {new Date(posts._createdAt).toLocaleString()}</p>
</div>
<div>
    <PortableText
    className=''
    content={posts.body}
    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
  serializers={{
    h1: (props: any) => {
        <h1 className="text-2xl font-bold my-5"{...props} />
    },
     h2: (props: any) => {
        <h2 className="text-xl font-bold my-5"{...props} />
    },
     li: ({children}: any) => {
        <li className="ml-4 list-disc">{children} </li>
    },
     link: ({href, children}: any) => {
        <a className="text-blue-500 hover:underline" href={href} >{children}</a>
    },

  }}
    />
</div>
</article>

    </main>
  )
}

export default Post

export const getStaticPaths = async() => {
const query = `
*[_type == "post"]{
  _id,
  title,
  slug {
  current
}
}
`;

const posts = await sanityClient.fetch(query);

const paths = posts.map((post: Post) => ({
params:{
    slug: post.slug.current,
},
}))

return {
    paths,
    fallback: 'blocking',
};

}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  author -> {
  name,
  image,
},
description,
mainImage,
  slug,
body
}

    `;

    const posts = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if(!posts) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            posts,
        }
    }
}