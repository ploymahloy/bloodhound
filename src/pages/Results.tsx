import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript';
import { usePlaceAutocomplete } from '../hooks/usePlaceAutocomplete';
import { useSearchResults } from '../hooks/useSearchResults';
import { Box, Button, Field, Header, ItemActive, Message, Select, Sidebar, Text } from '../components';
import { type LocationSearchResult } from '../services/locationApi';
import './Results.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type SortKey = 'distance' | 'name';

interface FiltersState {
	category: string;
	maxDistanceMiles: string;
}

const FEET_PER_MILE = 5280;
const METERS_PER_MILE = 1609.344;
const FEET_PER_METER = 3.28084;

/** API returns distance in meters; we display in feet/miles. */
function formatDistance(distanceMeters?: number) {
	if (distanceMeters == null || !Number.isFinite(distanceMeters)) {
		return null;
	}

	const distanceFeet = distanceMeters * FEET_PER_METER;
	if (distanceFeet < FEET_PER_MILE) {
		return `${Math.round(distanceFeet)} ft`;
	}

	const miles = distanceMeters / METERS_PER_MILE;
	return `${miles.toFixed(1)} mi`;
}

function getDisplayName(result: LocationSearchResult) {
	if (typeof result.name === 'string' && result.name.trim().length > 0) {
		return result.name;
	}

	if (typeof result.category === 'string' && result.category.trim().length > 0) {
		return result.category;
	}

	return 'Unknown';
}

