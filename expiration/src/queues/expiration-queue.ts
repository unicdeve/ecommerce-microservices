import Queue from 'bull';

interface Payload {
	orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiarion', {
	redis: {
		host: process.env.REDIS_HOST,
	},
});

expirationQueue.process(async (job) => {
	// TODO: publish an expiration:complete event for order
	console.log(
		'publish an expiration:complete event for order ',
		job.data.orderId
	);
});

export { expirationQueue };
