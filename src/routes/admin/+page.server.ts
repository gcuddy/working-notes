export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const upload = data.get('upload') as File;

		console.log({ upload });
	}
};
