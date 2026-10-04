import { useEffect, useState } from 'react';
import { Button, Message } from '../components';
import './Health.css';

type HealthResponse = {
	status: 'ok' | 'error';
	client: boolean;
	api: boolean;
	database: boolean;
	error?: string;
};

type LoadState =
	| { kind: 'idle' }
	| { kind: 'loading' }
	| { kind: 'ok'; data: HealthResponse }
	| { kind: 'error'; message: string; data?: HealthResponse };

export const Health = () => {
	const [state, setState] = useState<LoadState>({ kind: 'idle' });

	const checkHealth = async () => {
		setState({ kind: 'loading' });
		try {
			const response = await fetch('/api/health');
			const data = (await response.json()) as HealthResponse;
			if (!response.ok) {
				setState({
					kind: 'error',
					message: 'Database unreachable',
					data,
				});
				return;
			}
			setState({ kind: 'ok', data });
		} catch {
			setState({ kind: 'error', message: 'Database unreachable' });
		}
	};

	useEffect(() => {
		void checkHealth();
	}, []);

	const data = state.kind === 'ok' || state.kind === 'error' ? state.data : undefined;
	const clientOk = true;
	const apiOk = state.kind === 'ok' || (state.kind === 'error' && Boolean(data));
	const databaseOk = data?.database === true;

	return (
		<div className='Health-page'>
			<section className='Health-panel'>
				<h1 className='Health-title'>Local stack check</h1>
				<p className='Health-subtitle'>
					Client → API → database connectivity for local development.
				</p>

				<ul className='Health-list' aria-live='polite'>
					<li className='Health-item'>
						<span>Client</span>
						{clientOk ? (
							<Message variant='success'>connected</Message>
						) : (
							<Message variant='error'>unreachable</Message>
						)}
					</li>
					<li className='Health-item'>
						<span>API</span>
						{state.kind === 'loading' || state.kind === 'idle' ? (
							<span className='Health-pending'>checking…</span>
						) : apiOk ? (
							<Message variant='success'>connected</Message>
						) : (
							<Message variant='error'>unreachable</Message>
						)}
					</li>
					<li className='Health-item'>
						<span>Database</span>
						{state.kind === 'loading' || state.kind === 'idle' ? (
							<span className='Health-pending'>checking…</span>
						) : databaseOk ? (
							<Message variant='success'>connected</Message>
						) : (
							<Message variant='error'>unreachable</Message>
						)}
					</li>
				</ul>

				{state.kind === 'error' && (
					<p className='Health-error' role='alert'>
						{state.message}
					</p>
				)}

				<Button onClick={() => void checkHealth()} disabled={state.kind === 'loading'}>
					{state.kind === 'loading' ? 'Checking…' : 'Check again'}
				</Button>
			</section>
		</div>
	);
};
