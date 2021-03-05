import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Message from './db/models/message.entity'
import User from './db/models/user.entity'
import RepoService from './repo.service'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User, Message])],
	providers: [RepoService],
	exports: [RepoService],
})
class RepoModule {}

export default RepoModule
