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

export interface LocationSearchResult {
  id?: string
  name?: string
  category?: string
  /** Distance from search location; API returns meters. Convert to miles/feet for display. */
  distanceMeters?: number
  city?: string
  region?: string
  rating?: number
  [key: string]: unknown
}

export interface LocationSearchResponse {
  results: LocationSearchResult[]
  total?: number
  raw?: unknown
}

/**
 * GET with latitude and longitude as query parameters.
 * params: { latitude: number, longitude: number }
 * returns: Response
 * throws: LocationApiError
 * Use to retrieve data by coordinates.
 */
export async function fetchDataByCoordinates(
  params: LocationParams
): Promise<Response> {
  const { latitude, longitude } = params
  const url = `${baseUrl}/location?latitude=${encodeURIComponent(
    latitude
  )}&longitude=${encodeURIComponent(longitude)}`
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

/**
 * High-level helper that parses the JSON body from the
 * location API into a typed response for UI consumers.
 */
export async function getLocationResultsByCoordinates(
  params: LocationParams
): Promise<LocationSearchResponse> {
  const response = await fetchDataByCoordinates(params)

  let parsed: unknown
  try {
    parsed = await response.json()
  } catch {
    parsed = null
  }

  if (Array.isArray(parsed)) {
    return {
      results: parsed as LocationSearchResult[],
      total: parsed.length,
      raw: parsed,
    }
  }

  if (
    parsed &&
    typeof parsed === 'object' &&
    Array.isArray((parsed as { results?: unknown }).results)
  ) {
    const results = (parsed as { results: LocationSearchResult[] }).results
    const total =
      typeof (parsed as { total?: unknown }).total === 'number'
        ? ((parsed as { total?: unknown }).total as number)
        : results.length

    return {
      results,
      total,
      raw: parsed,
    }
  }

  return {
    results: [],
    total: 0,
    raw: parsed,
  }
}
