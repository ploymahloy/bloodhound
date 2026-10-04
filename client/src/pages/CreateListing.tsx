import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Input, Radio, Select, Textarea } from '../components';
import { SEARCH_CATEGORY_OPTIONS } from '../lib/searchCategories';
import './CreateListing.css';

type ListingTypeValue = 'individual' | 'business';

const FIXED_ERRORS = {
	missing: 'Fill in all required fields.',
	unauthorized: 'Sign in to create a listing.',
	location: 'Could not find that location',
	generic: 'Could not create listing'
} as const;

const parseCreateError = async (response: Response) => {
	if (response.status === 401) return FIXED_ERRORS.unauthorized;
	try {
		const data = (await response.json()) as { error?: string };
		if (data.error === 'Could not find that location') return FIXED_ERRORS.location;
		if (data.error === 'Missing required fields' || data.error === 'Invalid listing type' || data.error === 'Invalid service category') {
			return FIXED_ERRORS.missing;
		}
	} catch {
		// Use the generic sentence when the body is not JSON.
	}
	return FIXED_ERRORS.generic;
};

export const CreateListing = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [type, setType] = useState<ListingTypeValue>('individual');
	const [service, setService] = useState('');
	const [servicesText, setServicesText] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('');
	const [promo, setPromo] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		const trimmedName = name.trim();
		const trimmedService = service.trim();
		const trimmedCity = city.trim();
		const trimmedPhone = phone.trim();

		if (!trimmedName || !trimmedService || !trimmedCity || !trimmedPhone) {
			setError(FIXED_ERRORS.missing);
			return;
		}

		const services = servicesText
			.split(',')
			.map(item => item.trim())
			.filter(Boolean);

		setSubmitting(true);
		try {
			const response = await fetch('/api/listings', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: trimmedName,
					type,
					service: trimmedService,
					services,
					address: address.trim() || undefined,
					city: trimmedCity,
					phone: trimmedPhone,
					promo: promo.trim() || undefined
				})
			});

			if (!response.ok) {
				setError(await parseCreateError(response));
				return;
			}

			const params = new URLSearchParams({
				q: trimmedService,
				city: trimmedCity
			});
			navigate(`/search?${params.toString()}`);
		} catch {
			setError(FIXED_ERRORS.generic);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='CreateListing-page'>
			<section className='CreateListing-panel'>
				<h1 className='CreateListing-title'>Add a listing</h1>
				<p className='CreateListing-tagline'>Show up when people search your city.</p>

				<form className='CreateListing-form' onSubmit={event => void handleSubmit(event)} noValidate>
					<Field label='Name' htmlFor='listing-name' error={Boolean(error && !name.trim())}>
						<Input
							id='listing-name'
							name='name'
							value={name}
							onChange={e => setName(e.target.value)}
							autoComplete='organization'
							required
						/>
					</Field>

					<fieldset className='CreateListing-typeField'>
						<legend className='CreateListing-legend'>Type</legend>
						<div className='CreateListing-typeOptions'>
							<Radio
								name='type'
								value='individual'
								label='Individual'
								checked={type === 'individual'}
								onChange={() => setType('individual')}
							/>
							<Radio
								name='type'
								value='business'
								label='Business'
								checked={type === 'business'}
								onChange={() => setType('business')}
							/>
						</div>
					</fieldset>

					<Field label='Category' htmlFor='listing-service'>
						<Select
							id='listing-service'
							name='service'
							value={service}
							options={SEARCH_CATEGORY_OPTIONS}
							onChange={e => setService(e.target.value)}
							className={service ? undefined : 'CreateListing-select--empty'}
							required
						/>
					</Field>

					<Field
						label='Services'
						htmlFor='listing-services'
						hint='Optional. Comma-separated list of services you offer.'>
						<Input
							id='listing-services'
							name='services'
							value={servicesText}
							onChange={e => setServicesText(e.target.value)}
							placeholder='Session recording, Live gigs'
						/>
					</Field>

					<Field label='Address' htmlFor='listing-address' hint='Optional street address.'>
						<Input
							id='listing-address'
							name='address'
							value={address}
							onChange={e => setAddress(e.target.value)}
							autoComplete='street-address'
						/>
					</Field>

					<Field label='City' htmlFor='listing-city'>
						<Input
							id='listing-city'
							name='city'
							value={city}
							onChange={e => setCity(e.target.value)}
							placeholder='City, state'
							autoComplete='address-level2'
							required
						/>
					</Field>

					<Field label='Phone' htmlFor='listing-phone'>
						<Input
							id='listing-phone'
							name='phone'
							type='tel'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							autoComplete='tel'
							required
						/>
					</Field>

					<Field label='Promo' htmlFor='listing-promo' hint='Optional short offer or note.'>
						<Textarea
							id='listing-promo'
							name='promo'
							value={promo}
							onChange={e => setPromo(e.target.value)}
							rows={3}
						/>
					</Field>

					{error && (
						<p className='CreateListing-error' role='alert'>
							{error}
						</p>
					)}

					<Button type='submit' size='lg' className='CreateListing-submit' disabled={submitting}>
						{submitting ? 'Creating…' : 'Create listing'}
					</Button>
				</form>
			</section>
		</div>
	);
};
