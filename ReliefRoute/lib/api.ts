const API_BASE_URL = 'http://localhost:8080/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('reliefroute-storage') 
        ? JSON.parse(localStorage.getItem('reliefroute-storage')!).state.token 
        : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    
    if (response.status === 401) {
        // Handle unauthorized (optional: logout user)
        throw new Error('Unauthorized');
    }

    return response.json();
}

export const api = {
    login: (credentials: any) => 
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(r => r.json()),

    getStatus: () => fetchWithAuth('/status'),
    getSummary: () => fetchWithAuth('/summary'),
    getGraph: () => fetchWithAuth('/graph'),
    updateAffected: (data: { zone: string; count: number }) => 
        fetchWithAuth('/affected', { method: 'POST', body: JSON.stringify(data) }),
    evacuate: (data?: { zone: string; count: number }) => 
        fetchWithAuth('/evacuate', { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
    setup: (data: { adminData: string; graphData: string }) => 
        fetchWithAuth('/setup', { method: 'POST', body: JSON.stringify(data) }),
};

