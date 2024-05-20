import { Inject, Service } from 'typedi';
import { IQAService } from './interfaces/IQAService';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BadRequestError, ContentNotFound, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { Question } from '../models/Question';
import { AnswerRepository } from '../repositories/AnswerRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { IAnswerRepository } from '../repositories/interfaces/IAnswerRepository';
import { IQuestionRepository } from '../repositories/interfaces/IQuestionRepository';
import { ResultRepository } from '../repositories/ResultRepository';
import { IResultRepository } from '../repositories/interfaces/IResultRepository';

@Service()
export class QAService implements IQAService {

    @Inject(() => QuestionRepository)
	private questionRepository!: IQuestionRepository;

    @Inject(() => AnswerRepository)
	private answerRepository!: IAnswerRepository;

    @Inject(() => ResultRepository)
	private resultRepository!: IResultRepository;

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

    async getScore(req: Request) {
        const topicId = req.body.topicId;
        const userId = req.payload.userId;
        const questions = await this.getAllQuestionOfTopic(topicId);
        const data = req.body.data;
        const totalQuestion = questions.rows.length; // Total question of Topic
        let totalCorrectAnswer = 0;
        let totalInCorrectAnswer = 0;
        let totalNotAnswer =totalQuestion - data.length;
        for(const item of data) {
            const questionId = item.questionId;
            const answerId=item.answerId;
            let isCorrect = false;
            let isValidQuestion = false;
            for(const question of questions.rows) {
                if(question.id === questionId) {
                    isValidQuestion = true;
                    let isValidAnswer = false;
                    for(const answer of question.answers) {
                        if(answer.id === answerId) {
                            isValidAnswer = true;
                            isCorrect = true;
                        }
                    }
                    if(!isValidAnswer) {
                        throw new BadRequestError(`Invalid question with id :${answerId} and answer with id ${answerId}`);
                    }
                }
            }

            if(!isValidQuestion) {
                throw new BadRequestError(`Invalid question with id:${questionId}, question not in topic: ${topicId}`);
            }

            if(isCorrect) {
                totalCorrectAnswer += 1;
            } else{
                totalInCorrectAnswer += 1;
            }
        }

        // kiểm tra và trả về kết quả , ví dụ 10/15 (TRả về số câu đúng, số câu sai, tổng câu, số câu bỏ qua)
        // {
        //     "data" : [
        //         {
        //             "questionId": 1,
        //             "answerId": 1,
        //         }
        //     ]
        // }
        // Lưu kết quả của user vào model Result
        // Note: Gọi để get result cuối cùng -> Lưu version mới
        const results = await this.resultRepository.getAll({
            where: {
                userId: userId,
                topicId: topicId,
            },
            order: [
                ['version', 'DESC']
            ]
        });
        let version = 1;
        if(results.length > 0) {
            const lastResult = results[0];
            version = lastResult.version + 1;
        }
        const percentCorrect = totalCorrectAnswer/totalQuestion*100;
        await this.resultRepository.create({
            userId: userId,
            topicId: topicId,
            version: version,
            totalQuestion: totalQuestion,
            totalCorrectAnswer: totalCorrectAnswer,
            totalInCorrectAnswer: totalInCorrectAnswer,
            result: `${percentCorrect}%`
        });

        return {
            totalNotAnswer: totalNotAnswer,
            version: version,
            totalQuestion: totalQuestion,
            totalCorrectAnswer: totalCorrectAnswer,
            totalInCorrectAnswer: totalInCorrectAnswer,
            result: `${percentCorrect}%`
        }

    }
}