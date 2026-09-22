import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2x2, Map } from 'lucide-react';
import { Button, Field, Input, Modal, SearchMap, Select, Text } from '../components';
import { cn } from '../lib/cn';
import {
	getSearchMapFallbackCenter,
	searchListings,
	type SearchResultItem
} from '../lib/search';
import { SEARCH_CATEGORY_OPTIONS } from '../lib/searchCategories';
import './SearchResults.css';

function truncate(value: string, maxLength: number) {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, maxLength)}…`;
}

function getResultsTitle(q: string, city: string) {
	const qDisplay = truncate(q, 25);
	const cityDisplay = truncate(city, 25);
	if (q && city) return `Results for “${qDisplay}” in “${cityDisplay}”`;
	if (q) return `Results for “${qDisplay}”`;
	return `Results for “${cityDisplay}”`;
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

function categoryOptionValue(raw: string) {
	const needle = raw.trim().toLowerCase();
	if (!needle) return '';
	const match = SEARCH_CATEGORY_OPTIONS.find(option => option.value.toLowerCase() === needle);
	return match?.value ?? '';
}

export function SearchResults() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
	const [selectedProfile, setSelectedProfile] = useState<SearchResultItem | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [highlightedId, setHighlightedId] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [cityInput, setCityInput] = useState('');
	const [showEmptyError, setShowEmptyError] = useState(false);
	const listItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const q = searchParams.get('q') ?? '';
	const city = searchParams.get('city') ?? '';
	const hasSearch = Boolean(q.trim() || city.trim());
	const results = useMemo(
		() => (hasSearch ? searchListings({ q, city }) : []),
		[hasSearch, city, q]
	);
	const mapFallbackCenter = useMemo(() => getSearchMapFallbackCenter(city), [city]);

	useEffect(() => {
		setQuery(categoryOptionValue(q));
		setCityInput(city);
		setShowEmptyError(false);
	}, [q, city]);

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
		setHighlightedId(null);
	}, [q, city]);

	useEffect(() => {
		if (!highlightedId) return;
		listItemRefs.current[highlightedId]?.scrollIntoView({ block: 'nearest' });
	}, [highlightedId]);

	function openProfile(item: SearchResultItem) {
		setHighlightedId(item.id);
		setSelectedProfile(item);
		setIsProfileModalOpen(true);
	}

	function closeProfile() {
		setIsProfileModalOpen(false);
	}

	function handleMapSelect(item: { id: string }) {
		const match = results.find(result => result.id === item.id);
		if (match) openProfile(match);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const qValue = query.trim();
		const cityValue = cityInput.trim();

		if (!qValue && !cityValue) {
			setShowEmptyError(true);
			return;
		}

		const next: Record<string, string> = {};
		if (qValue) next.q = qValue;
		if (cityValue) next.city = cityValue;
		setSearchParams(next);
	}

	return (
		<div
			className={cn(
				'SearchResults-page',
				mobileView === 'list' ? 'SearchResults-page--list' : 'SearchResults-page--map'
			)}>
			{/* Form */}
			<form className='SearchResults-form' onSubmit={handleSubmit} noValidate>
				<Field
					className='SearchResults-field'
					label='I need a...'
					htmlFor='search-query'
					srOnlyLabel
					error={showEmptyError}
					hint={showEmptyError ? 'Choose what you’re looking for or enter a city.' : undefined}>
					<Select
						id='search-query'
						name='q'
						value={query}
						options={SEARCH_CATEGORY_OPTIONS}
						onChange={e => {
							setQuery(e.target.value);
							if (showEmptyError) setShowEmptyError(false);
						}}
						className={query ? 'SearchResults-input' : 'SearchResults-input SearchResults-select--empty'}
					/>
				</Field>

				<Field className='SearchResults-field' label='City' htmlFor='search-city' srOnlyLabel>
					<Input
						id='search-city'
						name='city'
						type='text'
						placeholder='Enter a city, state, or zip code'
						autoComplete='off'
						value={cityInput}
						onChange={e => {
							setCityInput(e.target.value);
							if (showEmptyError) setShowEmptyError(false);
						}}
						className='SearchResults-input'
					/>
				</Field>

				<Button type='submit' size='lg' className='SearchResults-search'>
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
									ref={node => {
										listItemRefs.current[item.id] = node;
									}}
									className={cn(
										'uk-item-active',
										'uk-border',
										'SearchResults-listItem',
										highlightedId === item.id && 'SearchResults-listItem--selected'
									)}
									aria-current={highlightedId === item.id ? 'true' : undefined}
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
						<SearchMap
							items={results}
							selectedId={highlightedId}
							fallbackCenter={mapFallbackCenter}
							onSelect={handleMapSelect}
						/>
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
