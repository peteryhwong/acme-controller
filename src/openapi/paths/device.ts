import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/device': {
        get: {
            summary: 'List Devices',
            operationId: 'listDevices',
            'x-eov-operation-handler': 'devicecontroller',
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
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['devices'],
                                properties: {
                                    devices: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Device',
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
            tags: ['Device'],
        },
        post: {
            summary: 'Create Device',
            operationId: 'createDevice',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/DeviceRequest',
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
                                    deviceId: {
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
            tags: ['Device'],
        },
    },
    '/v1.0/device/{deviceId}': {
        get: {
            summary: 'Get Device',
            operationId: 'getDeviceById',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
                },
            ],
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Device',
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
            tags: ['Device'],
        },
        delete: {
            summary: 'Delete Device',
            operationId: 'deleteDevice',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
                },
            ],
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['deviceId'],
                                properties: {
                                    deviceId: {
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
            tags: ['Device'],
        },
    },
    '/v1.0/device/{deviceId}/password': {
        put: {
            summary: 'Update Device Password',
            operationId: 'updateDevicePassword',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
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
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['deviceId'],
                                properties: {
                                    deviceId: {
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
            tags: ['Device'],
        },
    },
    '/v1.0/device/{deviceId}/location': {
        put: {
            summary: 'Update Device Location',
            operationId: 'updateDeviceLocation',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
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
                                },
                            },
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
                                required: ['deviceId'],
                                properties: {
                                    deviceId: {
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
            tags: ['Device'],
        },
    },
    '/v1.0/device/{deviceId}/event': {
        get: {
            summary: 'List Device Events',
            operationId: 'listDeviceEvents',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
                },
            ],
            responses: {
                '200': {
                    description: '',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['event'],
                                properties: {
                                    event: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Event',
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
            tags: ['Device'],
        },
    },
    '/v1.0/device/{deviceId}/masterprogram': {
        put: {
            summary: 'Update Device Master Program',
            operationId: 'updateDeviceMasterProgram',
            'x-eov-operation-handler': 'devicecontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceIdPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BaseMasterProgram',
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
                                $ref: '#/components/schemas/BaseMasterProgram',
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
            tags: ['Device'],
        },
    },
};
