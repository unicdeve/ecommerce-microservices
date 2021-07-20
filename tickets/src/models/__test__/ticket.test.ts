import { Ticket } from '../ticket';

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 40,
		userId: '123',
	});
	return await ticket.save();
};

it('implements optimistic currency control', async () => {
	// create an instance of a ticket
	const ticket = await buildTicket();

	// save the ticket to the database

	// fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// make two different changes to the tickets fetched
	firstInstance!.set({ price: 2200 });
	secondInstance!.set({ price: 1020 });

	// save the first fetched ticket, this should work as expect
	await firstInstance!.save();

	// save the second fetched ticket, this should fail
	try {
		await secondInstance!.save();
	} catch (err) {
		return;
	}

	throw new Error('Should not reach here');
});
