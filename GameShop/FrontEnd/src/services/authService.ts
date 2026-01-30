import { AuthTokenRequest, AuthResponse } from '../entities';
import { saveToken } from '../utils/tokenUtils';

export const authService = {
    login: async (credentials: AuthTokenRequest): Promise<string> => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await fetch('https://localhost:5000/api/Auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Auth error:', errorText);
            throw new Error('Authentication failed');
        }

        const data: AuthResponse = await response.json();
        console.log('Auth response full object:', data);
        console.log('Response keys:', Object.keys(data));

        // Try different possible property names
        const token = (data as any).accessToken || (data as any).token || (data as any).access_token;

        if (!token) {
            console.error('No token found. Full response:', JSON.stringify(data));
            throw new Error('No access token in response');
        }

        saveToken(token);
        return token;
    },
};
