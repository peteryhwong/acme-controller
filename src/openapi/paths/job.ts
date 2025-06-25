import { PathsObjectV2 } from '../../types/openapi';

export const path: PathsObjectV2 = {
    '/v1.0/approval/job': {
        get: {
            description: 'Get all pending approval jobs',
            operationId: 'getPendingApprovalJobs',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            responses: {
                '200': {
                    description: 'Jobs retrieved',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    job: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
    },
    '/v1.0/job': {
        get: {
            description: 'Get all jobs',
            operationId: 'getJobs',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'],
                },
            ],
            responses: {
                '200': {
                    description: 'Jobs retrieved',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    job: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
    },
    '/v1.0/job/{jobId}': {
        put: {
            description: 'Update a job',
            operationId: 'updateJob',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/jobIdPath',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BaseJobWithAssigneeWithDeviceId',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Job updated',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
        get: {
            description: 'Get a job',
            operationId: 'getJobById',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/jobIdPath',
                },
            ],
            responses: {
                '200': {
                    description: 'Job retrieved',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceIdAndHistory',
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
            tags: ['Job'],
        },
    },
    '/v1.0/job/{jobId}/status': {
        put: {
            description: 'Update a job status',
            operationId: 'updateJobStatus',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/jobIdPath',
                },
                {
                    $ref: '#/components/parameters/forceCommand',
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/JobUpdateStatus',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Job updated',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/JobUpdateStatus',
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
            tags: ['Job'],
        },
    },
    '/v1.0/job/{jobId}/approval': {
        post: {
            description: 'Approve a job',
            operationId: 'approveJob',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/jobIdPath',
                },
            ],
            requestBody: {
                description: '',
                content: {
                    'application/json': {
                        schema: {
                            required: ['approval'],
                            properties: {
                                approval: {
                                    type: 'boolean',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Job approved',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
    },
    '/v1.0/device/{deviceId}/job': {
        post: {
            description: 'Create a job',
            operationId: 'createJob',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
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
                            $ref: '#/components/schemas/BaseJobWithAssignee',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Job created',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
        get: {
            description: 'Get all jobs',
            operationId: 'getDeviceJobs',
            'x-eov-operation-handler': 'jobcontroller',
            security: [
                {
                    BearerAuth: ['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin', 'device_tester'],
                },
            ],
            parameters: [
                {
                    $ref: '#/components/parameters/deviceId',
                },
            ],
            responses: {
                '200': {
                    description: 'Jobs retrieved',
                    headers: {},
                    content: {
                        'application/json': {
                            schema: {
                                required: ['job'],
                                properties: {
                                    job: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
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
            tags: ['Job'],
        },
    },
};
