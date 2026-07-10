
import React from 'react'

export default async function BlogPage({ params }: { params: Promise<{ blogid: string }> }) {
  const resolvedParams = await params;
  console.log(resolvedParams);
  
  return <h1>Reading blog post: {resolvedParams.blogid}</h1>;
}
