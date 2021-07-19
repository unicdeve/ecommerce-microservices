import { OrderCreatedEvent, Publisher, Subjects } from '@unicdeve/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
