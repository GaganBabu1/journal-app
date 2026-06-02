import api from './api';

function unwrapCollectionResponse(responseData) {
	return {
		items: responseData?.data ?? [],
		meta: responseData?.meta ?? null,
	};
}

function unwrapItemResponse(responseData) {
	return responseData?.data ?? null;
}

const journalService = {
	async getAll({ page = 0, size = 20, q } = {}) {
		const { data } = await api.get('/journals', {
			params: {
				page,
				size,
				...(q ? { q } : {}),
			},
		});
		return unwrapCollectionResponse(data);
	},

	async getById(id) {
		const { data } = await api.get(`/journals/${id}`);
		return unwrapItemResponse(data);
	},

	async create(payload) {
		const { data } = await api.post('/journals', payload);
		return unwrapItemResponse(data);
	},

	async update(id, payload) {
		const { data } = await api.put(`/journals/${id}`, payload);
		return unwrapItemResponse(data);
	},

	async remove(id) {
		const { data } = await api.delete(`/journals/${id}`);
		return data;
	},
};

export default journalService;
