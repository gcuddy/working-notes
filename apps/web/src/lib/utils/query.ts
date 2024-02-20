type QueryResult = {
	failureReason: null | unknown;
	isLoading: boolean;
	isFetching: boolean;
	isPending: boolean;
	data: null | unknown;
};

export function error<T extends QueryResult>(
	res: T
): res is T & { failureReason: NonNullable<T['failureReason']> } {
	return res.failureReason !== null;
}

// aliases
export const error0 = error;

export function loading({ isPending }: QueryResult) {
	return isPending;
}

export const loading1 = loading;

export function empty({ data }: { data: QueryResult['data'] }) {
	return data === null || data === undefined || (Array.isArray(data) && data.length === 0);
}

export const empty2 = empty;

export function success<T extends QueryResult>(
	res: T
): res is T & { data: NonNullable<T['data']> } {
	return res.isLoading === false && res.failureReason === null && !empty({ data: res.data });
}

export const success3 = success;
