import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/command': {
        get: {
            summary: 'Get device commands by API key',
            operationId: 'getCommandsWithKey',
            'x-eov-operation-handler': 'connectivitycontroller',
            security: [
                {
                    DeviceBasicAuth: [],
                },
            ],
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    {
                                        $ref: '#/components/schemas/ConnectivityBase',
                                    },
                                ],
                                type: 'object',
                                required: ['object'],
                                properties: {
                                    object: {
                                        type: 'object',
                                        required: ['command'],
                                        properties: {
                                            command: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Command',
                                                },
                                            },
                                        },
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
                            },
                        },
                    },
                },
            },
            tags: ['Connectivity'],
        },
    },
    '/v1.0/acknowledgement': {
        post: {
            summary: 'Acknowledge a command by API key',
            operationId: 'acknowledgeCommandWithKey',
            'x-eov-operation-handler': 'connectivitycontroller',
            security: [
                {
                    DeviceBasicAuth: [],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Acknowledgement',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    {
                                        $ref: '#/components/schemas/ConnectivityBase',
                                    },
                                ],
                                type: 'object',
                                required: ['object'],
                                properties: {
                                    object: {
                                        $ref: '#/components/schemas/Acknowledgement',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
                            },
                        },
                    },
                },
            },
            tags: ['Connectivity'],
        },
    },
    '/v1.0/report': {
        post: {
            summary: 'Create a device report by API key',
            operationId: 'createDeviceReportWithKey',
            'x-eov-operation-handler': 'connectivitycontroller',
            security: [
                {
                    DeviceBasicAuth: [],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/DeviceReport',
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
                                allOf: [
                                    {
                                        $ref: '#/components/schemas/ConnectivityBase',
                                    },
                                ],
                                type: 'object',
                                required: ['object'],
                                properties: {
                                    object: {
                                        type: 'object',
                                        required: ['reportId'],
                                        properties: {
                                            reportId: {
                                                type: 'string',
                                                format: 'uuid',
                                            },
                                        },
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
                            },
                        },
                    },
                },
            },
            tags: ['Connectivity'],
        },
    },
    '/v1.0/authentication': {
        post: {
            summary: 'Authenticate for a device',
            operationId: 'authentication',
            'x-eov-operation-handler': 'connectivitycontroller',
            security: [
                {
                    DeviceBasicAuth: [],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AuthenticationRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    {
                                        $ref: '#/components/schemas/ConnectivityBase',
                                    },
                                ],
                                type: 'object',
                                required: ['object'],
                                properties: {
                                    object: {
                                        type: 'object',
                                        required: ['valid', 'type', 'role'],
                                        properties: {
                                            valid: {
                                                type: 'boolean',
                                            },
                                            type: {
                                                type: 'string',
                                            },
                                            role: {
                                                type: 'string',
                                            },
                                        },
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
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
                                $ref: '#/components/schemas/ConnectivityError',
                            },
                        },
                    },
                },
            },
            tags: ['Connectivity'],
        },
    },
};
