export * from './authActions';
export * from './chatActions';
export * from './homeActions';
export * from './otherActions';
export * from './userActions';

export interface IPaginationState {
    currentPage: number
    totalPages: number
    perPage: number
}

