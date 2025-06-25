import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/group/{group}/treatmentplan': {
        post: {
            summary: 'Create treatment plans for a group',
            operationId: 'createTreatmentPlan',
            'x-eov-operation-handler': 'treatmentplancontroller',
            security: [
                {
                    BearerAuth: ['hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/groupPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TreatmentPlanCreateRequest',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    treatmentplan: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/TreatmentPlanWithVersionAndName',
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
            tags: ['TreatmentPlan'],
        },
    },
    '/v1.0/treatmentplan': {
        get: {
            summary: 'Get treatment plan',
            operationId: 'getTreatmentPlan',
            'x-eov-operation-handler': 'treatmentplancontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            responses: {
                '200': {
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    treatmentplan: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/TreatmentPlanWithVersionAndName',
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
            tags: ['TreatmentPlan'],
        },
    },
    '/v1.0/treatmentplan/{treatmentPlanId}': {
        get: {
            summary: 'Get treatment plan',
            operationId: 'getTreatmentPlanById',
            'x-eov-operation-handler': 'treatmentplancontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/treatmentPlanIdPath',
                },
            ],
            responses: {
                '200': {
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TreatmentPlanWithVersionAndNameAndHistory',
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
            tags: ['TreatmentPlan'],
        },
        put: {
            summary: 'Update treatment plan',
            operationId: 'updateTreatmentPlan',
            'x-eov-operation-handler': 'treatmentplancontroller',
            security: [
                {
                    BearerAuth: ['platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/treatmentPlanIdPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TreatmentPlanUpdate',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TreatmentPlanWithVersionAndName',
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
            tags: ['TreatmentPlan'],
        },
    },
};
