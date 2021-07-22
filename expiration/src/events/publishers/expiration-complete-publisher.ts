import { ExpirationCompleteEvent, Publisher, Subjects } from '@unicdeve/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
