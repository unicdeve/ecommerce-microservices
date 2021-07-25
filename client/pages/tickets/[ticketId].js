import { useRequest } from '../../hooks/use-request';

function TicketDetail({ ticket }) {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		initialState: { ticketId: ticket.id },
		onSuccess: (data) => console.log('order data', data),
	});

	return (
		<div>
			<h1>{ticket.title}</h1>
			<p>Price: ${ticket.price}</p>
			{errors}
			<button className='btn btn-primary' onClick={async () => doRequest()}>
				Purchase
			</button>
		</div>
	);
}

TicketDetail.getInitialProps = async (context, axios) => {
	const { ticketId } = context.query;

	const { data } = await axios.get(`/api/tickets/${ticketId}`);

	return { ticket: data };
};

export default TicketDetail;
