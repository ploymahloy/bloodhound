import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Text } from './Text';
import './ProtectedRoute.css';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { status } = useAuth();

	if (status === 'loading') {
		return (
			<div className='ProtectedRoute-page'>
				<Text className='ProtectedRoute-status'>Loading…</Text>
			</div>
		);
	}

	if (status === 'anonymous') {
		return <Navigate to='/login' replace />;
	}

	return children;
};
