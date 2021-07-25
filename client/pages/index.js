function Home({ currentUser }) {
	console.log('on browser', currentUser);

	return currentUser ? (
		<div>
			<h1>You are signed in</h1>
		</div>
	) : (
		<div>
			<h1>You are not logged in</h1>
		</div>
	);
}

Home.getInitialProps = async (context, axios, currentUser) => {
	return {};
};

export default Home;
