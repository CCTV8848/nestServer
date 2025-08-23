import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.schema';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() article: Partial<Article>) {
    return this.articleService.create(article);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() article: Partial<Article>) {
    return this.articleService.update(id, article);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Post(':id/read')
  incrementReadCount(@Param('id') id: string) {
    return this.articleService.incrementReadCount(id);
  }

  @Post(':id/like')
  incrementLikeCount(@Param('id') id: string) {
    return this.articleService.incrementLikeCount(id);
  }

  @Post(':id/reply')
  addReply(@Param('id') id: string, @Body() reply: { content: string }) {
    return this.articleService.addReply(id, reply);
  }
}