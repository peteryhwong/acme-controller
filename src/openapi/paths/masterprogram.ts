import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/masterprogram': {
        get: {
            description: 'Get all master programs',
            operationId: 'getMasterPrograms',
            'x-eov-operation-handler': 'masterprogramcontroller',
            security: [
                {
                    BearerAuth: ['platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            responses: {
                '200': {
                    description: 'OK',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['masterprogram'],
                                properties: {
                                    masterprogram: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/BaseMasterProgramWithDetail',
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
            tags: ['MasterProgram'],
        },
    },
};
