import Cookies from 'js-cookie';
import {
    ActivityItem,
    EvacuationResult,
    GraphData,
    ShelterSummary,
    SystemStatus,
} from './types';

const API_BASE_URL = 'http://localhost:8080/api';

type RawApiResponse<T = unknown> = {
    success?: boolean;
    data?: T;
    error?: string;
    message?: string;
    [key: string]: unknown;
};

function getStoredToken() {
    const raw = localStorage.getItem('reliefroute-storage');
    if (!raw) return null;
    try {
        return JSON.parse(raw)?.state?.token ?? null;
    } catch {
        return null;
    }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getStoredToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.set('_t', Date.now().toString());

    const response = await fetch(url.toString(), { ...options, headers });
    
    if (response.status === 401) {
        // Auth bypassed: Still logging just for visibility but not redirecting
        console.warn('Backend returned 401, but auth is bypassed');
    }

    const payload = await response.json();
    if (!response.ok) {
        const errorMessage = payload?.error || payload?.message || 'Request failed';
        throw new Error(errorMessage);
    }
    return payload;
}

function normalizeStatus(raw: RawApiResponse<SystemStatus>) {
    if (raw.success && raw.status) {
        return { success: true, data: raw.status as SystemStatus };
    }
    if (raw.success && raw.data) {
        return { success: true, data: raw.data as SystemStatus };
    }
    return { success: false, error: raw.error || raw.message || 'Failed to fetch status' };
}

function normalizeSummary(raw: RawApiResponse<ShelterSummary[]>) {
    const shelters = (raw.shelters as ShelterSummary[]) || raw.data;
    if (raw.success && Array.isArray(shelters)) {
        return { success: true, data: shelters };
    }
    return { success: false, error: raw.error || raw.message || 'Failed to fetch summary' };
}

function normalizeGraph(raw: RawApiResponse<GraphData> | GraphData) {
    const graph = (raw as RawApiResponse<GraphData>).data || raw;
    if (graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
        return { success: true, data: graph as GraphData };
    }
    return { success: false, error: 'Invalid graph response' };
}

function normalizeActivity(raw: RawApiResponse<ActivityItem[]>) {
    const activities = (raw.activities as ActivityItem[]) || raw.data;
    if (raw.success && Array.isArray(activities)) {
        return { success: true, data: activities };
    }
    return { success: false, error: raw.error || raw.message || 'Failed to fetch activity' };
}

export const api = {
    login: (credentials: any) => 
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(r => r.json()),

    getStatus: async () => normalizeStatus(await fetchWithAuth('/status')),
    getSummary: async () => normalizeSummary(await fetchWithAuth('/summary')),
    getGraph: async () => normalizeGraph(await fetchWithAuth('/graph')),
    updateAffected: (data: { zone: string; count: number }) => 
        fetchWithAuth('/affected', { method: 'POST', body: JSON.stringify(data) }),
    evacuate: (data?: { zone: string; count: number }) => 
        fetchWithAuth('/evacuate', { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
    getActivity: async () => normalizeActivity(await fetchWithAuth('/activity')),
    setup: (data: { adminData: string; graphData: string }) => 
        fetchWithAuth('/setup', { method: 'POST', body: JSON.stringify(data) }),
    getAdminConfig: () => 
        fetchWithAuth('/setup/admin'),
    getGraphConfig: () => 
        fetchWithAuth('/setup/graph'),
    reset: () => 
        fetchWithAuth('/reset', { method: 'POST' }),
};

