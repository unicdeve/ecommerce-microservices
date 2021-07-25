import { useRequest } from '../../hooks/use-request';
import router from 'next/router';

const New = () => {
	const { values, errors, onChange, doRequest, setValues } = useRequest({
		url: '/api/tickets',
		method: 'post',
		initialState: { title: '', price: '' },
		onSuccess: (data) => null,
	});

	const { title, price } = values;

	const onSubmit = async (e) => {
		e.preventDefault();
		await doRequest();
	};

	const onBlur = () => {
		const value = parseFloat(price);
		if (isNaN(value)) return;
		setValues({ ...values, price: value.toFixed(2) });
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Create new ticket</h1>

			<div className='form-group'>
				<label htmlFor='title'>Title</label>
				<input
					name='title'
					type='text'
					className='form-control'
					value={title}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor='price'>Price</label>
				<input
					name='price'
					className='form-control'
					value={price}
					onBlur={onBlur}
					onChange={onChange}
				/>
			</div>

			{errors}
			<button className='btn btn-primary mt-3'>Sign in</button>
		</form>
	);
};

export default New;
