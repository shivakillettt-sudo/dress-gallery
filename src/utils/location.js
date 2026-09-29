/**
 * Location utility: handles browser location permission, coordinates detection,
 * and reliable multi-provider reverse-geocoding for Indian & global delivery addresses.
 */

export async function reverseGeocode(lat, lon) {
  const mapUrl = `https://maps.google.com/?q=${lat},${lon}`;
  let addressText = '';
  let city = '';
  let pincode = '';
  let state = '';

  // 1. Primary: BigDataCloud free client-side reverse geocoding (fast, CORS-friendly)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = await res.json();
      city = data.locality || data.city || data.principalSubdivisionDistrict || '';
      state = data.principalSubdivision || '';
      pincode = data.postcode || '';

      const parts = [
        data.locality,
        data.city && data.city !== data.locality ? data.city : null,
        data.principalSubdivisionDistrict,
        data.principalSubdivision,
        data.postcode ? `PIN: ${data.postcode}` : null,
        data.countryName
      ].filter(Boolean);

      const uniqueParts = parts.filter((item, index) => parts.indexOf(item) === index);
      if (uniqueParts.length > 0) {
        addressText = uniqueParts.join(', ');
      }
    }
  } catch (err) {
    console.warn('BigDataCloud geocode attempt failed, trying fallback', err);
  }

  // 2. Secondary fallback: OpenStreetMap Nominatim jsonv2
  if (!addressText) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          addressText = data.display_name;
          if (data.address) {
            city = data.address.city || data.address.town || data.address.village || '';
            state = data.address.state || '';
            pincode = data.address.postcode || '';
          }
        }
      }
    } catch (err) {
      console.warn('Nominatim geocode attempt failed', err);
    }
  }

  // 3. Construct clean formatted address
  let formattedDeliveryAddress = '';
  if (addressText) {
    formattedDeliveryAddress = `${addressText}\n(📍 GPS: ${mapUrl})`;
  } else {
    formattedDeliveryAddress = `Location (${lat}, ${lon})\n(📍 GPS: ${mapUrl})\n[Please add your House/Street details above]`;
  }

  return {
    formattedDeliveryAddress,
    addressText,
    city,
    state,
    pincode,
    mapUrl,
    lat,
    lon
  };
}

/**
 * Requests browser geolocation permission and returns coordinates.
 */
export function requestCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const err = new Error('Geolocation is not supported by your browser');
      err.code = -1;
      return reject(err);
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 30000,
      ...options
    };

    navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
  });
}
