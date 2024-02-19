export function navigateStack(stack: string[], next: string) {
	// if next note id in stack, roll back stack to that point.
	// otherwise, push stack
	const index = stack.indexOf(next);

	if (index === -1) {
		return [...stack, next];
	}

	return stack.slice(0, index + 1);
}
