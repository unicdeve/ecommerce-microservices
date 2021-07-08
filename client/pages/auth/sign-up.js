import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
	const [values, setValues] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState([]);

	const { email, password } = values;

	const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post('/api/users/signup', values);
			console.log(res.data);
		} catch (e) {
			setErrors(e.response.data.errors);
		}
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

			{errors.length > 0 && (
				<div className='alert alert-danger'>
					<h4>Ooops...</h4>
					<ul>
						{errors.map((err) => (
							<li key={err.message}>err.message</li>
						))}
					</ul>
				</div>
			)}

			<button className='btn btn-primary mt-3'>Sign up</button>
		</form>
	);
};

export default Signup;
