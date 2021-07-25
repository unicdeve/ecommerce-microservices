import { PaymentCreatedEvent, Publisher, Subjects } from '@unicdeve/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
