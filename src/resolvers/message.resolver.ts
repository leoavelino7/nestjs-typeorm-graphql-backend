import {
	Args,
	Resolver,
	Query,
	Mutation,
	Parent,
	ResolveField,
	Subscription,
} from '@nestjs/graphql'
import User from 'src/db/models/user.entity'
import Message from 'src/db/models/message.entity'
import RepoService from 'src/repo.service'
import MessageInput, { DeleteMessageInput } from './input/message.input'
import { PubSub } from 'graphql-subscriptions'

const MESSAGE_ADDED_EVENT_NAME = 'messageAdded'

export const pubSub = new PubSub()
@Resolver((of) => Message)
export default class MessageResolver {
	constructor(private readonly repoService: RepoService) {}

	@Query(() => [Message])
	public async getMessages(): Promise<Message[]> {
		return this.repoService.messageRepo.find()
	}

	@Query(() => Message, { nullable: true })
	public async getMessagesFromUser(
		@Args('userId') userId: number,
	): Promise<Message[]> {
		return this.repoService.messageRepo.find({
			where: {
				userId,
			},
		})
	}

	@Query(() => Message, { nullable: true })
	public async getMessage(@Args('id') id: number): Promise<Message> {
		return this.repoService.messageRepo.findOne(id)
	}

	@Mutation(() => Message)
	public async createMessage(
		@Args('data') input: MessageInput,
	): Promise<Message> {
		const message = this.repoService.messageRepo.create({
			content: input.content,
			userId: input.userId,
		})

		const response = await this.repoService.messageRepo.save(message)

		pubSub.publish(MESSAGE_ADDED_EVENT_NAME, {
			[MESSAGE_ADDED_EVENT_NAME]: message,
		})

		return response
	}

	@Mutation(() => Message)
	public async deleteMessage(
		@Args('data') input: DeleteMessageInput,
	): Promise<Message> {
		const message = await this.repoService.messageRepo.findOne(input.id)

		if (!message || message.userId !== input.userId) {
			throw new Error(
				'Message does not exists or you are not the message owner',
			)
		}

		const copy = { ...message }

		await this.repoService.messageRepo.remove(message)

		return copy
	}

	@Subscription(() => Message)
	messageAdded() {
		return pubSub.asyncIterator(MESSAGE_ADDED_EVENT_NAME)
	}

	@ResolveField(() => User, { name: 'user' })
	public async getUser(@Parent() parent): Promise<User> {
		return this.repoService.userRepo.findOne(parent.userId)
	}
}
