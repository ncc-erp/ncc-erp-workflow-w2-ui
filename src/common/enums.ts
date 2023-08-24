export enum LoginStatus {
	success = 1,
	failed = 2,
}

export enum RequestStatus {
	Approved = 'Approved',
	Rejected = 'Rejected',
	Idle = 'Idle',
	Running = 'Running',
	Pending = 'Pending',
	Finished = 'Finished',
	Faulted = 'Faulted',
	Canceled = 'Canceled',
}

export enum RequestSortField {
	createdAt = 'createdAt',
	lastExecutedAt = 'lastExecutedAt',
}

export enum SortDirection {
	asc = 'asc',
	desc = 'desc',
}

export enum LocalStorageKeys {
	accessToken = 'accessToken',
	expireInSeconds = 'expireInSeconds',
	currentUser = 'currentUser',
}
