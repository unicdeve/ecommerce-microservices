import { useEffect, useState } from 'react';

function OrderDetail({ order }) {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <p>Order expired.</p>;
	}

	return (
		<div>
			<p>
				Purchasing <b>{order.ticket.title}</b> at ${order.ticket.price}
			</p>
			<p>
				Status: <b>{order.status}</b>
			</p>

			<p>
				Expires at: <b>{timeLeft} seconds left until the order expires</b>
			</p>
		</div>
	);
}

OrderDetail.getInitialProps = async (context, axios) => {
	const { orderId } = context.query;

	const { data } = await axios.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderDetail;
