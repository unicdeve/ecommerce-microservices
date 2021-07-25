import React from 'react';

function OrderIndex({ orders }) {
	console.log(orders);

	return (
		<div>
			<h1>Your Orders</h1>

			<ol>
				{orders.map((o) => (
					<li key={o.id}>
						{o.ticket.title} - {o.status}
					</li>
				))}
			</ol>
		</div>
	);
}

OrderIndex.getInitialProps = async (context, axios) => {
	const { data } = await axios.get('/api/orders');

	return { orders: data };
};

export default OrderIndex;
