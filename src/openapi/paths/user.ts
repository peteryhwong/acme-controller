import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/user': {
        get: {
            description: 'Get all user',
            operationId: 'getUsers',
            'x-eov-operation-handler': 'usercontroller',
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
                    description: 'Users found',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['user'],
                                properties: {
                                    user: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/User',
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
            tags: ['User'],
        },
        post: {
            description: 'Create an user',
            operationId: 'createUser',
            'x-eov-operation-handler': 'usercontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BaseUser',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'User created',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
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
            tags: ['User'],
        },
    },
    '/v1.0/user/{userId}/location': {
        put: {
            description: 'Update a user location',
            operationId: 'updateUserLocation',
            'x-eov-operation-handler': 'usercontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/userIdPath',
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
                    description: 'User location updated',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['userId'],
                                properties: {
                                    userId: {
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
            tags: ['User'],
        },
    },
    '/v1.0/user/{userId}': {
        delete: {
            description: 'Delete an user',
            operationId: 'deleteUser',
            'x-eov-operation-handler': 'usercontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/userIdPath',
                },
            ],
            responses: {
                '200': {
                    description: 'User deleted',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['userId'],
                                properties: {
                                    userId: {
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
            tags: ['User'],
        },
    },
};
