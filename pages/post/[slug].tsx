import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'


interface Props {
    posts: Post;
}

const Post = ({posts} : Props) => {
    console.log(posts) 
  return (
    <main>
        <Header />
        <img className="w-full h-60 object-cover " src={urlFor(posts.mainImage).url()!} alt="" />

<article>
    <h1 className="text-4xl mt-10 mb-3" >{posts.title}</h1>
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