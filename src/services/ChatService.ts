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
import { BadRequestError, NotFound } from '../utils/CustomError';



@Service()
export class ChatService {
    async chat(req: Request): Promise<string> {
        try{
            const { question, history, courseId } = req.body;
            if (!question) {
                throw new Error('No question in the request');
            }

            if (!courseId) {
                throw new BadRequestError('Missing courseId');
            }

            if (courseId !== 'nodejs-express-mongodb-more-the-complete-bootcamp-2024-a6d1399f-1714883821097' && courseId !== 'the-ultimate-react-course-2024-react-redux-more-e02ea8e4-1714883821604') {
                throw new NotFound('No chatbot for course');
            }
            const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
            const index = pinecone.Index(PINECONE_INDEX_NAME);
                /* create vectorstore*/
            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings({}),
                {
                pineconeIndex: index,
                textKey: 'text',
                namespace: courseId, //namespace comes from your config folder
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
