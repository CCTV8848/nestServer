import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>,
    ) { }

    async create(article: Partial<Article>): Promise<Article> {
        return this.articleModel.create(article);
    }

    async findAll(): Promise<Article[]> {
        return this.articleModel.find().exec();
    }

    async findOne(id: string): Promise<Article> {
        const result = await this.articleModel.findById(id).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }

    async update(id: string, article: Partial<Article>): Promise<Article> {
        const result = await this.articleModel.findByIdAndUpdate(id, article, { new: true }).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }

    async remove(id: string): Promise<Article> {
        // 在 Mongoose 6 及更高版本中，`findByIdAndRemove` 方法已被弃用，建议使用 `findByIdAndDelete` 替代
        const result = await this.articleModel.findByIdAndDelete(id).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }

    async incrementReadCount(id: string): Promise<Article> {
        const result = await this.articleModel.findByIdAndUpdate(
            id,
            { $inc: { readCount: 1 } },
            { new: true },
        ).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }

    async incrementLikeCount(id: string): Promise<Article> {
        return this.articleModel.findByIdAndUpdate(
            id,
            { $inc: { likeCount: 1 } },
            { new: true },
        ).exec();
        
    }

    async addReply(id: string, reply: { content: string }): Promise<Article> {
        return this.articleModel.findByIdAndUpdate(
            id,
            { $push: { replies: { ...reply, replyTime: new Date() } } },
            { new: true },
        ).exec();
    }
}