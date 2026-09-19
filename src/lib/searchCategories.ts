export const SEARCH_CATEGORIES = [
	'Drummer',
	'Guitarist',
	'Bassist',
	'Pianist',
	'Keyboardist',
	'Vocalist',
	'Trumpet Player',
	'Saxophonist',
	'Violinist',
	'Guitar Teacher',
	'Repair Shop',
	'Venue',
	'Tour',
	'Practice Space',
	'Recording Studio',
	'Music Store'
] as const;

export const SEARCH_HEADLINE_TERMS = [
	'drummer',
	'repair shop',
	'venue',
	'practice space',
	'vocalist',
	'recording studio'
] as const;

export const SEARCH_CATEGORY_OPTIONS = [
	{ value: '', label: 'Select a category' },
	...SEARCH_CATEGORIES.map(category => ({ value: category, label: category }))
];
