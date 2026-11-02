import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2x2, Map } from 'lucide-react';
import { Button, CityInput, Field, Modal, SearchMap, Select, Text } from '../components';
import { cn } from '../lib/cn';
import {
	requestCurrentPosition,
	type GeolocationCoords,
	type GeolocationResult
} from '../lib/geolocation';
import {
	DEFAULT_NEAR_RADIUS_MILES,
	getSearchMapFallbackCenter,
	searchListings,
	type SearchResultItem
} from '../lib/search';
import { SEARCH_CATEGORY_OPTIONS } from '../lib/searchCategories';
import './SearchResults.css';

const truncate = (value: string, maxLength: number) => {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, maxLength)}…`;
};

const addressQuery = (address: string, city: string) =>
	[address, city].filter(Boolean).join(', ');

const googleMapsSearchUrl = (name: string) =>
	`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

const getResultsTitle = (q: string, city: string, usingNearYou: boolean) => {
	const qDisplay = truncate(q, 25);
	const cityDisplay = truncate(city, 25);
	if (q && city) return `Results for “${qDisplay}” in “${cityDisplay}”`;
	if (q && usingNearYou) return `Results for “${qDisplay}” within ${DEFAULT_NEAR_RADIUS_MILES} miles`;
	if (q) return `Results for “${qDisplay}”`;
	return `Results for “${cityDisplay}”`;
};

const Avatar = ({ item }: { item: SearchResultItem }) => {
	const initial = item.name.charAt(0).toUpperCase();
	return (
		<div className={cn('uk-border', 'SearchResults-avatar')}>
			{item.avatarUrl ?
				<img src={item.avatarUrl} alt='' decoding='async' className='SearchResults-avatarImg' />
				: <span className='SearchResults-avatarInitial'>{initial}</span>}
		</div>
	);
};

type ResultsState =
	| { kind: 'idle' }
	| { kind: 'loading' }
	| { kind: 'ready'; items: SearchResultItem[] }
	| { kind: 'error'; message: string };

const categoryOptionValue = (raw: string) => {
	const needle = raw.trim().toLowerCase();
	if (!needle) return '';
	const match = SEARCH_CATEGORY_OPTIONS.find(option => option.value.toLowerCase() === needle);
	return match?.value ?? '';
};

