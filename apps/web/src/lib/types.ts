export type TreeNode<T> = {
	value: T;
	children: TreeNode<T>[];
};

export type Note = { title: string; id: string; html: string };
