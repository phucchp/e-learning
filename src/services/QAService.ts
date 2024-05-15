import { Inject, Service } from 'typedi';
import { IQAService } from './interfaces/IQAService';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { Question } from '../models/Question';
import { AnswerRepository } from '../repositories/AnswerRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { IAnswerRepository } from '../repositories/interfaces/IAnswerRepository';
import { IQuestionRepository } from '../repositories/interfaces/IQuestionRepository';

@Service()
export class QAService implements IQAService {

    @Inject(() => QuestionRepository)
	private questionRepository!: IQuestionRepository;

    @Inject(() => AnswerRepository)
	private answerRepository!: IAnswerRepository;

    async createQA(req: Request): Promise<Question[]> {
        const questions = req.body.questions;
        const userId = req.payload.userId;
        const topicId = req.body.topicId;
        const newQuestions: Question[] = [];
        for(const question of questions) {
            // Create question
            const newQuestion: Question = await this.questionRepository.create({
                userId : userId,
                topicId: topicId,
                content: question.question_text
            });
            newQuestions.push(newQuestion);
            const dataAnswer = [];
            for(const answer of question.answers) {
                dataAnswer.push({
                    questionId: newQuestion.id,
                    content: answer.choice_text,
                    isCorrect: answer.is_correct
                });
            }
            // Create answers for question
            const answers = await this.answerRepository.createInBulks(dataAnswer);
        }
        
        return newQuestions;
    }

    async deleteQuestion(questionId: number): Promise<void> {
        const question = await this.questionRepository.findById(questionId);
        if(!question) {
            throw new NotFound('Question not found!');
        }

        // Delete all answers of the question
        const n = await this.answerRepository.deleteAnswerByQuestionId(questionId);
        // Delete questions
        return await this.questionRepository.deleteInstance(question);
    }

    async getAllQuestionOfTopic(topicId: number): Promise<{rows: Question[], count: number}> {
        return await this.questionRepository.getAllQuestionOfTopic(topicId);
    }

}