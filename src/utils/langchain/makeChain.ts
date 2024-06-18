import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Document } from 'langchain/document';
// import type { VectorStoreRetriever } from '@langchain/core/base';
import CONDENSE_TEMPLATE from './condense-template';
import QA_TEMPLATE from './qa-templates';

// Function to combine documents
const combineDocumentsFn = (docs: Document[], separator = '\n\n') => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator) || '';
};

// Function to create the chain
export const makeChain = (retriever: any) => {
    const condenseQuestionPrompt = ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
    const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

    const model = new ChatOpenAI({
        temperature: 0, // Increase temperature to get more creative answers
        modelName: 'gpt-3.5-turbo', // Change this to gpt-4 if you have access
    });
    // Rephrase the initial question into a standalone question based on the chat history
    const standaloneQuestionChain = RunnableSequence.from([
        condenseQuestionPrompt,
        model,
        new StringOutputParser(),
    ]);

    // Retrieve documents based on a query, then format them
    const retrievalChain = retriever.pipe(combineDocumentsFn);
    // Generate an answer to the standalone question based on the chat history and retrieved documents
    const answerChain = RunnableSequence.from([
        {
        context: RunnableSequence.from([
            (input) => input.question,
            retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
        },
        answerPrompt,
        model,
        new StringOutputParser(),
    ]);

    // First generate a standalone question, then answer it based on chat history and retrieved context documents
    const conversationalRetrievalQAChain = RunnableSequence.from([
        {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
        },
        answerChain,
    ]);

    return conversationalRetrievalQAChain;
};
