/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!process.env.PINECONE_INDEX_NAME) {
    console.log('❓ Missing Pinecone🌳 index name in .env!');
    throw new Error('Missing Pinecone index name in .env file');
}

if (!process.env.PINECONE_NAME_SPACE) {
  console.log('❓ Missing PINECONE_NAME_SPACE in .env!');
}
  
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';
  
  const PINECONE_NAME_SPACE = process.env.PINECONE_INDEX_NAME ?? 'phuchihi'; //namespace is optional for your vectors
  
  export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };
  