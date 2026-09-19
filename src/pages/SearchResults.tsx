import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2x2, Map } from 'lucide-react';
import { Button, Input, Modal, Select, Text } from '../components';
import { SEARCH_CATEGORY_OPTIONS } from '../lib/searchCategories';
import { cn } from '../lib/cn';
import './SearchResults.css';

export type SearchResultItem = {
	id: string;
	name: string;
	type: 'business' | 'individual';
	service: string;
	services?: string[];
	address?: string;
	phone: string;
	avatarUrl?: string;
	promo?: string;
};

function truncate(value: string, maxLength: number) {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, maxLength)}…`;
}

function matchesQuery(item: SearchResultItem, q: string) {
	const needle = q.trim().toLowerCase();
	if (!needle) return true;
	const haystack = [item.name, item.service, ...(item.services ?? [])].join(' ').toLowerCase();
	return haystack.includes(needle);
}

function getResultsTitle(q: string, city: string) {
	const qDisplay = truncate(q, 25);
	const cityDisplay = truncate(city, 25);
	if (q && city) return `Results for “${qDisplay}” in “${cityDisplay}”`;
	if (q) return `Results for “${qDisplay}”`;
	return `Results for “${cityDisplay}”`;
}

function getMockResultsByCity(_city: string): SearchResultItem[] {
	return [
		{
			id: '1',
			name: 'Riverside Sound Studio',
			type: 'business',
			service: 'Recording Studio',
			services: ['Full-band tracking', 'Mixing & mastering', 'Podcast production'],
			address: '124 Main St, Suite 200',
			phone: '(555) 123-4567',
			avatarUrl: undefined,
			promo: 'New artist special: 20% off your first full-day session.'
		},
		{
			id: '2',
			name: 'Alex Chen',
			type: 'individual',
			service: 'Trumpet Player',
			services: ['Session recording', 'Live performance', 'Private lessons'],
			phone: '(555) 987-6543',
			avatarUrl: undefined,
			promo: 'Now accepting new students for spring semester.'
		},
		{
			id: '3',
			name: 'Downtown Music Co.',
			type: 'business',
			service: 'Music Store',
			services: ['Instrument sales', 'Repairs & maintenance', 'Accessory shop'],
			address: '88 Oak Avenue',
			phone: '(555) 246-8135',
			avatarUrl: undefined,
			promo: 'Buy one set of strings, get the second half off.'
		}
	];
}

function Avatar({ item }: { item: SearchResultItem }) {
	const initial = item.name.charAt(0).toUpperCase();
	return (
		<div className={cn('uk-border', 'SearchResults-avatar')}>
			{item.avatarUrl ?
				<img src={item.avatarUrl} alt='' className='SearchResults-avatarImg' />
				: <span className='SearchResults-avatarInitial'>{initial}</span>}
		</div>
	);
}

export function SearchResults() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
	const [selectedProfile, setSelectedProfile] = useState<SearchResultItem | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const q = searchParams.get('q') ?? '';
	const city = searchParams.get('city') ?? '';
	const hasSearch = Boolean(q.trim() || city.trim());
	const results = hasSearch ? getMockResultsByCity(city).filter(item => matchesQuery(item, q)) : [];

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

	useEffect(() => {
		setIsProfileModalOpen(false);
		setSelectedProfile(null);
	}, [q, city]);

	function openProfile(item: SearchResultItem) {
		setSelectedProfile(item);
		setIsProfileModalOpen(true);
	}

	function closeProfile() {
		setIsProfileModalOpen(false);
		setSelectedProfile(null);
	}

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
					const qInput = form.querySelector<HTMLSelectElement>('select[name="q"]');
					const cityInput = form.querySelector<HTMLInputElement>('input[name="city"]');
					const qValue = qInput?.value?.trim() ?? '';
					const cityValue = cityInput?.value?.trim() ?? '';
					const next: Record<string, string> = {};
					if (qValue) next.q = qValue;
					if (cityValue) next.city = cityValue;
					setSearchParams(next);
				}}>
				<Input
					key={`q-${q}`}
					name='q'
					type='text'
					placeholder='I need a...'
					defaultValue={q}
					autoComplete='off'
					className='SearchResults-input'
				/>
				<Input
					key={`city-${city}`}
					name='city'
					type='text'
					placeholder='City'
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
						: <Grid2x2 size={24} aria-hidden='true' />}
				</Button>
			</form>

			{/* List + Map */}
			{hasSearch && (
				<div className='SearchResults-content'>
					<div className='SearchResults-listContainer'>
						<h1 className='SearchResults-title'>{getResultsTitle(q, city)}</h1>
						<div className='SearchResults-list'>
							{results.map(item => (
								<button
									type='button'
									key={item.id}
									className='uk-item-active uk-border SearchResults-listItem'
									onClick={() => openProfile(item)}>
									<Avatar item={item} />
									<div>
										<Text className='SearchResults-name'>{item.name}</Text>
										<Text className='SearchResults-service'>{item.service}</Text>
										{item.type === 'business' && item.address && (
											<Text className='SearchResults-address'>{item.address}</Text>
										)}
										<Text className='SearchResults-phone'>{item.phone}</Text>
									</div>
								</button>
							))}
						</div>
						{results.length === 0 && <Text className='SearchResults-muted'>No results.</Text>}
					</div>

					<div className='SearchResults-mapContainer'>
						<Text className='SearchResults-mapTitle'>Loading map...</Text>
					</div>
				</div>
			)}

			{!hasSearch && (
				<Text className='SearchResults-muted'>Enter what you’re looking for or a city to see results.</Text>
			)}

			<Modal
				isOpen={isProfileModalOpen && !!selectedProfile}
				onClose={closeProfile}
				title={selectedProfile ? selectedProfile.name : undefined}
				className='SearchResults-profileModal'>
				{selectedProfile && (
					<div className='SearchResults-profileModalContent'>
						<div className='SearchResults-profileModalHeader'>
							<Avatar item={selectedProfile} />
							<div className='SearchResults-profileTitleGroup'>
								<Text className='SearchResults-profileName'>{selectedProfile.name}</Text>
								<Text className='SearchResults-profileType'>{selectedProfile.service}</Text>
							</div>
						</div>

						{selectedProfile.promo && (
							<div className='SearchResults-profilePromo'>
								<Text className='SearchResults-profilePromoLabel'>Promo</Text>
								<Text className='SearchResults-profilePromoText'>{selectedProfile.promo}</Text>
							</div>
						)}

						<div className='SearchResults-profileContact'>
							<Text className='SearchResults-profilePromoLabel'>Contact</Text>
							{selectedProfile.address && (
								<Text className='SearchResults-profileContactLine'>
									<span className='SearchResults-profileContactLabel'>Address:</span>
									<span>{selectedProfile.address}</span>
								</Text>
							)}
							<Text className='SearchResults-profileContactLine'>
								<span className='SearchResults-profileContactLabel'>Phone:</span>
								<a href={`tel:${selectedProfile.phone}`} className='SearchResults-profileContactLink'>
									{selectedProfile.phone}
								</a>
							</Text>
						</div>

						<div className='SearchResults-profileServices'>
							<Text className='SearchResults-profileSectionTitle'>Services offered</Text>
							{selectedProfile.services && selectedProfile.services.length > 0 ?
								<ul className='SearchResults-profileServicesList'>
									{selectedProfile.services.map(service => (
										<li key={service} className='SearchResults-profileServiceItem'>
											{service}
										</li>
									))}
								</ul>
								: <Text className='SearchResults-profileServiceFallback'>{selectedProfile.service}</Text>}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
