export type EntityType = 'STATE' | 'DISTRICT' | 'CITY' | 'ZONE' | 'RELIEFCENTER';

export interface TreeNode {
    name: string;
    type: EntityType;
    affectedPeople: number;
    capacity: number;
    occupancy: number;
    children: TreeNode[];
}

export interface ShelterAssignment {
    shelterName: string;
    peopleAllocated: number;
    distance: number;
    route: string[];
}

export interface EvacuationResult {
    success: boolean;
    zoneName: string;
    totalPeople: number;
    errorMessage: string;
    assignments: ShelterAssignment[];
}

export interface ShelterSummary {
    name: string;
    occupancy: number;
    capacity: number;
    status: 'OK' | 'CRITICAL' | 'FULL';
}

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

export interface SystemState {
    tree: TreeNode | null;
    shelters: ShelterSummary[];
    isLoading: boolean;
    error: string | null;
}
