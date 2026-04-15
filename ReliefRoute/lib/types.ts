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
    id?: string;
    name: string;
    occupancy: number;
    capacity: number;
    status: 'OK' | 'CRITICAL' | 'FULL';
}

export interface SystemStatus {
    totalAffected: number;
    totalEvacuated: number;
    tree: TreeNode;
}

export interface SystemState {
    status: SystemStatus | null;
    shelters: ShelterSummary[];
    isLoading: boolean;
    error: string | null;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight: number;
}

export interface GraphData {
    nodes: string[];
    edges: GraphEdge[];
}

export interface ActivityItem {
    id: number;
    zone: string;
    task: string;
    time: string;
    status: string;
    color: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
