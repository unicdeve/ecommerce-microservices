import {
	Listener,
	NotFoundError,
	OrderCancelledEvent,
	Subjects,
} from '@unicdeve/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const {
			id,
			ticket: { id: ticketId },
		} = data;
		// find the ticket that the order if cancelling
		const cancelledTicket = await Ticket.findById(ticketId);

		// throw an error, if ticket is not found
		if (!cancelledTicket) throw new NotFoundError();

		// mark the ticket as being cancelled by setting the orderId to undefined
		cancelledTicket.set({ orderId: undefined });
		// save the ticket
		await cancelledTicket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			id: cancelledTicket.id,
			price: cancelledTicket.price,
			title: cancelledTicket.title,
			userId: cancelledTicket.userId,
			orderId: cancelledTicket.orderId,
			version: cancelledTicket.version,
		});

		// ack the message
		msg.ack();
	}
}
