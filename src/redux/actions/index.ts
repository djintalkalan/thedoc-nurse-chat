export * from './authActions';
export * from './chatActions';
export * from './otherActions';
export * from './patientActions';
export * from './userActions';

export interface IPaginationState {
    currentPage: number
    totalPages: number
    perPage: number
}

