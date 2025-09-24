import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from './article.schema';

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>,
    ) { }
    // 创建文章
    async create(article: Partial<Article>): Promise<Article> {
        return this.articleModel.create(article);
    }
    // 查找所有文章
    async findAll(): Promise<Article[]> {
        return this.articleModel.find().exec();
    }
    // 查找文章
    async findOne(id: string): Promise<Article> {
        const result = await this.articleModel.findById(id).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }
    // 更新文章
    async update(id: string, article: Partial<Article>): Promise<Article> {
        const result = await this.articleModel.findByIdAndUpdate(id, article, { new: true }).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }
    // 删除文章
    async remove(id: string): Promise<Article> {
        // 在 Mongoose 6 及更高版本中，`findByIdAndRemove` 方法已被弃用，建议使用 `findByIdAndDelete` 替代
        const result = await this.articleModel.findByIdAndDelete(id).exec();
        if (result === null) {
            throw new Error(`Article with id ${id} not found`);
        }
        return result;
    }
    // 增加文章阅读量
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
    // 为文章点赞
    async incrementLikeCount(id: string): Promise<Article> {
        return this.articleModel.findByIdAndUpdate(
            id,
            { $inc: { likeCount: 1 } },
            { new: true },
        ).exec();
    }

    // 添加一级回复
    async addReply(id: string, reply: { content: string; userId: string }): Promise<Article> {
        const newReply = {
            ...reply,
            replyTime: new Date(),
            likeCount: 0,
            replies: []
        };

        return this.articleModel.findByIdAndUpdate(
            id,
            { $push: { replies: newReply } },
            { new: true },
        ).exec();
    }

    // 回复已有回复（二级回复）
    async replyToReply(articleId: string, replyId: string, reply: { content: string; userId: string }): Promise<Article> {
        // 确保 replyId 是有效的 ObjectId
        const replyObjectId = new Types.ObjectId(replyId);

        const newReply = {
            content: reply.content,
            userId: reply.userId,
            replyTime: new Date(),
            likeCount: 0,
            replyTo: replyObjectId
        };

        return this.articleModel.findOneAndUpdate(
            {
                _id: articleId,
                'replies._id': replyObjectId
            },
            { $push: { 'replies.$.replies': newReply } },
            { new: true }
        ).exec();
    }

    // 为回复点赞
    async likeReply(articleId: string, replyId: string, isTopLevelReply: boolean = true, childReplyId?: string): Promise<Article> {
        // 确保 ID 是有效的 ObjectId
        const replyObjectId = new Types.ObjectId(replyId);

        if (isTopLevelReply) {
            // 为一级回复点赞
            return this.articleModel.findOneAndUpdate(
                {
                    _id: articleId,
                    'replies._id': replyObjectId
                },
                { $inc: { 'replies.$.likeCount': 1 } },
                { new: true }
            ).exec();
        } else {
            // 为二级回复点赞
            const childReplyObjectId = new Types.ObjectId(childReplyId);

            return this.articleModel.findOneAndUpdate(
                {
                    _id: articleId,
                    'replies._id': replyObjectId,
                    'replies.replies._id': childReplyObjectId
                },
                { $inc: { 'replies.$[outer].replies.$[inner].likeCount': 1 } },
                {
                    arrayFilters: [
                        { 'outer._id': replyObjectId },
                        { 'inner._id': childReplyObjectId }
                    ],
                    new: true
                }
            ).exec();
        }
    }

    // 获取回复列表（支持分页）
    async getReplies(articleId: string, page: number = 1, limit: number = 10): Promise<any> {
        const article = await this.articleModel.findById(articleId).exec();

        if (!article) {
            throw new Error(`Article with id ${articleId} not found`);
        }

        // 计算分页
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // 截取当前页的回复
        const repliesOnPage = article.replies.slice(startIndex, endIndex);

        return {
            totalReplies: article.replies.length,
            currentPage: page,
            totalPages: Math.ceil(article.replies.length / limit),
            replies: repliesOnPage
        };
    }
}