export type GeolocationCoords = {
	latitude: number;
	longitude: number;
};

export type GeolocationResult =
	| { status: 'idle' }
	| { status: 'pending' }
	| { status: 'ready'; coords: GeolocationCoords }
	| { status: 'unavailable'; reason: 'unsupported' | 'denied' | 'error' };

/**
 * Requests the user's position via the HTML5 Geolocation API.
 * Resolves once (success or failure); does not watch continuous updates.
 */
export const requestCurrentPosition = (
	options: PositionOptions = {
		enableHighAccuracy: false,
		timeout: 10_000,
		maximumAge: 60_000
	}
): Promise<GeolocationResult> => {
	if (typeof navigator === 'undefined' || !navigator.geolocation) {
		return Promise.resolve({ status: 'unavailable', reason: 'unsupported' });
	}

	return new Promise(resolve => {
		navigator.geolocation.getCurrentPosition(
			position => {
				resolve({
					status: 'ready',
					coords: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				});
			},
			error => {
				resolve({
					status: 'unavailable',
					reason: error.code === error.PERMISSION_DENIED ? 'denied' : 'error'
				});
			},
			options
		);
	});
};
