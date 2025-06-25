import { OpenAPIV3 } from 'openapi-types';
import { eventTypes } from '../../types/event';

export const components: OpenAPIV3.ComponentsObject = {
    securitySchemes: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        DeviceBasicAuth: {
            type: 'http',
            scheme: 'basic',
        },
    },
    schemas: {
        JobStatus: {
            type: 'string',
            enum: ['pendingapproval', 'pending', 'standby', 'play', 'frozen', 'complete', 'cancelled', 'abnormal'],
        },
        BaseUser: {
            type: 'object',
            required: ['userNumber', 'name', 'locationId'],
            properties: {
                userNumber: {
                    type: 'string',
                    minLength: 1,
                },
                name: {
                    type: 'string',
                    minLength: 1,
                },
                locationId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        User: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseUser',
                },
            ],
            required: ['userId', 'createdAt', 'job'],
            properties: {
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                },
                job: {
                    type: 'array',
                    items: {
                        required: ['jobId'],
                        properties: {
                            jobId: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
            },
        },
        BaseAssignee: {
            type: 'object',
            required: ['username', 'locationId', 'role'],
            properties: {
                username: {
                    type: 'string',
                    minLength: 1,
                    pattern: '^[a-zA-Z0-9]+$',
                },
                locationId: {
                    type: 'string',
                    format: 'uuid',
                },
                role: {
                    type: 'string',
                    enum: ['device_admin', 'device_user', 'device_maintenance'],
                },
            },
        },
        AssigneeRequest: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseAssignee',
                },
            ],
            type: 'object',
            required: ['password'],
            properties: {
                password: {
                    type: 'string',
                    minLength: 1,
                },
            },
        },
        Assignee: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseAssignee',
                },
            ],
            required: ['assigneeId'],
            properties: {
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        BaseLocation: {
            type: 'object',
            required: ['name', 'group'],
            properties: {
                name: {
                    type: 'string',
                },
                group: {
                    type: 'string',
                },
            },
        },
        Location: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseLocation',
                },
            ],
            type: 'object',
            required: ['locationId', 'device'],
            properties: {
                locationId: {
                    type: 'string',
                    format: 'uuid',
                },
                device: {
                    type: 'array',
                    items: {
                        properties: {
                            deviceId: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
            },
        },
        ChannelLimit: {
            type: 'object',
            required: ['ch1', 'ch2', 'ch3', 'ch4'],
            properties: {
                ch1: {
                    description: 'TENS_CH1_Intensity_Limit',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch2: {
                    description: 'TENS_CH2_Intensity_Limit',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch3: {
                    description: 'TENS_CH3_Intensity_Limit',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch4: {
                    description: 'TENS_CH4_Intensity_Limit',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
            },
        },
        Channel: {
            type: 'object',
            required: ['ch1', 'ch2', 'ch3', 'ch4'],
            properties: {
                ch1: {
                    description: 'Actual_TENS_CH1_Intensity',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch2: {
                    description: 'Actual_TENS_CH2_Intensity',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch3: {
                    description: 'Actual_TENS_CH3_Intensity',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
                ch4: {
                    description: 'Actual_TENS_CH4_Intensity',
                    type: 'integer',
                    minimum: 0,
                    maximum: 50,
                },
            },
        },
        BiChannelLimit: {
            type: 'object',
            required: ['ch1', 'ch2'],
            properties: {
                ch1: {
                    description: 'TENS_CH1_Heat_Limit: 0:L/1:M/2:H',
                    type: 'integer',
                    enum: [0, 1, 2],
                },
                ch2: {
                    description: 'TENS_CH2_Heat_Limit: 0:L/1:M/2:H',
                    type: 'integer',
                    enum: [0, 1, 2],
                },
            },
        },
        BiChannel: {
            type: 'object',
            required: ['ch1', 'ch2'],
            properties: {
                ch1: {
                    description: 'Actual_TENS_CH1_Temperature: 0=1/1=M/2=H',
                    type: 'integer',
                    enum: [0, 1, 2],
                },
                ch2: {
                    description: 'Actual_TENS_CH2_Temperature: 0=1/1=M/2=H',
                    type: 'integer',
                    enum: [0, 1, 2],
                },
            },
        },
        SnapshotTime: {
            type: 'object',
            required: ['startedAt', 'timeRemain'],
            properties: {
                startedAt: {
                    type: 'string',
                    format: 'date-time',
                },
                timeRemain: {
                    type: 'object',
                    required: ['value', 'unit'],
                    properties: {
                        value: {
                            type: 'number',
                            minimum: 0,
                        },
                        unit: {
                            type: 'string',
                            enum: ['minute', 'second'],
                        },
                    },
                },
            },
        },
        Acknowledgement: {
            type: 'object',
            required: ['type', 'detail'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['acknowledgement'],
                },
                detail: {
                    type: 'object',
                    required: ['commandId'],
                    properties: {
                        commandId: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                        version: {
                            type: 'string',
                        },
                    },
                },
            },
        },
        UltrasoundSetting: {
            type: 'object',
            required: ['scheme', 'intensityLimit', 'pulseFrequencyInHz', 'pulseDutyRatio', 'temperatureThreshold'],
            properties: {
                scheme: {
                    description: 'Ultrasound_Scheme_Enable',
                    type: 'object',
                    required: ['oneMContinuous', 'threeMContinuous', 'oneMPulse', 'threeMPulse'],
                    properties: {
                        oneMContinuous: {
                            type: 'boolean',
                        },
                        threeMContinuous: {
                            type: 'boolean',
                        },
                        oneMPulse: {
                            type: 'boolean',
                        },
                        threeMPulse: {
                            type: 'boolean',
                        },
                    },
                },
                intensityLimit: {
                    type: 'object',
                    required: ['oneMC', 'threeMC', 'oneMP', 'threeMP'],
                    properties: {
                        oneMC: {
                            description: 'Ultrasound_Intensity_Limit_1M_C',
                            type: 'integer',
                            minimum: 0,
                            maximum: 20,
                        },
                        threeMC: {
                            description: 'Ultrasound_Intensity_Limit_3M_C',
                            type: 'integer',
                            minimum: 0,
                            maximum: 15,
                        },
                        oneMP: {
                            description: 'Ultrasound_Intensity_Limit_1M_P',
                            type: 'integer',
                            minimum: 0,
                            maximum: 20,
                        },
                        threeMP: {
                            description: 'Ultrasound_Intensity_Limit_3M_P',
                            type: 'integer',
                            minimum: 0,
                            maximum: 15,
                        },
                    },
                },
                pulseFrequencyInHz: {
                    description: 'Ultrasound_Pulse_Frequency: 0=10Hz/1=20Hz/2=50Hz/3=100Hz',
                    type: 'object',
                    required: ['oneM', 'threeM'],
                    properties: {
                        oneM: {
                            type: 'integer',
                            enum: [0, 1, 2, 3],
                        },
                        threeM: {
                            type: 'integer',
                            enum: [0, 1, 2, 3],
                        },
                    },
                },
                pulseDutyRatio: {
                    description: 'Ultrasound_Pulse_Duty_Ratio: 0=1:1/1=1:2/2=1:5/3=1:10',
                    type: 'object',
                    required: ['oneM', 'threeM'],
                    properties: {
                        oneM: {
                            type: 'integer',
                            enum: [0, 1, 2, 3],
                        },
                        threeM: {
                            type: 'integer',
                            enum: [0, 1, 2, 3],
                        },
                    },
                },
                temperatureThreshold: {
                    description: 'Ultrasound_Temperature_Threshold',
                    type: 'integer',
                    enum: [0, 1, 2],
                },
            },
        },
        TensSetting: {
            type: 'object',
            required: ['waveform', 'channel', 'intensitylimit', 'heatLimit'],
            properties: {
                waveform: {
                    description: 'TENS_Waveform_Enable',
                    required: ['wf1', 'wf2', 'wf3', 'wf4', 'wf5', 'wf6'],
                    properties: {
                        wf1: {
                            type: 'boolean',
                        },
                        wf2: {
                            type: 'boolean',
                        },
                        wf3: {
                            type: 'boolean',
                        },
                        wf4: {
                            type: 'boolean',
                        },
                        wf5: {
                            type: 'boolean',
                        },
                        wf6: {
                            type: 'boolean',
                        },
                    },
                },
                channel: {
                    description: 'TENS_Channel_Enable',
                    type: 'object',
                    required: ['ch1', 'ch2', 'ch3', 'ch4'],
                    properties: {
                        ch1: {
                            type: 'boolean',
                        },
                        ch2: {
                            type: 'boolean',
                        },
                        ch3: {
                            type: 'boolean',
                        },
                        ch4: {
                            type: 'boolean',
                        },
                    },
                },
                intensitylimit: {
                    $ref: '#/components/schemas/ChannelLimit',
                },
                heatLimit: {
                    $ref: '#/components/schemas/BiChannelLimit',
                },
            },
        },
        ProNewTreatmentPlan: {
            required: ['type', 'plan'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['pronew'],
                },
                plan: {
                    type: 'object',
                    required: ['ultrasound', 'tens'],
                    properties: {
                        ultrasound: {
                            type: 'integer',
                            minimum: 0,
                            maximum: 30,
                        },
                        tens: {
                            type: 'integer',
                            minimum: 0,
                            maximum: 30,
                        },
                    },
                },
            },
        },
        TreatmentPlanUpdate: {
            oneOf: [
                {
                    $ref: '#/components/schemas/ProNewTreatmentPlan',
                },
            ],
        },
        TreatmentPlanHistory: {
            allOf: [
                {
                    $ref: '#/components/schemas/TreatmentPlanUpdate',
                },
            ],
            required: ['author', 'updatedAt'],
            properties: {
                author: {
                    type: 'string',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
        ProNewTreatmentPlanWithVersion: {
            allOf: [
                {
                    $ref: '#/components/schemas/ProNewTreatmentPlan',
                },
            ],
            required: ['version'],
            properties: {
                version: {
                    type: 'string',
                },
            },
        },
        TreatmentPlanCreateRequest: {
            required: ['type'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['pronew'],
                },
            },
        },
        TreatmentPlanWithVersionAndName: {
            oneOf: [
                {
                    $ref: '#/components/schemas/ProNewTreatmentPlanWithVersion',
                },
            ],
            required: ['treatmentPlanId', 'name', 'group', 'updatedAt'],
            properties: {
                treatmentPlanId: {
                    type: 'string',
                    format: 'uuid',
                },
                name: {
                    type: 'string',
                },
                group: {
                    type: 'string',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
        TreatmentPlanWithVersionAndNameAndHistory: {
            allOf: [
                {
                    $ref: '#/components/schemas/TreatmentPlanWithVersionAndName',
                },
            ],
            required: ['history'],
            properties: {
                history: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/TreatmentPlanHistory',
                    },
                },
            },
        },
        CustomizableProNewTreatmentPlanWithVersion: {
            allOf: [
                {
                    $ref: '#/components/schemas/ProNewTreatmentPlanWithVersion',
                },
            ],
            required: ['customizable', 'enabled'],
            properties: {
                customizable: {
                    type: 'boolean',
                },
                enabled: {
                    type: 'boolean',
                },
            },
        },
        ProNewTreatmentPlanToggle: {
            type: 'object',
            required: ['customizable', 'enabled'],
            properties: {
                customizable: {
                    type: 'boolean',
                },
                enabled: {
                    type: 'boolean',
                },
            },
        },
        ProNewTreatmentPlanSetting: {
            description: 'Treatment_Plan_Enable',
            type: 'object',
            required: ['preset'],
            properties: {
                preset: {
                    required: ['pronew001', 'pronew002', 'pronew003', 'pronew004', 'pronew005', 'pronew006', 'pronew007', 'pronew008'],
                    properties: {
                        pronew001: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew002: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew003: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew004: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew005: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew006: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew007: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                        pronew008: {
                            $ref: '#/components/schemas/ProNewTreatmentPlanToggle',
                        },
                    },
                },
            },
        },
        ProNewPlanSetting: {
            description: 'Treatment_Plan_Enable',
            type: 'object',
            required: ['preset'],
            properties: {
                preset: {
                    required: ['pronew001', 'pronew002', 'pronew003', 'pronew004', 'pronew005', 'pronew006', 'pronew007', 'pronew008'],
                    properties: {
                        pronew001: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew002: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew003: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew004: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew005: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew006: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew007: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                        pronew008: {
                            $ref: '#/components/schemas/CustomizableProNewTreatmentPlanWithVersion',
                        },
                    },
                },
            },
        },
        ProPlanSetting: {
            description: 'Treatment_Plan_Enable',
            type: 'object',
            required: ['ultrasound30Tens0', 'ultrasound20Tens10', 'ultrasound10Tens20', 'ultrasound0Tens30'],
            properties: {
                ultrasound30Tens0: {
                    type: 'boolean',
                },
                ultrasound20Tens10: {
                    type: 'boolean',
                },
                ultrasound10Tens20: {
                    type: 'boolean',
                },
                ultrasound0Tens30: {
                    type: 'boolean',
                },
            },
        },
        ProSetting: {
            type: 'object',
            required: ['plan', 'ultrasoundSetting', 'tensSetting'],
            properties: {
                plan: {
                    anyOf: [
                        {
                            $ref: '#/components/schemas/ProNewTreatmentPlanSetting',
                        },
                        {
                            $ref: '#/components/schemas/ProNewPlanSetting',
                        },
                        {
                            $ref: '#/components/schemas/ProPlanSetting',
                        },
                    ],
                },
                ultrasoundSetting: {
                    $ref: '#/components/schemas/UltrasoundSetting',
                },
                tensSetting: {
                    $ref: '#/components/schemas/TensSetting',
                },
            },
        },
        BaseJob: {
            type: 'object',
            required: ['treatmentPlan'],
            properties: {
                treatmentPlan: {
                    type: 'object',
                    required: ['type', 'detail'],
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['pro', 'pronew'],
                        },
                        detail: {
                            oneOf: [
                                {
                                    $ref: '#/components/schemas/ProSetting',
                                },
                            ],
                        },
                    },
                },
            },
        },
        BaseJobWithAssignee: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJob',
                },
            ],
            type: 'object',
            required: ['assigneeId', 'userId'],
            properties: {
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        BaseJobWithAssigneeWithDeviceId: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJobWithAssignee',
                },
            ],
            type: 'object',
            required: ['deviceId'],
            properties: {
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        BaseJobWithJobId: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJob',
                },
            ],
            type: 'object',
            required: ['jobId'],
            properties: {
                jobId: {
                    type: 'string',
                },
            },
        },
        JobUpdateStatus: {
            type: 'object',
            required: ['status'],
            properties: {
                status: {
                    type: 'string',
                    enum: ['play', 'frozen', 'cancelled'],
                },
            },
        },
        BaseJobWithJobIdAndAssigneeAndStatus: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJobWithJobId',
                },
            ],
            type: 'object',
            required: ['userId', 'assigneeId', 'status'],
            properties: {
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
                status: {
                    $ref: '#/components/schemas/JobStatus',
                },
            },
        },
        BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJobWithJobIdAndAssigneeAndStatus',
                },
            ],
            type: 'object',
            required: ['deviceId'],
            properties: {
                datetime: {
                    type: 'string',
                    format: 'date-time',
                },
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
                offlineJobId: {
                    type: 'string',
                },
            },
        },
        TreatmentWithJobIdAndStatusAndAssigneeAndDeviceId: {
            type: 'object',
            required: ['detail', 'userId', 'deviceId', 'assigneeId', 'status', 'jobId'],
            properties: {
                detail: {
                    type: 'object',
                    required: ['treatment'],
                    properties: {
                        treatment: {
                            $ref: '#/components/schemas/TreatmentSnapshot',
                        },
                    },
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
                status: {
                    $ref: '#/components/schemas/JobStatus',
                },
                jobId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        TreatmentPlanWithJobIdAndStatusAndAssigneeAndDeviceId: {
            type: 'object',
            required: ['detail', 'userId', 'deviceId', 'assigneeId', 'status', 'jobId'],
            properties: {
                detail: {
                    $ref: '#/components/schemas/BaseJob',
                },
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
                status: {
                    $ref: '#/components/schemas/JobStatus',
                },
                jobId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        ErrorWithJobIdAndStatusAndAssigneeAndDeviceId: {
            type: 'object',
            required: ['detail', 'deviceId', 'userId', 'assigneeId', 'status', 'jobId'],
            properties: {
                detail: {
                    $ref: '#/components/schemas/DeviceError',
                },
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                },
                assigneeId: {
                    type: 'string',
                    format: 'uuid',
                },
                status: {
                    $ref: '#/components/schemas/JobStatus',
                },
                jobId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        BaseJobWithJobIdAndStatusAndAssigneeAndDeviceIdAndHistory: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId',
                },
            ],
            type: 'object',
            required: ['jobHistory'],
            properties: {
                jobHistory: {
                    type: 'array',
                    items: {
                        oneOf: [
                            {
                                $ref: '#/components/schemas/TreatmentPlanWithJobIdAndStatusAndAssigneeAndDeviceId',
                            },
                            {
                                $ref: '#/components/schemas/TreatmentWithJobIdAndStatusAndAssigneeAndDeviceId',
                            },
                            {
                                $ref: '#/components/schemas/ErrorWithJobIdAndStatusAndAssigneeAndDeviceId',
                            },
                        ],
                        required: ['jobHistoryId', 'author', 'type'],
                        properties: {
                            jobHistoryId: {
                                type: 'string',
                                format: 'uuid',
                            },
                            author: {
                                type: 'string',
                            },
                            type: {
                                type: 'string',
                            },
                            datetime: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                },
            },
        },
        AssigneeAtJob: {
            type: 'object',
            required: ['username', 'hash'],
            properties: {
                username: {
                    type: 'string',
                },
                hash: {
                    type: 'string',
                },
            },
        },
        JobDetail: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseJobWithJobId',
                },
            ],
            type: 'object',
            required: ['action', 'assignee'],
            properties: {
                action: {
                    type: 'string',
                    enum: ['create', 'update'],
                },
                assignee: {
                    $ref: '#/components/schemas/AssigneeAtJob',
                },
            },
        },
        JobAction: {
            type: 'object',
            required: ['action', 'jobId'],
            properties: {
                action: {
                    type: 'string',
                    enum: ['freeze', 'play', 'cancel'],
                },
                jobId: {
                    type: 'string',
                },
            },
        },
        Ping: {
            type: 'object',
            required: ['command'],
            properties: {
                command: {
                    type: 'string',
                    enum: ['ping'],
                },
            },
        },
        BaseMasterProgram: {
            type: 'object',
            required: ['version'],
            properties: {
                version: {
                    type: 'string',
                },
            },
        },
        BaseMasterProgramWithDetail: {
            type: 'object',
            required: ['version', 'datetime'],
            properties: {
                version: {
                    type: 'string',
                },
                datetime: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
        MasterProgramUpgradeDetail: {
            type: 'object',
            required: ['VersionCode', 'VersionName', 'ModifyContent', 'DownloadUrl', 'ApkSize', 'ApkMd5'],
            properties: {
                VersionCode: {
                    type: 'string',
                },
                VersionName: {
                    type: 'string',
                },
                ModifyContent: {
                    type: 'string',
                },
                DownloadUrl: {
                    type: 'string',
                },
                ApkSize: {
                    type: 'string',
                },
                ApkMd5: {
                    type: 'string',
                },
            },
        },
        MasterProgramUpgrade: {
            type: 'object',
            required: ['command', 'detail'],
            properties: {
                command: {
                    type: 'string',
                    enum: ['masterprogramupgrade'],
                },
                detail: {
                    $ref: '#/components/schemas/MasterProgramUpgradeDetail',
                },
            },
        },
        BaseCommand: {
            type: 'object',
            required: ['command'],
            properties: {
                command: {
                    type: 'object',
                    oneOf: [
                        {
                            $ref: '#/components/schemas/JobDetail',
                        },
                        {
                            $ref: '#/components/schemas/JobAction',
                        },
                        {
                            $ref: '#/components/schemas/Ping',
                        },
                        {
                            $ref: '#/components/schemas/MasterProgramUpgrade',
                        },
                    ],
                },
            },
        },
        Command: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseCommand',
                },
            ],
            type: 'object',
            required: ['id', 'type', 'createDate'],
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                },
                createDate: {
                    type: 'string',
                    format: 'date-time',
                },
                type: {
                    type: 'integer',
                    enum: [1, 2, 3, 4],
                },
            },
        },
        CommandWithStatus: {
            allOf: [
                {
                    $ref: '#/components/schemas/Command',
                },
            ],
            type: 'object',
            required: ['status'],
            properties: {
                status: {
                    type: 'string',
                    enum: ['pending', 'pending-processing', 'acknowledged'],
                },
            },
        },
        UltrasoundSnapshot: {
            type: 'object',
            required: ['scheme', 'intensity', 'pulseFrequencyInHz', 'pulseDutyRatio', 'temperature'],
            properties: {
                scheme: {
                    description: 'Ultrasound_Scheme_Selected',
                    type: 'string',
                    enum: ['oneMContinuous', 'threeMContinuous', 'oneMPulse', 'threeMPulse'],
                },
                intensity: {
                    description: 'Actual_Ultrasound_Intensity',
                    type: 'integer',
                    minimum: 0,
                    maximum: 20,
                },
                pulseFrequencyInHz: {
                    description: 'Actual_Ultrasound_Pulse_Frequency: 0=10Hz/1=20Hz/2=50Hz/3=100Hz',
                    type: 'integer',
                    enum: [0, 1, 2, 3],
                },
                pulseDutyRatio: {
                    description: 'Actual_Ultrasound_Pulse_Duty_Ratio: 0=1:1/1=1:2/2=1:5/3=1:10',
                    type: 'integer',
                    enum: [0, 1, 2, 3],
                },
                temperature: {
                    description: 'Actual_Ultrasound_Temperature: 数据范围 = 0-119; 0=-20°C; 119=99°C',
                    type: 'integer',
                    minimum: 0,
                    maximum: 119,
                },
                time: {
                    $ref: '#/components/schemas/SnapshotTime',
                },
            },
        },
        TensSnapshot: {
            type: 'object',
            required: ['waveform', 'intensity', 'temperature'],
            properties: {
                waveform: {
                    description: 'Actual_TENS_Waveform',
                    type: 'string',
                    enum: ['wf1', 'wf2', 'wf3', 'wf4', 'wf5', 'wf6'],
                },
                intensity: {
                    $ref: '#/components/schemas/Channel',
                },
                temperature: {
                    $ref: '#/components/schemas/BiChannel',
                },
                time: {
                    $ref: '#/components/schemas/SnapshotTime',
                },
            },
        },
        ProNewPlanSnapshot: {
            description: 'Treatment_Plan_Selected',
            required: ['plan', 'name'],
            properties: {
                plan: {
                    required: ['tens', 'ultrasound'],
                    properties: {
                        tens: {
                            type: 'integer',
                        },
                        ultrasound: {
                            type: 'integer',
                        },
                    },
                },
                name: {
                    type: 'string',
                    enum: ['pronew001', 'pronew002', 'pronew003', 'pronew004', 'pronew005', 'pronew006', 'pronew007', 'pronew008'],
                },
            },
        },
        ProPlanSnapshot: {
            description: 'Treatment_Plan_Selected',
            type: 'string',
            enum: ['ultrasound30Tens0', 'ultrasound20Tens10', 'ultrasound10Tens20', 'ultrasound0Tens30', 'ultrasoundXTensY'],
        },
        ProSnapshot: {
            type: 'object',
            required: ['plan', 'ultrasoundSnapshot', 'tensSnapshot'],
            properties: {
                plan: {
                    oneOf: [
                        {
                            $ref: '#/components/schemas/ProNewPlanSnapshot',
                        },
                        {
                            $ref: '#/components/schemas/ProPlanSnapshot',
                        },
                    ],
                },
                ultrasoundSnapshot: {
                    $ref: '#/components/schemas/UltrasoundSnapshot',
                },
                tensSnapshot: {
                    $ref: '#/components/schemas/TensSnapshot',
                },
            },
        },
        TreatmentSnapshot: {
            type: 'object',
            required: ['type', 'detail'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['pro', 'pronew'],
                },
                detail: {
                    oneOf: [
                        {
                            $ref: '#/components/schemas/ProSnapshot',
                        },
                    ],
                },
            },
        },
        JobHistory: {
            type: 'object',
            required: ['type', 'jobId', 'detail'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['interim', 'completion'],
                },
                jobId: {
                    type: 'string',
                },
                offlineJobId: {
                    type: 'string',
                },
                detail: {
                    required: ['assigneeUsername', 'status', 'treatment'],
                    properties: {
                        assigneeUsername: {
                            type: 'string',
                        },
                        status: {
                            type: 'string',
                            enum: [
                                'pendingapproval',
                                'standby',
                                'Standby',
                                'play',
                                'Play',
                                'pause',
                                'Pause',
                                'frozen',
                                'Frozen',
                                'complete',
                                'Complete',
                                'cancelled',
                                'Cancel',
                                'cancel',
                                'abnormal',
                                'Abnormal',
                            ],
                        },
                        treatment: {
                            $ref: '#/components/schemas/TreatmentSnapshot',
                        },
                    },
                },
            },
        },
        DeviceError: {
            type: 'object',
            required: ['error', 'startedAt'],
            properties: {
                error: {
                    type: 'string',
                    enum: ['ultrasoundOverheat', 'tensCh1Shorted', 'tensCh2Shorted', 'tensCh3Shorted', 'tensCh4Shorted'],
                },
                startedAt: {
                    type: 'string',
                    format: 'date-time',
                },
                endedAt: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
        ErrorHistory: {
            type: 'object',
            required: ['type', 'jobId', 'detail'],
            properties: {
                detail: {
                    $ref: '#/components/schemas/DeviceError',
                },
                type: {
                    type: 'string',
                    enum: ['error'],
                },
                jobId: {
                    type: 'string',
                },
                offlineJobId: {
                    type: 'string',
                },
            },
        },
        DeviceReport: {
            type: 'object',
            required: ['detail'],
            properties: {
                detail: {
                    type: 'array',
                    items: {
                        oneOf: [
                            {
                                $ref: '#/components/schemas/JobHistory',
                            },
                            {
                                $ref: '#/components/schemas/ErrorHistory',
                            },
                        ],
                    },
                },
            },
        },
        BaseDevice: {
            type: 'object',
            required: ['code', 'type', 'locationId'],
            properties: {
                code: {
                    type: 'string',
                    minLength: 1,
                },
                type: {
                    type: 'string',
                    minLength: 1,
                },
                locationId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        DeviceStatus: {
            type: 'object',
            required: ['status'],
            properties: {
                status: {
                    type: 'string',
                    enum: ['online', 'offline', 'unknown'],
                },
                passwordUpdated: {
                    type: 'boolean',
                },
                masterProgramVersion: {
                    type: 'string',
                    minLength: 1,
                },
            },
        },
        DeviceHistory: {
            type: 'object',
            required: ['datetime', 'detail'],
            properties: {
                datetime: {
                    type: 'string',
                    format: 'date-time',
                },
                detail: {
                    oneOf: [
                        {
                            $ref: '#/components/schemas/DeviceStatus',
                        },
                    ],
                },
            },
        },
        Device: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseDevice',
                },
            ],
            type: 'object',
            required: ['deviceId', 'status', 'deviceHistory'],
            properties: {
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
                passcode: {
                    type: 'string',
                    minLength: 1,
                },
                status: {
                    type: 'string',
                    minLength: 1,
                },
                masterProgramVersion: {
                    type: 'string',
                    minLength: 1,
                },
                deviceHistory: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/DeviceHistory',
                    },
                },
            },
        },
        DeviceRequest: {
            allOf: [
                {
                    $ref: '#/components/schemas/BaseDevice',
                },
            ],
            type: 'object',
            required: ['password'],
            properties: {
                password: {
                    type: 'string',
                    minLength: 1,
                },
            },
        },
        EventReport: {
            oneOf: [
                {
                    $ref: '#/components/schemas/JobHistory',
                },
                {
                    $ref: '#/components/schemas/ErrorHistory',
                },
                {
                    $ref: '#/components/schemas/Acknowledgement',
                },
            ],
        },
        Event: {
            type: 'object',
            required: ['eventId', 'type', 'datetime', 'detail', 'status'],
            properties: {
                eventId: {
                    type: 'string',
                    format: 'uuid',
                },
                datetime: {
                    type: 'string',
                    format: 'date-time',
                },
                type: {
                    type: 'string',
                    enum: Array.from(eventTypes),
                },
                detail: {
                    oneOf: [
                        {
                            required: ['deviceId', 'report'],
                            properties: {
                                deviceId: {
                                    type: 'string',
                                    format: 'uuid',
                                },
                                report: {
                                    $ref: '#/components/schemas/DeviceReport',
                                },
                            },
                        },
                        {
                            properties: {},
                        },
                    ],
                },
                status: {
                    type: 'string',
                },
                deviceId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
        AuthenticationRequest: {
            type: 'object',
            required: ['username', 'password', 'type'],
            properties: {
                username: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['device', 'user'],
                },
            },
        },
        Error: {
            type: 'object',
            required: ['error_code', 'error_message'],
            properties: {
                error_code: {
                    type: 'string',
                },
                error_message: {
                    type: 'string',
                },
            },
        },
        ConnectivityBase: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
                code: {
                    type: 'integer',
                },
                message: {
                    type: 'string',
                },
            },
        },
        ConnectivityError: {
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
                    nullable: true,
                },
            },
        },
    },
    parameters: {
        userIdPath: {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        locationIdPath: {
            name: 'locationId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        assigneeIdPath: {
            name: 'assigneeId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        deviceIdPath: {
            name: 'deviceId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        jobIdPath: {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        groupPath: {
            name: 'group',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
            },
        },
        treatmentPlanIdPath: {
            name: 'treatmentPlanId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        jobId: {
            name: 'jobId',
            in: 'query',
            style: 'form',
            schema: {
                type: 'string',
            },
        },
        deviceId: {
            name: 'deviceId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        commandId: {
            name: 'commandId',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
                format: 'uuid',
            },
        },
        commandStatus: {
            name: 'status',
            in: 'query',
            style: 'form',
            explode: false,
            description: 'Command status',
            required: false,
            schema: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['pending', 'pending-processing', 'acknowledged'],
                },
            },
        },
        includeDeleted: {
            name: 'includeDeleted',
            in: 'query',
            style: 'form',
            explode: false,
            description: 'Include deleted',
            required: false,
            schema: {
                type: 'boolean',
            },
        },
        forceCommand: {
            name: 'forceCommand',
            in: 'query',
            style: 'form',
            explode: false,
            description: 'Force command',
            required: false,
            schema: {
                type: 'boolean',
            },
        },
    },
};
