import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Text } from '../components';
import { useAuth } from '../lib/auth';
import './Login.css';

export const Login = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { status } = useAuth();
	const showError = searchParams.get('error') === '1';

	useEffect(() => {
		if (status === 'authenticated') {
			navigate('/', { replace: true });
		}
	}, [status, navigate]);

	const continueWithGoogle = () => {
		window.location.href = '/api/auth/google';
	};

	if (status === 'loading' || status === 'authenticated') {
		return (
			<div className='Login-page'>
				<section className='Login-panel'>
					<Text className='Login-status'>Loading…</Text>
				</section>
			</div>
		);
	}

	return (
		<div className='Login-page'>
			<section className='Login-panel'>
				<Link to='/' className='Login-brand'>
					Bloodhound
				</Link>
				<p className='Login-tagline'>Sign in to manage your presence on the map.</p>
				{showError && (
					<p className='Login-error' role='alert'>
						Sign-in failed
					</p>
				)}
				<Button type='button' size='lg' className='Login-google' onClick={continueWithGoogle}>
					Continue with Google
				</Button>
			</section>
		</div>
	);
};