export const SearchResults = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
	const [selectedProfile, setSelectedProfile] = useState<SearchResultItem | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [addressCopied, setAddressCopied] = useState(false);
	const addressCopyResetRef = useRef<number | null>(null);
	const [highlightedId, setHighlightedId] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [cityInput, setCityInput] = useState('');
	const [showEmptyError, setShowEmptyError] = useState(false);
	const [userLocation, setUserLocation] = useState<GeolocationResult>({ status: 'idle' });
	const [resultsState, setResultsState] = useState<ResultsState>({ kind: 'idle' });
	const listRef = useRef<HTMLDivElement | null>(null);
	const listItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const q = searchParams.get('q') ?? '';
	const city = searchParams.get('city') ?? '';
	const hasSearch = Boolean(q.trim() || city.trim());
	const needsUserLocation = hasSearch && !city.trim();
	const nearCoords: GeolocationCoords | undefined =
		userLocation.status === 'ready' ? userLocation.coords : undefined;
	const locationPending = needsUserLocation && (userLocation.status === 'idle' || userLocation.status === 'pending');
	const locationUnavailable = needsUserLocation && userLocation.status === 'unavailable';
	const results = resultsState.kind === 'ready' ? resultsState.items : [];
	const mapFallbackCenter = useMemo(
		() => getSearchMapFallbackCenter(city, nearCoords),
		[city, nearCoords]
	);

	useEffect(() => {
		setQuery(categoryOptionValue(q));
		setCityInput(city);
		setShowEmptyError(false);
	}, [q, city]);

	useEffect(() => {
		if (!hasSearch || (needsUserLocation && !nearCoords)) {
			setResultsState({ kind: 'idle' });
			return;
		}

		let cancelled = false;
		setResultsState({ kind: 'loading' });
		void searchListings({
			q,
			city,
			near: nearCoords ? { ...nearCoords, radiusMiles: DEFAULT_NEAR_RADIUS_MILES } : undefined
		})
			.then(items => {
				if (!cancelled) setResultsState({ kind: 'ready', items });
			})
			.catch(() => {
				if (!cancelled) setResultsState({ kind: 'error', message: 'Search failed' });
			});

		return () => {
			cancelled = true;
		};
	}, [hasSearch, needsUserLocation, nearCoords, city, q]);

	useEffect(() => {
		if (!needsUserLocation) {
			setUserLocation({ status: 'idle' });
			return;
		}

		let cancelled = false;
		setUserLocation({ status: 'pending' });
		void requestCurrentPosition().then(result => {
			if (!cancelled) setUserLocation(result);
		});

		return () => {
			cancelled = true;
		};
	}, [needsUserLocation, q]);

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
		setAddressCopied(false);
		if (addressCopyResetRef.current !== null) {
			window.clearTimeout(addressCopyResetRef.current);
			addressCopyResetRef.current = null;
		}
	}, [q, city]);

	useEffect(() => {
		return () => {
			if (addressCopyResetRef.current !== null) {
				window.clearTimeout(addressCopyResetRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;

		let timer = 0;
		const onScroll = () => {
			list.classList.add('SearchResults-list--scrolling');
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				list.classList.remove('SearchResults-list--scrolling');
			}, 120);
		};

		list.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			list.removeEventListener('scroll', onScroll);
			window.clearTimeout(timer);
			list.classList.remove('SearchResults-list--scrolling');
		};
	}, [resultsState.kind]);

	useEffect(() => {
		if (!highlightedId) return;
		listItemRefs.current[highlightedId]?.scrollIntoView({ block: 'nearest' });
	}, [highlightedId]);

	const openProfile = (item: SearchResultItem) => {
		setHighlightedId(item.id);
		setSelectedProfile(item);
		setIsProfileModalOpen(true);
		setAddressCopied(false);
	};

	const closeProfile = () => {
		setIsProfileModalOpen(false);
		setAddressCopied(false);
		if (addressCopyResetRef.current !== null) {
			window.clearTimeout(addressCopyResetRef.current);
			addressCopyResetRef.current = null;
		}
	};

	const copyAddress = (address: string, cityName: string) => {
		void navigator.clipboard
			.writeText(addressQuery(address, cityName))
			.then(() => {
				setAddressCopied(true);
				if (addressCopyResetRef.current !== null) {
					window.clearTimeout(addressCopyResetRef.current);
				}
				addressCopyResetRef.current = window.setTimeout(() => {
					setAddressCopied(false);
					addressCopyResetRef.current = null;
				}, 2000);
			})
			.catch(() => {
				setAddressCopied(false);
			});
	};

	const handleMapSelect = (item: { id: string }) => {
		const match = results.find(result => result.id === item.id);
		if (match) openProfile(match);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
	};

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
					<CityInput
						id='search-city'
						name='city'
						placeholder='City, state, or zip (or leave blank for nearby)'
						value={cityInput}
						onValueChange={value => {
							setCityInput(value);
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
			{hasSearch && locationPending && (
				<Text className='SearchResults-message'>Finding listings near you…</Text>
			)}

			{hasSearch && locationUnavailable && (
				<Text className='SearchResults-message'>
					Location access is needed to search nearby. Allow location or enter a city.
				</Text>
			)}

			{hasSearch && !locationPending && !locationUnavailable && resultsState.kind === 'loading' && (
				<Text className='SearchResults-message'>Searching…</Text>
			)}

			{hasSearch && !locationPending && !locationUnavailable && resultsState.kind === 'error' && (
				<Text className='SearchResults-message'>{resultsState.message}</Text>
			)}

			{hasSearch && !locationPending && !locationUnavailable && resultsState.kind === 'ready' && (
				<div className='SearchResults-content'>
					<div className='SearchResults-listContainer'>
						<h1 className='SearchResults-title'>
							{getResultsTitle(q, city, Boolean(nearCoords))}
						</h1>
						<div className='SearchResults-list' ref={listRef}>
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
									<div className='SearchResults-listItemBody'>
										<Text className='SearchResults-name'>{item.name}</Text>
										<Text className='SearchResults-service'>{item.service}</Text>
									</div>
								</button>
							))}
						</div>
						{results.length === 0 && <Text className='SearchResults-message'>No results.</Text>}
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
				<Text className='SearchResults-message'>Enter what you’re looking for or a city to see results.</Text>
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

						<div className='SearchResults-profileContact'>
							<Text className='SearchResults-profilePromoLabel'>Contact</Text>
							{selectedProfile.address && (
								<Text className='SearchResults-profileContactLine'>
									<span className='SearchResults-profileContactLabel'>Address:</span>
									<a
										className='SearchResults-profileAddressMaps'
										href={googleMapsSearchUrl(selectedProfile.name)}
										target='_blank'
										rel='noopener noreferrer'>
										{selectedProfile.address}
									</a>
									<span className='SearchResults-profileAddressMobile'>
										<span>{selectedProfile.address}</span>
										<button
											type='button'
											className='SearchResults-profileAddressCopy'
											onClick={() => {
												if (selectedProfile.address) {
													copyAddress(selectedProfile.address, selectedProfile.city);
												}
											}}>
											{addressCopied ? 'Copied' : 'Copy'}
										</button>
									</span>
								</Text>
							)}
							<Text className='SearchResults-profileContactLine'>
								<span className='SearchResults-profileContactLabel'>Phone:</span>
								<a href={`tel:${selectedProfile.phone}`} className='SearchResults-profileContactLink'>
									{selectedProfile.phone}
								</a>
							</Text>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
