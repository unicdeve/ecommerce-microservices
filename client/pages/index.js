import axios from 'axios';
import buildClient from '../api/build-client';

function Home({ currentUser }) {
	console.log('on browser', currentUser);

	// axios.get('/api/users/current-user').catch((err) => {});

	return (
		<div>
			<h1>Home page 00</h1>
		</div>
	);
}

Home.getInitialProps = async (context) => {
	const client = buildClient(context);

	const { data } = await client.get('/api/users/current-user').catch((err) => {
		console.log(err.response.data);
	});

	return data;
};

export default Home;
