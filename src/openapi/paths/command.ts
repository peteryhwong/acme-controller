import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/device/{deviceId}/command': {
        post: {
            summary: 'Send command to device',
            operationId: 'sendCommand',
            'x-eov-operation-handler': 'commandcontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceId',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BaseCommand',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    commandId: {
                                        type: 'string',
                                        format: 'uuid',
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
            tags: ['Command'],
        },
        get: {
            summary: 'Get device commands',
            operationId: 'getCommands',
            'x-eov-operation-handler': 'commandcontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceId',
                },
                {
                    $ref: '#/components/parameters/commandStatus',
                },
            ],
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['command'],
                                properties: {
                                    command: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/CommandWithStatus',
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
            tags: ['Command'],
        },
    },
};
