import { Inject, Service } from 'typedi';
import { Request } from 'express';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';
import { Course } from '../models/Course';
import _ from 'lodash';
import { Op } from 'sequelize';

interface ImportantTerm {
    term: string;
    value: number;
}

interface DocumentImportantTerms {
    document: string;
    importantTerms: ImportantTerm[];
}

@Service()
export class TFIDFService {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository; 

    async getDataDocumentFromCourses() {
        const courses: Course[] =  await this.courseRepository.getAll({
            where : {
                id: {
                    [Op.lte]: 100
                }
            },
            attributes: ['id','courseId', 'title', 'introduction', 'learnsDescription']
        });

        const corpus = [];
        for (const course of courses) {
            let data = course.title + ' ' + course.introduction+ ' '+ course.learnsDescription;
            data = this.cleanString(data);
            corpus.push(data.split(' '));
        }

        const topN = 10; // Số lượng từ quan trọng nhất cần lấy ra
        const importantTerms = this.getImportantTerms(corpus, topN);
        importantTerms.forEach((docInfo, index) => {
            console.log(`Course ${index + 1}:`);
            console.log('Các từ quan trọng:');
            docInfo.importantTerms.forEach(termInfo => {
                console.log(`- ${termInfo.term}: ${termInfo.value}`);
            });
            console.log('------------------------');
        });
        return importantTerms;
    }

    /**
     * Remove special characters
     * @param input 
     * @returns 
     */
    private cleanString(input: string): string {
        // Replace newline characters with spaces
        let cleaned = input.replace(/\n/g, ' ');

        // Remove HTML tags
        // This regular expression matches any HTML tags (e.g., <tag> or </tag>)
        cleaned = input.replace(/<\/?[^>]+(>|$)/g, "");
    
        // Remove special characters
        // This regular expression matches any character that is not a word character (alphanumeric and underscore) or whitespace
        cleaned = cleaned.replace(/[^\w\s]/gi, "");
        cleaned = input.replace(/\n/g, ' ');
        return cleaned;
    }

    /**
     * Tính toán TF của một từ trong một tài liệu.
     * @param {string} term - Từ cần tính toán.
     * @param {string[]} document - Tài liệu dưới dạng mảng các từ.
     * @returns {number} - Giá trị TF của từ trong tài liệu.
     */
    private termFrequency(term: string, document: string[]): number {
        const termCount = document.filter(word => word === term).length;
        return termCount / document.length;
    }

    /**
     * Tính toán IDF của một từ trong tập hợp tài liệu.
     * @param {string} term - Từ cần tính toán.
     * @param {string[][]} corpus - Tập hợp các tài liệu, mỗi tài liệu là một mảng các từ.
     * @returns {number} - Giá trị IDF của từ trong tập hợp tài liệu.
     */
    private inverseDocumentFrequency(term: string, corpus: string[][]): number {
        const docCount = corpus.length;
        const termInDocsCount = corpus.filter(document => document.includes(term)).length;
        return Math.log(docCount / (1 + termInDocsCount));
    }

    /**
     * Tính toán TF-IDF của một từ trong một tài liệu thuộc một tập hợp tài liệu.
     * @param {string} term - Từ cần tính toán.
     * @param {string[]} document - Tài liệu dưới dạng mảng các từ.
     * @param {string[][]} corpus - Tập hợp các tài liệu, mỗi tài liệu là một mảng các từ.
     * @returns {number} - Giá trị TF-IDF của từ trong tài liệu.
     */
    private tfidf(term: string, document: string[], corpus: string[][]): number {
        const tf = this.termFrequency(term, document);
        const idf = this.inverseDocumentFrequency(term, corpus);
        return tf * idf;
    }

    /**
     * Tính toán TF-IDF cho tất cả các từ trong một tài liệu.
     * @param {string[]} document - Tài liệu dưới dạng mảng các từ.
     * @param {string[][]} corpus - Tập hợp các tài liệu, mỗi tài liệu là một mảng các từ.
     * @returns {Record<string, number>} - Đối tượng chứa các từ và giá trị TF-IDF tương ứng.
     */
    private calculateTfIdfForDocument(document: string[], corpus: string[][]): Record<string, number> {
        const tfidfValues: Record<string, number> = {};
        const uniqueTerms = _.uniq(document);
        uniqueTerms.forEach((term: string) => {
            tfidfValues[term] = this.tfidf(term, document, corpus);
        });
        return tfidfValues;
    }

    /**
     * Lấy ra các từ quan trọng nhất từ một tập tài liệu.
     * @param {string[][]} corpus - Tập hợp các tài liệu, mỗi tài liệu là một mảng các từ.
     * @param {number} topN - Số lượng từ quan trọng nhất cần lấy ra.
     * @returns {DocumentImportantTerms[]} - Mảng các đối tượng chứa tài liệu và các từ quan trọng nhất cùng với giá trị TF-IDF.
     */
    private getImportantTerms(corpus: string[][], topN: number): DocumentImportantTerms[] {
        return corpus.map(document => {
            const tfidfValues = this.calculateTfIdfForDocument(document, corpus);
            const sortedTerms = Object.entries(tfidfValues)
                .sort(([, a], [, b]) => b - a)
                .slice(0, topN);
            return {
                document: document.join(' '),
                importantTerms: sortedTerms.map(([term, value]) => ({ term, value }))
            };
        });
    }

}