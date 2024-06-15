import { Inject, Service } from 'typedi';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from '../utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone';
import { Document } from "langchain/document";

@Service()
export class PineconeService {
      /* Function to simulate fetching data from the database */
    fetchFakeData = async () => {
      return [
        { id: 1, content: 'This is the content of the first document.' },
        { id: 2, content: 'Here is some text for the second document.' },
        { id: 3, content: 'The third document contains different content.' },
        // Add more fake documents as needed
      ];
    };

    async pushDataToPinecone(): Promise<any> {
        try {
            /* Fetch fake data instead of connecting to a real database */
            const rows = await this.fetchFakeData();
            /* Map the fetched rows to Document objects */
            const rawDocs = rows.map(row => new Document({ 
              pageContent: row.content, 
              metadata: { id: row.id } 
            }));
        
            /* Split text into chunks */
            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 1000,
              chunkOverlap: 200,
            });
            const docs = await textSplitter.splitDocuments(rawDocs);
            console.log(docs);
            console.log('creating vector store...');
            /* Create and store the embeddings in the vectorStore */
            const embeddings = new OpenAIEmbeddings();
            const index = pinecone.Index(PINECONE_INDEX_NAME); // Change to your own index name
        
            // Embed the documents
            await PineconeStore.fromDocuments(docs, embeddings, {
              pineconeIndex: index,
              namespace: PINECONE_NAME_SPACE,
              textKey: 'text',
            });
            console.log('Done');
        } catch (error) {
            console.log('error', error);
            throw new Error('Failed to ingest your data');
        }
    }
}
