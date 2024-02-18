import { offset, flip, shift } from 'svelte-floating-ui/dom';
import { createFloatingActions, arrow } from 'svelte-floating-ui';
import { get, type Writable } from 'svelte/store';

export function useFloatingActions(opts?: { arrowEl?: Writable<HTMLElement | null> }) {
	return createFloatingActions({
		strategy: 'absolute',
		placement: 'right',
		middleware: [
			offset(6),
			flip(),
			shift(),
			...(opts?.arrowEl ? [arrow({ element: opts.arrowEl })] : [])
		],
		onComputed: ({ placement, middlewareData }) => {
			if (middlewareData.arrow && opts?.arrowEl) {
				const { x, y } = middlewareData.arrow;
				const staticSide = {
					top: 'bottom',
					bottom: 'top',
					left: 'right',
					right: 'left'
				}[placement.split('-')[0]];

				opts.arrowEl.update((el) => {
					if (el) {
						Object.assign(el.style, {
							left: x != null ? `${x}px` : '',
							top: y != null ? `${y}px` : '',
							[staticSide as string]: '-4px'
						});
					}
					return el;
				});
			}
		}
	});
}