function Results() {
	const navigate = useNavigate();
	const headerSearchRef = useRef<HTMLDivElement>(null);
	const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsScript(googleMapsApiKey);
	const { locationName, loading, error, data, missingParams, refetch } = useSearchResults(mapsLoaded);

	usePlaceAutocomplete(headerSearchRef, mapsLoaded, {
		initialValue: locationName ?? '',
		onPlaceSelect: ({ addressText, location: coords }) => {
			if (!coords || !addressText?.trim()) return;
			const params = new URLSearchParams({ location: addressText.trim() });
			navigate(`/results?${params.toString()}`);
		}
	});

	const [filters, setFilters] = useState<FiltersState>({
		category: 'all',
		maxDistanceMiles: 'any'
	});
	const [sortKey, setSortKey] = useState<SortKey>('distance');

	const rawResults = data?.results ?? [];
	const total = data?.total ?? rawResults.length;

	const categories = useMemo(() => {
		const values = new Set<string>();
		for (const item of rawResults) {
			if (typeof item.category === 'string' && item.category.trim().length > 0) {
				values.add(item.category);
			}
		}
		return Array.from(values).sort((a, b) => a.localeCompare(b));
	}, [rawResults]);

	const visibleResults = useMemo(() => {
		let results = rawResults;

		if (filters.category !== 'all') {
			results = results.filter(
				item => typeof item.category === 'string' && item.category.toLowerCase() === filters.category.toLowerCase()
			);
		}

		if (filters.maxDistanceMiles !== 'any') {
			const maxMiles = Number(filters.maxDistanceMiles);
			if (Number.isFinite(maxMiles)) {
				const maxMeters = maxMiles * METERS_PER_MILE;
				results = results.filter(item => {
					if (item.distanceMeters == null || !Number.isFinite(item.distanceMeters)) {
						return true;
					}
					return item.distanceMeters <= maxMeters;
				});
			}
		}

		const sorted = [...results];
		sorted.sort((a, b) => {
			if (sortKey === 'distance') {
				const aValue =
					a.distanceMeters != null && Number.isFinite(a.distanceMeters) ?
						(a.distanceMeters as number)
					:	Number.POSITIVE_INFINITY;
				const bValue =
					b.distanceMeters != null && Number.isFinite(b.distanceMeters) ?
						(b.distanceMeters as number)
					:	Number.POSITIVE_INFINITY;
				return aValue - bValue;
			}

			const aName = getDisplayName(a).toLowerCase();
			const bName = getDisplayName(b).toLowerCase();
			return aName.localeCompare(bName);
		});

		return sorted;
	}, [rawResults, filters, sortKey]);

	const hasResults = visibleResults.length > 0;

	if (missingParams) {
		return (
			<div className='results-page'>
				<Header className='results-header'>
					<Text className='results-title'>Search results</Text>
				</Header>
				<main className='results-main'>
					<Box className='results-empty'>
						<Text>We couldn&apos;t determine your search location.</Text>
						<Button onClick={() => navigate('/')}>Back to search</Button>
					</Box>
				</main>
			</div>
		);
	}

	return (
		<div className='results-page'>
			<Header className='results-header'>
				<div
					className='results-header-search'
					role='search'
					aria-label='Search by location'
				>
					<div
						ref={headerSearchRef}
						className='results-header-search-input'
						aria-label='Location'
					>
						{mapsError && (
							<div className='results-header-search-error' role='alert' aria-live='polite'>
								<Text>Couldn&apos;t load location search.</Text>
								<Button type='button' variant='ghost' size='sm' onClick={() => window.location.reload()}>
									Retry
								</Button>
							</div>
						)}
						{!mapsLoaded && !mapsError && (
							<div className='results-header-search-loading' aria-busy='true' aria-label='Loading location search'>
								<Text>Loading location search…</Text>
							</div>
						)}
					</div>
				</div>
			</Header>
			<main className='results-main'>
				<Sidebar className='results-sidebar' aria-label='Filter results'>
					<Box className='results-filters'>
						<Text className='results-filters-title'>Filter</Text>
						<Field label='Type'>
							<Select
								value={filters.category}
								onChange={event =>
									setFilters(current => ({
										...current,
										category: event.target.value
									}))
								}
								options={[{ value: 'all', label: 'All types' }, ...categories.map(value => ({ value, label: value }))]}
							/>
						</Field>
						<Field label='Distance'>
							<Select
								value={filters.maxDistanceMiles}
								onChange={event =>
									setFilters(current => ({
										...current,
										maxDistanceMiles: event.target.value
									}))
								}
								options={[
									{ value: 'any', label: 'Any distance' },
									{ value: '1', label: 'Up to 1 mi' },
									{ value: '5', label: 'Up to 5 mi' },
									{ value: '25', label: 'Up to 25 mi' }
								]}
							/>
						</Field>
						<Button
							variant='ghost'
							size='sm'
							className='results-filters-reset'
							onClick={() =>
								setFilters({
									category: 'all',
									maxDistanceMiles: 'any'
								})
							}>
							Reset filters
						</Button>
					</Box>
				</Sidebar>
				<section className='results-content' aria-live='polite'>
					<div className='results-toolbar'>
						<div className='results-count'>
							<Text>
								Showing {visibleResults.length} of {total} {total === 1 ? 'result' : 'results'}
							</Text>
						</div>
						<div className='results-sort'>
							<Field label='Sort by'>
								<Select
									value={sortKey}
									onChange={event => setSortKey(event.target.value as SortKey)}
									options={[
										{ value: 'distance', label: 'Distance' },
										{ value: 'name', label: 'Name' }
									]}
								/>
							</Field>
						</div>
					</div>

					{loading && (
						<Box className='results-loading'>
							<Text aria-busy='true'>Loading results…</Text>
						</Box>
					)}

					{error && !loading && (
						<Box className='results-error'>
							<Message variant='error'>
								<Text className='results-error-text'>
									We couldn&apos;t load search results.
									{error.message ? ` ${error.message}` : ''}
								</Text>
							</Message>
							<div className='results-error-actions'>
								<Button onClick={refetch}>Retry</Button>
								<Button variant='ghost' onClick={() => navigate('/')}>
									Back to search
								</Button>
							</div>
						</Box>
					)}

					{!loading && !error && !hasResults && (
						<Box className='results-empty'>
							<Text>No results found for this location.</Text>
							<Button variant='ghost' onClick={() => navigate('/')}>
								Try a different search
							</Button>
						</Box>
					)}

					{!loading && !error && hasResults && (
						<div className='results-list'>
							{visibleResults.map((item, index) => {
								const name = getDisplayName(item);
								const distanceLabel = formatDistance(item.distanceMeters);
								const locationParts = [item.city, item.region].filter(
									value => typeof value === 'string' && value.length > 0
								);
								const locationLabel = locationParts.length > 0 ? locationParts.join(', ') : undefined;

								return (
									<ItemActive
										// eslint-disable-next-line react/no-array-index-key
										key={item.id ?? index}
										className='results-item'>
										<Box className='results-item-inner'>
											<div className='results-item-header'>
												<Text className='results-item-title'>{name}</Text>
												{distanceLabel && <Text className='results-item-distance'>{distanceLabel}</Text>}
											</div>
											<div className='results-item-meta'>
												{item.category && <Text className='results-item-category'>{item.category}</Text>}
												{locationLabel && <Text className='results-item-location'>{locationLabel}</Text>}
											</div>
										</Box>
									</ItemActive>
								);
							})}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

export default Results;
