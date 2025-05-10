export const apiDocs = [
  {
    method: 'GET',
    endpoint: '/api/conversations',
    description: 'Get a list of all conversations',
    parameters: [],
    response: {
      status: 200,
      body: [{ id: 'string', name: 'string', permissions: ['string'] }],
    },
  },
  {
    method: 'POST',
    endpoint: '/api/conversations',
    description: 'Create a new conversation',
    parameters: [
      { name: 'name', type: 'string', required: true },
      { name: 'permissions', type: 'array', required: false },
    ],
    response: {
      status: 201,
      body: { message: 'Conversation created successfully', data: {} },
    },
  },
  // Add more endpoints as needed
];
