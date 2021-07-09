import router from 'next/router';
import { useEffect } from 'react';
import { useRequest } from '../../hooks/use-request';

export default function Signout() {
	const { values, errors, onChange, doRequest } = useRequest({
		url: '/api/users/signout',
		method: 'get',
		initialState: {},
		onSuccess: (_) => router.push('/'),
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing you out...</div>;
}
