import { useState } from 'react';
import axios from 'axios';

export const useRequest = ({ url, method, initialState }) => {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState(null);

	const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const doRequest = async (e) => {
		try {
			const res = await axios[method](url, values);
			setErrors(null);
			return res.data;
		} catch (e) {
			setErrors(
				<div className='alert alert-danger'>
					<h4>Ooops...</h4>
					<ul>
						{e.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest, errors, values, onChange };
};
