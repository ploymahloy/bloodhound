const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export interface LocationParams {
  latitude: number
  longitude: number
}

export interface LocationApiError {
  name: string
  message: string
  status: number
  body: unknown
}

export function createLocationApiError(
  message: string,
  status: number,
  body: unknown
): LocationApiError {
  return { name: 'LocationApiError', message, status, body }
}

/**
 * GET with latitude and longitude as query parameters.
 * params: { latitude: number, longitude: number }
 * returns: Response
 * throws: LocationApiError
 * Use to retrieve data by coordinates.
 */
export async function fetchDataByCoordinates(params: LocationParams): Promise<Response> {
  const { latitude, longitude } = params
  const url = `${baseUrl}/location?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = await response.text()
    }
    throw createLocationApiError(
      `Location API failed: ${response.status} ${response.statusText}`,
      response.status,
      body
    )
  }
  
  return response
}
