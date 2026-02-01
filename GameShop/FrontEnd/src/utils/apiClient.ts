import { getToken } from './tokenUtils';

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

export const apiCall = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(typeof fetchOptions.headers === 'object' && fetchOptions.headers !== null
            ? (fetchOptions.headers as Record<string, string>)
            : {}),
    };

    if (!skipAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No token found for authenticated request to', endpoint);
        }
    }

    console.log('API Request:', endpoint, 'Headers:', headers, 'Options:', fetchOptions);

    const response = await fetch(`http://localhost:5001${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        // Try to extract a concise message from JSON or plain text bodies
        let raw = await response.text().catch(() => 'Unknown error');
        let concise = raw;
        try {
            const parsed = JSON.parse(raw);
            // If backend returned validation errors in the usual ASP.NET shape { errors: { field: [msgs] } }
            if (parsed && typeof parsed === 'object' && parsed.errors && typeof parsed.errors === 'object') {
                const details: string[] = [];
                for (const [field, messages] of Object.entries(parsed.errors)) {
                    if (Array.isArray(messages)) {
                        messages.forEach((m) => details.push(`${field}: ${m}`));
                    } else {
                        details.push(`${field}: ${String(messages)}`);
                    }
                }
                // Return only the field-specific messages (no generic title)
                concise = details.join('; ');
            } else {
                // Prefer common fields that contain human-readable messages
                concise = parsed.message || parsed.error || parsed.title || parsed.detail || JSON.stringify(parsed);
            }
        } catch {
            // not JSON, keep raw
            concise = raw;
        }

        // Trim and avoid returning large JSON blobs to the UI
        if (typeof concise === 'string') {
            concise = concise.trim();
            // If it's a JSON-looking string, try to simplify it
            if (concise.startsWith('{') && concise.endsWith('}')) {
                try {
                    const p = JSON.parse(concise);
                    concise = p.message || p.error || p.title || p.detail || JSON.stringify(p);
                } catch {
                    // leave as-is
                }
            }
        }

        console.error(`API Error: ${response.status}`, raw);
        // Throw only the concise message so UI shows a friendly short message
        throw new Error(concise || `API Error: ${response.status}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
};
