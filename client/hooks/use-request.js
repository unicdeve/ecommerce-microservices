import { useState } from 'react';
import axios from 'axios';

export const useRequest = ({ url, method, initialState, onSuccess }) => {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState(null);

	const onChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const doRequest = async (data) => {
		try {
			const res = await axios[method](url, data ? data : values);
			setErrors(null);
			onSuccess && onSuccess(res.data);
			return res.data;
		} catch (e) {
			console.log(e);
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

	return { doRequest, errors, values, onChange, setValues };
};
