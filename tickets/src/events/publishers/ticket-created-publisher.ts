import { Publisher, Subjects, TicketCreatedEvent } from '@unicdeve/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
