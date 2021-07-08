import axios from 'axios';

function Home({ currentUser }) {
	console.log('on browser', currentUser);

	// axios.get('/api/users/current-user').catch((err) => {});

	return (
		<div>
			<h1>Home page 00</h1>
		</div>
	);
}

Home.getInitialProps = async ({ req }) => {
	if (typeof window === 'undefined') {
		const { data } = await axios
			.get(
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user',
				{
					headers: req.headers,
				}
			)
			.catch((err) => {
				console.log(err.response.data);
			});

		return data;
	} else {
		const res = await axios.get('/api/users/current-user').catch((err) => {
			console.log(err.response.data);
		});

		return res.data;
	}

	console.log('Executed!!!');

	return {};
};

export default Home;
