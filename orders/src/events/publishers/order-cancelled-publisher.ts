import { OrderCancelledEvent, Publisher, Subjects } from '@unicdeve/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
