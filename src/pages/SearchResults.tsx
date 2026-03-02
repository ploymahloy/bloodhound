import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2x2, Map } from 'lucide-react';
import { Button, Input, Text } from '../components';
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

function truncate(value: string, maxLength: number) {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, maxLength)}…`;
}

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
	const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
	const city = searchParams.get('city') ?? '';
	const results = city.trim() ? getMockResultsByCity(city) : [];
	const displayCity = truncate(city, 25);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const stored = window.localStorage.getItem('searchResultsMobileView');
		if (stored === 'list' || stored === 'map') {
			setMobileView(stored);
		}
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem('searchResultsMobileView', mobileView);
	}, [mobileView]);

	return (
		<div
			className={cn(
				'SearchResults-page',
				mobileView === 'list' ? 'SearchResults-page--list' : 'SearchResults-page--map'
			)}>
			{/* Form */}
			<form
				className='SearchResults-form'
				onSubmit={e => {
					e.preventDefault();
					const form = e.currentTarget;
					const input = form.querySelector<HTMLInputElement>('input[name="city"]');
					const value = input?.value?.trim() ?? '';
					setSearchParams(value ? { city: value } : {});
				}}>
				<Input
					name='city'
					type='text'
					placeholder='Enter city name'
					defaultValue={city}
					autoComplete='off'
					className='SearchResults-input'
				/>
				<Button type='submit' className='SearchResults-search'>
					Search
				</Button>
				<Button
					type='button'
					className='SearchResults-toggleOption'
					onClick={() => setMobileView(prev => (prev === 'list' ? 'map' : 'list'))}
					aria-label={mobileView === 'list' ? 'Show map view' : 'Show list view'}>
					{mobileView === 'list' ?
						<Map size={24} aria-hidden='true' />
					:	<Grid2x2 size={24} aria-hidden='true' />}
				</Button>
			</form>

			{/* List + Map */}
			{city && (
				<div className='SearchResults-content'>
					<div className='SearchResults-listContainer'>
						<h1 className='SearchResults-title'>Results for “{displayCity}”</h1>
						<div className='SearchResults-list'>
							{results.map(item => (
								<span key={item.id} className='uk-item-active uk-border SearchResults-listItem'>
									<Avatar item={item} />
									<div>
										<Text className='SearchResults-name'>{item.name}</Text>
										<Text className='SearchResults-service'>{item.service}</Text>
										{item.type === 'business' && item.address && (
											<Text className='SearchResults-address'>{item.address}</Text>
										)}
										<Text className='SearchResults-phone'>{item.phone}</Text>
									</div>
								</span>
							))}
						</div>
						{results.length === 0 && <Text className='SearchResults-muted'>No results.</Text>}
					</div>

					<div className='SearchResults-mapContainer'>
						<Text className='SearchResults-mapTitle'>Loading map...</Text>
					</div>
				</div>
			)}

			{!city && <Text className='SearchResults-muted'>Enter a city and click Search to see results.</Text>}
		</div>
	);
}
