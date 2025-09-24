import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { Article } from './article.schema';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 创建文章 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() article: Partial<Article>, @Request() req) {
    // 从请求对象中获取用户信息并添加到文章数据中
    article.author = req.user._id;
    return this.articleService.create(article);
  }

  // 获取所有文章 - 无需登录
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  // 获取单篇文章 - 无需登录
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  // 更新文章 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() article: Partial<Article>) {
    return this.articleService.update(id, article);
  }

  // 删除文章 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  // 增加阅读量 - 无需登录
  @Post(':id/read')
  incrementReadCount(@Param('id') id: string) {
    return this.articleService.incrementReadCount(id);
  }

  // 为文章点赞 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  incrementLikeCount(@Param('id') id: string) {
    return this.articleService.incrementLikeCount(id);
  }

  // 添加回复 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reply')
  addReply(@Param('id') id: string, @Body() reply: { content: string }, @Request() req) {
    // 添加用户ID到回复数据中
    return this.articleService.addReply(id, {
      content: reply.content,
      userId: req.user._id
    });
  }

  // 添加回复的回复（二级回复）- 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reply/:replyId')
  replyToReply(
    @Param('id') id: string,
    @Param('replyId') replyId: string,
    @Body() reply: { content: string },
    @Request() req
  ) {
    return this.articleService.replyToReply(id, replyId, {
      content: reply.content,
      userId: req.user._id
    });
  }

  // 为回复点赞 - 需要登录
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reply/:replyId/like')
  likeReply(
    @Param('id') id: string,
    @Param('replyId') replyId: string,
    @Body() body: { isTopLevelReply?: boolean, childReplyId?: string }
  ) {
    const { isTopLevelReply = true, childReplyId } = body;
    return this.articleService.likeReply(id, replyId, isTopLevelReply, childReplyId);
  }

  // 获取回复列表 - 无需登录
  @Get(':id/replies')
  getReplies(
    @Param('id') id: string,
    @Body() query: { page?: number, limit?: number }
  ) {
    const { page = 1, limit = 10 } = query;
    return this.articleService.getReplies(id, page, limit);
  }
}