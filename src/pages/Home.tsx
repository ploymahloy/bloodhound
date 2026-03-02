import { useNavigate } from 'react-router-dom';
import { Box, Button, Field, Input, Text } from '../components';
import './Home.css';

export function Home() {
	const navigate = useNavigate();

	return (
		<div className="Home-root">
			<Box className="Home-box">
				<Text className="Home-title">Search by city</Text>
				<form
					onSubmit={e => {
						e.preventDefault();
						const form = e.currentTarget;
						const input = form.querySelector<HTMLInputElement>('input[name="city"]');
						const value = input?.value?.trim() ?? '';
						if (value) navigate(`/search?city=${encodeURIComponent(value)}`);
					}}>
					<Field label="City" className="Home-field">
						<Input name="city" type="text" placeholder="Enter city name" autoComplete="off" />
					</Field>
					<Button type="submit">Search</Button>
				</form>
			</Box>
		</div>
	);
}
