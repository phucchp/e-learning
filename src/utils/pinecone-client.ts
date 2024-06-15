import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    console.log('❓ Missing PINECONE_API_KEY in .env🌳!');
  throw new Error('Pinecone environment or api key vars missing');
}
let pinecone:Pinecone;
async function initPinecone(): Promise<Pinecone> {
  try {
    const pinecone = new Pinecone();

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

(async () => {
     pinecone = await initPinecone();
  })();
  
export { pinecone };