import { useSearchParams } from 'react-router-dom';
import { Box, Button, Input, Text } from '../components';
import { cn } from '../lib/cn';
import './SearchResults.css';

export type SearchResultItem = {
	id: string;
	name: string;
	type: 'business' | 'individual';
	service: string;
	address?: string;
	phone: string;
	avatarUrl?: string;
};

function getMockResultsByCity(_city: string): SearchResultItem[] {
	return [
		{
			id: '1',
			name: 'Riverside Sound Studio',
			type: 'business',
			service: 'Recording Studio',
			address: '124 Main St, Suite 200',
			phone: '(555) 123-4567',
			avatarUrl: undefined
		},
		{
			id: '2',
			name: 'Alex Chen',
			type: 'individual',
			service: 'Trumpet',
			phone: '(555) 987-6543',
			avatarUrl: undefined
		},
		{
			id: '3',
			name: 'Downtown Music Co.',
			type: 'business',
			service: 'Music Store',
			address: '88 Oak Avenue',
			phone: '(555) 246-8135',
			avatarUrl: undefined
		}
	];
}

function Avatar({ item }: { item: SearchResultItem }) {
	const initial = item.name.charAt(0).toUpperCase();
	return (
		<div className={cn('uk-border', 'SearchResults-avatar')}>
			{item.avatarUrl ?
				<img src={item.avatarUrl} alt='' className='SearchResults-avatarImg' />
			:	<span className='SearchResults-avatarInitial'>{initial}</span>}
		</div>
	);
}

export function SearchResults() {
	const [searchParams, setSearchParams] = useSearchParams();
	const city = searchParams.get('city') ?? '';
	const results = city.trim() ? getMockResultsByCity(city) : [];

	return (
		<div className='SearchResults-root'>
			<form
				className='SearchResults-form'
				onSubmit={e => {
					e.preventDefault();
					const form = e.currentTarget;
					const input = form.querySelector<HTMLInputElement>('input[name="city"]');
					const value = input?.value?.trim() ?? '';
					setSearchParams(value ? { city: value } : {});
				}}>
				<Input name='city' type='text' placeholder='Enter city name' defaultValue={city} autoComplete='off' />
				<Button type='submit'>Search</Button>
			</form>

			{city && (
				<>
					<Text className='SearchResults-title'>Results for “{city}”</Text>
					<ul className='SearchResults-list'>
						{results.map(item => (
							<li key={item.id} className='uk-item-active uk-border SearchResults-listItem'>
								<Avatar item={item} />
								<div className='SearchResults-listItemBody'>
									<Text className='SearchResults-name'>{item.name}</Text>
									<Text className='SearchResults-service'>{item.service}</Text>
									{item.type === 'business' && item.address && (
										<Text className='SearchResults-address'>{item.address}</Text>
									)}
									<Text className='SearchResults-phone'>{item.phone}</Text>
								</div>
							</li>
						))}
					</ul>
					{results.length === 0 && <Text className='SearchResults-muted'>No results.</Text>}
				</>
			)}

			{!city && <Text className='SearchResults-muted'>Enter a city and click Search to see results.</Text>}
		</div>
	);
}
