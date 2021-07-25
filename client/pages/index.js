import Link from 'next/link';
import { useEffect } from 'react';
import { useRequest } from '../hooks/use-request';

function Home({ currentUser, tickets }) {
	const ticketsList = tickets.map((t) => {
		return (
			<tr key={t.id}>
				<td>{t.title}</td>
				<td>{t.price}</td>
				<td>
					<Link href={`/tickets/[ticketId]}`} as={`/tickets/${t.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Tickets</h1>

			<table className='table'>
				<thead>
					<tr>
						<td>Title</td>
						<td>Price</td>
						<td>Link</td>
					</tr>
				</thead>

				<tbody>{ticketsList}</tbody>
			</table>
		</div>
	);
}

Home.getInitialProps = async (context, axios, currentUser) => {
	const { data } = await axios.get('/api/tickets');
	return { tickets: data };
};

export default Home;
