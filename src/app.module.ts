import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://<woxisunwukong2333>:<myPjLEcpUCrfeOpN>@juejincluster.uofbzaj.mongodb.net/?retryWrites=true&w=majority&appName=juejinCluster'),
    ArticleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
