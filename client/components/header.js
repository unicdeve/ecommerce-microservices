import Link from 'next/link';

export default function Header({ currentUser }) {
	const links = [
		!currentUser && {
			label: 'Sign up',
			href: '/auth/sign-up',
		},
		!currentUser && {
			label: 'Sign in',
			href: '/auth/sign-in',
		},
		currentUser && {
			label: 'Sell ticket',
			href: '/tickets/new',
		},
		currentUser && {
			label: 'My orders',
			href: '/orders',
		},
		currentUser && {
			label: 'Sign out',
			href: '/auth/sign-out',
		},
	]
		.filter((link) => link)
		.map(({ label, href }) => (
			<li key={href} className='nav-item'>
				<Link href={href}>
					<a className='nav-link'>{label}</a>
				</Link>
			</li>
		));

	return (
		<nav className='navbar navbar-light bg-light'>
			<Link href='/'>
				<a className='navbar-brand'>Ticketing</a>
			</Link>

			<div className='d-flex justify-content-end'>
				<ul className='nav d-flex align-items-center'>{links}</ul>
			</div>
		</nav>
	);
}
