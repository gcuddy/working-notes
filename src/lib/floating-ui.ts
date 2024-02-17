import { offset, flip, shift } from 'svelte-floating-ui/dom';
import { createFloatingActions } from 'svelte-floating-ui';

export function useFloatingActions() {
	return createFloatingActions({
		strategy: 'absolute',
		placement: 'top',
		middleware: [offset(6), flip(), shift()]
	});
}
