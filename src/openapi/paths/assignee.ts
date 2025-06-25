import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/assignee': {
        get: {
            description: 'Get all assignees',
            operationId: 'getAssignees',
            'x-eov-operation-handler': 'assigneecontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/includeDeleted',
                },
            ],
            responses: {
                '200': {
                    description: 'Assignees found',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['assignee'],
                                properties: {
                                    assignee: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Assignee',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '403': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '404': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '500': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
            tags: ['Assignee'],
        },
        post: {
            description: 'Create an assignee',
            operationId: 'createAssignee',
            'x-eov-operation-handler': 'assigneecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AssigneeRequest',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Assignee created',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Assignee',
                            },
                        },
                    },
                },
                '400': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '401': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '403': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '404': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '500': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
            tags: ['Assignee'],
        },
    },
    '/v1.0/assignee/{assigneeId}': {
        delete: {
            description: 'Delete an assignee',
            operationId: 'deleteAssignee',
            'x-eov-operation-handler': 'assigneecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/assigneeIdPath',
                },
            ],
            responses: {
                '200': {
                    description: 'Assignee deleted',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['assigneeId'],
                                properties: {
                                    assigneeId: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '401': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '403': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '404': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '500': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
            tags: ['Assignee'],
        },
    },
    '/v1.0/assignee/{assigneeId}/location': {
        put: {
            description: 'Update an assignee location',
            operationId: 'updateAssigneeLocation',
            'x-eov-operation-handler': 'assigneecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/assigneeIdPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            required: ['locationId'],
                            properties: {
                                locationId: {
                                    type: 'string',
                                    format: 'uuid',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Assignee location updated',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['assigneeId'],
                                properties: {
                                    assigneeId: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '401': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '403': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '404': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '500': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
            tags: ['Assignee'],
        },
    },
    '/v1.0/assignee/{assigneeId}/password': {
        put: {
            description: 'Update an assignee password',
            operationId: 'updateAssigneePassword',
            'x-eov-operation-handler': 'assigneecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/assigneeIdPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            required: ['password'],
                            properties: {
                                password: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Assignee password updated',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['assigneeId'],
                                properties: {
                                    assigneeId: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '401': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '403': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '404': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                '500': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
            tags: ['Assignee'],
        },
    },
};
