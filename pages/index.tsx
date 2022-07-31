import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Posts } from '../typings'


interface Props{ 
  posts: [Posts]

}

export default function Home({posts}: Props) {

  console.log(posts)

  return (
    <div className="max-w-7xl mx-auto">
      
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
<Header />
     
<div className="flex justify-between items-center px-10 bg-yellow-400 border-y border-black py-16 lg:py-20 ">
<div className="space-y-5">
  <h1 className="text-6xl max-w-xl font-serif"> <span className="underline decoration-black decoration-4"> Medium</span> is a place to write, read and connect</h1>
  <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
</div>

  <img className="hidden md:inline-flex h-32 lg:h-full" src="https://www.nicepng.com/png/full/48-483810_medium-logo-png.png" alt="" />




</div>
<div>
{posts.map(post => (
  <Link key={post._id} href={`/post/${post.slug.current}`}>
  <div>
    <img src={urlFor(post.mainImage).url()!} alt="" />
  </div>
  </Link>
) )}
</div>
    </div>
  )
}


export const getServerSideProps = async () => {
  const query = `
  *[_type == "post"]{
  _id,
  title,
  author -> {
  name,
  image,
},
description,
slug,
mainImage

}
  `;

  const posts = await sanityClient.fetch(query);

return{
    props: {
      posts,
    }
  }

}


