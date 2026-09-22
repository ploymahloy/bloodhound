import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Input, Select } from '../components';
import { SEARCH_CATEGORY_OPTIONS, SEARCH_HEADLINE_TERMS } from '../lib/searchCategories';
import './Home.css';

const ROTATE_INTERVAL_MS = 2800;

export function Home() {
	const navigate = useNavigate();
	const [termIndex, setTermIndex] = useState(0);
	const [query, setQuery] = useState('');
	const [city, setCity] = useState('');
	const [showEmptyError, setShowEmptyError] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (media.matches) return;

		const id = window.setInterval(() => {
			setTermIndex(index => (index + 1) % SEARCH_HEADLINE_TERMS.length);
		}, ROTATE_INTERVAL_MS);

		return () => window.clearInterval(id);
	}, []);

	const currentTerm = SEARCH_HEADLINE_TERMS[termIndex];

	function fillKeywordFromTerm() {
		setQuery(currentTerm);
		setShowEmptyError(false);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const qValue = query.trim();
		const cityValue = city.trim();

		if (!qValue && !cityValue) {
			setShowEmptyError(true);
			return;
		}

		const params = new URLSearchParams();
		if (qValue) params.set('q', qValue);
		if (cityValue) params.set('city', cityValue);
		navigate(`/search?${params.toString()}`);
	}

	return (
		<div className='Home-page'>
			<section className='Home-hero'>
				<h1 className='Home-headline'>
					<span className='Home-headlineStatic'>Search for a{' '}</span>
					<button
						type='button'
						className='Home-rotatingWord'
						onClick={fillKeywordFromTerm}
						aria-label={`Use “${currentTerm}” as the search term`}
						tabIndex={-1}>
						<span key={termIndex} className='Home-rotatingWordText' aria-live='polite'>
							{currentTerm}
						</span>
					</button>
				</h1>

				<form className='Home-form' onSubmit={handleSubmit} noValidate>
					<Field
						className='Home-field'
						label='I need a...'
						htmlFor='home-query'
						srOnlyLabel
						error={showEmptyError}
						hint={showEmptyError ? 'Choose what you’re looking for or enter a city.' : undefined}>
						<Select
							id='home-query'
							name='q'
							value={query}
							options={SEARCH_CATEGORY_OPTIONS}
							onChange={e => {
								setQuery(e.target.value);
								if (showEmptyError) setShowEmptyError(false);
							}}
							className={query ? 'Home-input' : 'Home-input Home-select--empty'}
						/>
					</Field>

					<Field className='Home-field' label='City' htmlFor='home-city' srOnlyLabel>
						<Input
							id='home-city'
							name='city'
							type='text'
							placeholder='Enter a city, state, or zip code'
							autoComplete='off'
							value={city}
							onChange={e => {
								setCity(e.target.value);
								if (showEmptyError) setShowEmptyError(false);
							}}
							className='Home-input'
						/>
					</Field>

					<Button type='submit' size='lg' className='Home-search'>
						Search
					</Button>
				</form>
			</section>
		</div>
	);
}
