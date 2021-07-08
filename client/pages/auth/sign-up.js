import { useRequest } from '../../hooks/use-request';

const Signup = () => {
	const { values, errors, onChange, doRequest } = useRequest({
		url: '/api/users/signup',
		method: 'post',
		initialState: { email: '', password: '' },
	});

	const { email, password } = values;

	const onSubmit = (e) => {
		e.preventDefault();
		doRequest();
	};

	return (
		<form onSubmit={onSubmit} className='container'>
			<h1>Signup</h1>

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
			<button className='btn btn-primary mt-3'>Sign up</button>
		</form>
	);
};

export default Signup;
