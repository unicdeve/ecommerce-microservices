import {
	Listener,
	NotFoundError,
	OrderCreatedEvent,
	Subjects,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const {
			id,
			ticket: { id: ticketId },
		} = data;
		// find the ticket that the order if reserving
		const currentTicket = await Ticket.findById(ticketId);

		// throw an error, if ticket is not found
		if (!currentTicket) throw new NotFoundError();

		// mark the ticket as being reserved by setting the orderId prop
		currentTicket.set({ orderId: id });
		// save the ticket
		await currentTicket.save();

		// ack the message
		msg.ack();
	}
}
