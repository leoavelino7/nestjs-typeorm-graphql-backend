import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RepoService } from './repo.service'

@ApiTags('app')
@Controller()
export class AppController {
	constructor(private readonly repoService: RepoService) {}

	@Get()
	@ApiOperation({ summary: 'Hello world' })
	@ApiResponse({
		status: 200,
		description: 'Success',
		content: {
			'text/html': {
				example: '10',
			},
		},
	})
	async getHello(): Promise<number> {
		return await this.repoService.messageRepo.count()
	}
}
