import { Inject, Service } from 'typedi';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import type { Document } from 'langchain/document';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { PINECONE_INDEX_NAME,PINECONE_NAME_SPACE } from '../config/pinecone';
import { pinecone } from '../utils/pinecone-client';
import { makeChain } from '../utils/langchain/makeChain';



@Service()
export class ChatService {
    async chat(req: Request): Promise<string> {
        try{
            const { question, history } = req.body;
            if (!question) {
                throw new Error('No question in the request');
              }
            const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
            const index = pinecone.Index(PINECONE_INDEX_NAME);
                /* create vectorstore*/
            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings({}),
                {
                pineconeIndex: index,
                textKey: 'text',
                namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
                },
            );

                // Use a callback to get intermediate sources from the middle of the chain
            let resolveWithDocuments: (value: Document[]) => void;

            const retriever = vectorStore.asRetriever({
            callbacks: [
                {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
                },
            ],
            });

                //create chain
            const chain = makeChain(retriever);

            const pastMessages = history
            .map((message: [string, string]) => {
                return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
            })
            .join('\n');
            // console.log(pastMessages);

            const response = await chain.invoke({
                question: sanitizedQuestion,
                chat_history: pastMessages,
              });
          
            //   console.log('response', response);
            return response;
        }catch(err){
            console.log('error', err);
            throw(err);
        }
    }

}
