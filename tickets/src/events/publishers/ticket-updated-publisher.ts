import { Publisher, Subjects, TicketUpdatedEvent } from '@unicdeve/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
