import { useRequest } from '../../hooks/use-request';
import router from 'next/router';

const Signin = () => {
	const { values, errors, onChange, doRequest } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		initialState: { email: '', password: '' },
		onSuccess: (data) => router.push('/'),
	});

	const { email, password } = values;

	const onSubmit = async (e) => {
		e.preventDefault();
		await doRequest();
	};

	return (
		<form onSubmit={onSubmit} className='container'>
			<h1>Sign in</h1>

			<div className='form-group'>
				<label htmlFor='email'>Email address</label>
				<input
					name='email'
					type='text'
					className='form-control'
					value={email}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor='password'>Password</label>
				<input
					name='password'
					type='password'
					className='form-control'
					value={password}
					onChange={onChange}
				/>
			</div>

			{errors}
			<button className='btn btn-primary mt-3'>Sign in</button>
		</form>
	);
};

export default Signin;
