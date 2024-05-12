import { Inject, Service } from 'typedi';
import { IProfileService } from './interfaces/IProfileService';
import { Profile } from '../models/Profile';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import { CourseRepository } from '../repositories/CourseRepository';
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

@Service()
export class RecommenderSystem {

    @Inject(() => CourseRepository)
	private courseRepository!: ICourseRepository;

    /**
     * Create full matrix between courses and categories
     */
    public async createMatrix(): Promise<{ [x: number]: number[]; }[]> {
        const matrix: number[][] = [];
        const movieGenres: MovieGenre[] =  await this.recommenderRepo.getMovieGenre();
        // Sử dụng Set để lưu trữ các giá trị không trùng nhau
        const uniqueMovieIds = new Set<number>();
        const uniqueGenreIds = new Set<number>();
        // Lặp qua mảng và thêm giá trị vào Set
        movieGenres.forEach((movieGenre: MovieGenre) => {
            uniqueMovieIds.add(movieGenre.getDataValue('movie_id'));
            uniqueGenreIds.add(movieGenre.getDataValue('genre_id'));
        });
        
        // Chuyển Set thành mảng
        const uniqueMovieIdsArray = Array.from(uniqueMovieIds);
        const uniqueGenreIdsArray = Array.from(uniqueGenreIds);
        uniqueMovieIdsArray.sort((a, b) => a - b);
        uniqueGenreIdsArray.sort((a, b) => a - b);

        // console.log(uniqueMovieIdsArray);
        // console.log(uniqueGenreIdsArray);
        const maxMovieId = Math.max(...uniqueMovieIdsArray);
        const maxGenreId = Math.max(...uniqueGenreIdsArray);

        // for(const movie of movies){

        // }
        const rows = maxMovieId+1;
        const cols = maxGenreId+1;

        for (let i = 0; i < rows; i++) {
            const row: number[] = [];
            for (let j = 0; j < cols; j++) {
                row.push(0);
            }
            // Thêm hàng vào mảng 2 chiều
            matrix.push(row);
        }
        movieGenres.forEach((movieGenre: MovieGenre) => {
            const movie_id = movieGenre.getDataValue('movie_id');
            const genre_id = movieGenre.getDataValue('genre_id');
            matrix[movie_id][genre_id] = 1;
        });
        // Convert array to arr have key and value
        const array2DWithCustomKeys = matrix.map((subArray, index) => ({
            [index]: subArray
            }));
        // In mảng 2 chiều đã tạo
        // console.log(matrix);
        // const matrix2D: number[][] = [];
        // matrix2D.push(matrix[1]);
        // matrix2D.push(matrix[2]);
        // console.log(matrix2D);

        return array2DWithCustomKeys;
    }
}