import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request';

function OrderDetail({ order, currentUser }) {
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		initialState: { token: '', orderId: order.id },
		onSuccess: (data) => console.log('data', data),
	});

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

	const handlePayment = async (token) => {
		await doRequest({ token, orderId: order.id });
	};

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

			<StripeCheckout
				token={({ id }) => handlePayment(id)}
				stripeKey='pk_test_jPO1MtcAbyylYSkZe0RGmRHw00QcwqEVKQ'
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>

			{errors}
		</div>
	);
}

OrderDetail.getInitialProps = async (context, axios) => {
	const { orderId } = context.query;

	const { data } = await axios.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderDetail;
