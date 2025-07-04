// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-axios';
import type { GetCommandsWithKeyData, GetCommandsWithKeyResponse, GetCommandsWithKeyError, AcknowledgeCommandWithKeyData, AcknowledgeCommandWithKeyResponse, AcknowledgeCommandWithKeyError, CreateDeviceReportWithKeyData, CreateDeviceReportWithKeyResponse, CreateDeviceReportWithKeyError, AuthenticationData, AuthenticationResponse, AuthenticationError, GetAssigneesData, GetAssigneesResponse, GetAssigneesError, CreateAssigneeData, CreateAssigneeResponse, CreateAssigneeError, DeleteAssigneeData, DeleteAssigneeResponse, DeleteAssigneeError, UpdateAssigneeLocationData, UpdateAssigneeLocationResponse, UpdateAssigneeLocationError, UpdateAssigneePasswordData, UpdateAssigneePasswordResponse, UpdateAssigneePasswordError, GetCommandsData, GetCommandsResponse, GetCommandsError, SendCommandData, SendCommandResponse, SendCommandError, ListDevicesData, ListDevicesResponse, ListDevicesError, CreateDeviceData, CreateDeviceResponse, CreateDeviceError, DeleteDeviceData, DeleteDeviceResponse, DeleteDeviceError, GetDeviceByIdData, GetDeviceByIdResponse, GetDeviceByIdError, UpdateDevicePasswordData, UpdateDevicePasswordResponse, UpdateDevicePasswordError, UpdateDeviceLocationData, UpdateDeviceLocationResponse, UpdateDeviceLocationError, ListDeviceEventsData, ListDeviceEventsResponse, ListDeviceEventsError, UpdateDeviceMasterProgramData, UpdateDeviceMasterProgramResponse, UpdateDeviceMasterProgramError, GetPendingApprovalJobsData, GetPendingApprovalJobsResponse, GetPendingApprovalJobsError, GetJobsData, GetJobsResponse, GetJobsError, GetJobByIdData, GetJobByIdResponse, GetJobByIdError, UpdateJobData, UpdateJobResponse, UpdateJobError, UpdateJobStatusData, UpdateJobStatusResponse, UpdateJobStatusError, ApproveJobData, ApproveJobResponse, ApproveJobError, GetDeviceJobsData, GetDeviceJobsResponse, GetDeviceJobsError, CreateJobData, CreateJobResponse, CreateJobError, GetLocationsData, GetLocationsResponse, GetLocationsError, CreateLocationData, CreateLocationResponse, CreateLocationError, DeleteLocationData, DeleteLocationResponse, DeleteLocationError, GetMasterProgramsData, GetMasterProgramsResponse, GetMasterProgramsError, CreateTreatmentPlanData, CreateTreatmentPlanResponse, CreateTreatmentPlanError, GetTreatmentPlanData, GetTreatmentPlanResponse, GetTreatmentPlanError, GetTreatmentPlanByIdData, GetTreatmentPlanByIdResponse, GetTreatmentPlanByIdError, UpdateTreatmentPlanData, UpdateTreatmentPlanResponse, UpdateTreatmentPlanError, GetUsersData, GetUsersResponse, GetUsersError, CreateUserData, CreateUserResponse, CreateUserError, UpdateUserLocationData, UpdateUserLocationResponse, UpdateUserLocationError, DeleteUserData, DeleteUserResponse, DeleteUserError } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Get device commands by API key
 */
export const getCommandsWithKey = <ThrowOnError extends boolean = false>(options?: Options<GetCommandsWithKeyData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetCommandsWithKeyResponse, GetCommandsWithKeyError, ThrowOnError>({
        security: [
            {
                scheme: 'basic',
                type: 'http'
            }
        ],
        url: '/v1.0/command',
        ...options
    });
};

/**
 * Acknowledge a command by API key
 */
export const acknowledgeCommandWithKey = <ThrowOnError extends boolean = false>(options?: Options<AcknowledgeCommandWithKeyData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<AcknowledgeCommandWithKeyResponse, AcknowledgeCommandWithKeyError, ThrowOnError>({
        security: [
            {
                scheme: 'basic',
                type: 'http'
            }
        ],
        url: '/v1.0/acknowledgement',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Create a device report by API key
 */
export const createDeviceReportWithKey = <ThrowOnError extends boolean = false>(options?: Options<CreateDeviceReportWithKeyData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<CreateDeviceReportWithKeyResponse, CreateDeviceReportWithKeyError, ThrowOnError>({
        security: [
            {
                scheme: 'basic',
                type: 'http'
            }
        ],
        url: '/v1.0/report',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Authenticate for a device
 */
export const authentication = <ThrowOnError extends boolean = false>(options?: Options<AuthenticationData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<AuthenticationResponse, AuthenticationError, ThrowOnError>({
        security: [
            {
                scheme: 'basic',
                type: 'http'
            }
        ],
        url: '/v1.0/authentication',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all assignees
 */
export const getAssignees = <ThrowOnError extends boolean = false>(options?: Options<GetAssigneesData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetAssigneesResponse, GetAssigneesError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/assignee',
        ...options
    });
};

/**
 * Create an assignee
 */
export const createAssignee = <ThrowOnError extends boolean = false>(options?: Options<CreateAssigneeData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<CreateAssigneeResponse, CreateAssigneeError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/assignee',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete an assignee
 */
export const deleteAssignee = <ThrowOnError extends boolean = false>(options: Options<DeleteAssigneeData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteAssigneeResponse, DeleteAssigneeError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/assignee/{assigneeId}',
        ...options
    });
};

/**
 * Update an assignee location
 */
export const updateAssigneeLocation = <ThrowOnError extends boolean = false>(options: Options<UpdateAssigneeLocationData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateAssigneeLocationResponse, UpdateAssigneeLocationError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/assignee/{assigneeId}/location',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Update an assignee password
 */
export const updateAssigneePassword = <ThrowOnError extends boolean = false>(options: Options<UpdateAssigneePasswordData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateAssigneePasswordResponse, UpdateAssigneePasswordError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/assignee/{assigneeId}/password',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get device commands
 */
export const getCommands = <ThrowOnError extends boolean = false>(options: Options<GetCommandsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetCommandsResponse, GetCommandsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        querySerializer: {
            array: {
                explode: false,
                style: 'form'
            }
        },
        url: '/v1.0/device/{deviceId}/command',
        ...options
    });
};

/**
 * Send command to device
 */
export const sendCommand = <ThrowOnError extends boolean = false>(options: Options<SendCommandData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<SendCommandResponse, SendCommandError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/command',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * List Devices
 */
export const listDevices = <ThrowOnError extends boolean = false>(options?: Options<ListDevicesData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<ListDevicesResponse, ListDevicesError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device',
        ...options
    });
};

/**
 * Create Device
 */
export const createDevice = <ThrowOnError extends boolean = false>(options?: Options<CreateDeviceData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<CreateDeviceResponse, CreateDeviceError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete Device
 */
export const deleteDevice = <ThrowOnError extends boolean = false>(options: Options<DeleteDeviceData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteDeviceResponse, DeleteDeviceError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}',
        ...options
    });
};

/**
 * Get Device
 */
export const getDeviceById = <ThrowOnError extends boolean = false>(options: Options<GetDeviceByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetDeviceByIdResponse, GetDeviceByIdError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}',
        ...options
    });
};

/**
 * Update Device Password
 */
export const updateDevicePassword = <ThrowOnError extends boolean = false>(options: Options<UpdateDevicePasswordData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateDevicePasswordResponse, UpdateDevicePasswordError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/password',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Update Device Location
 */
export const updateDeviceLocation = <ThrowOnError extends boolean = false>(options: Options<UpdateDeviceLocationData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateDeviceLocationResponse, UpdateDeviceLocationError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/location',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * List Device Events
 */
export const listDeviceEvents = <ThrowOnError extends boolean = false>(options: Options<ListDeviceEventsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<ListDeviceEventsResponse, ListDeviceEventsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/event',
        ...options
    });
};

/**
 * Update Device Master Program
 */
export const updateDeviceMasterProgram = <ThrowOnError extends boolean = false>(options: Options<UpdateDeviceMasterProgramData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateDeviceMasterProgramResponse, UpdateDeviceMasterProgramError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/masterprogram',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all pending approval jobs
 */
export const getPendingApprovalJobs = <ThrowOnError extends boolean = false>(options?: Options<GetPendingApprovalJobsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetPendingApprovalJobsResponse, GetPendingApprovalJobsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/approval/job',
        ...options
    });
};

/**
 * Get all jobs
 */
export const getJobs = <ThrowOnError extends boolean = false>(options?: Options<GetJobsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetJobsResponse, GetJobsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/job',
        ...options
    });
};

/**
 * Get a job
 */
export const getJobById = <ThrowOnError extends boolean = false>(options: Options<GetJobByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetJobByIdResponse, GetJobByIdError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/job/{jobId}',
        ...options
    });
};

/**
 * Update a job
 */
export const updateJob = <ThrowOnError extends boolean = false>(options: Options<UpdateJobData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateJobResponse, UpdateJobError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/job/{jobId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Update a job status
 */
export const updateJobStatus = <ThrowOnError extends boolean = false>(options: Options<UpdateJobStatusData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateJobStatusResponse, UpdateJobStatusError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/job/{jobId}/status',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Approve a job
 */
export const approveJob = <ThrowOnError extends boolean = false>(options: Options<ApproveJobData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<ApproveJobResponse, ApproveJobError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/job/{jobId}/approval',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all jobs
 */
export const getDeviceJobs = <ThrowOnError extends boolean = false>(options: Options<GetDeviceJobsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetDeviceJobsResponse, GetDeviceJobsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/job',
        ...options
    });
};

/**
 * Create a job
 */
export const createJob = <ThrowOnError extends boolean = false>(options: Options<CreateJobData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<CreateJobResponse, CreateJobError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/device/{deviceId}/job',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all locations
 */
export const getLocations = <ThrowOnError extends boolean = false>(options?: Options<GetLocationsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetLocationsResponse, GetLocationsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/location',
        ...options
    });
};

/**
 * Create a location
 */
export const createLocation = <ThrowOnError extends boolean = false>(options?: Options<CreateLocationData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<CreateLocationResponse, CreateLocationError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/location',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete a location
 */
export const deleteLocation = <ThrowOnError extends boolean = false>(options: Options<DeleteLocationData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteLocationResponse, DeleteLocationError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/location/{locationId}',
        ...options
    });
};

/**
 * Get all master programs
 */
export const getMasterPrograms = <ThrowOnError extends boolean = false>(options?: Options<GetMasterProgramsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetMasterProgramsResponse, GetMasterProgramsError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/masterprogram',
        ...options
    });
};

/**
 * Create treatment plans for a group
 */
export const createTreatmentPlan = <ThrowOnError extends boolean = false>(options: Options<CreateTreatmentPlanData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<CreateTreatmentPlanResponse, CreateTreatmentPlanError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/group/{group}/treatmentplan',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get treatment plan
 */
export const getTreatmentPlan = <ThrowOnError extends boolean = false>(options?: Options<GetTreatmentPlanData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetTreatmentPlanResponse, GetTreatmentPlanError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/treatmentplan',
        ...options
    });
};

/**
 * Get treatment plan
 */
export const getTreatmentPlanById = <ThrowOnError extends boolean = false>(options: Options<GetTreatmentPlanByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetTreatmentPlanByIdResponse, GetTreatmentPlanByIdError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/treatmentplan/{treatmentPlanId}',
        ...options
    });
};

/**
 * Update treatment plan
 */
export const updateTreatmentPlan = <ThrowOnError extends boolean = false>(options: Options<UpdateTreatmentPlanData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateTreatmentPlanResponse, UpdateTreatmentPlanError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/treatmentplan/{treatmentPlanId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get all user
 */
export const getUsers = <ThrowOnError extends boolean = false>(options?: Options<GetUsersData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetUsersResponse, GetUsersError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/user',
        ...options
    });
};

/**
 * Create an user
 */
export const createUser = <ThrowOnError extends boolean = false>(options?: Options<CreateUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<CreateUserResponse, CreateUserError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Update a user location
 */
export const updateUserLocation = <ThrowOnError extends boolean = false>(options: Options<UpdateUserLocationData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateUserLocationResponse, UpdateUserLocationError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/user/{userId}/location',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete an user
 */
export const deleteUser = <ThrowOnError extends boolean = false>(options: Options<DeleteUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteUserResponse, DeleteUserError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/v1.0/user/{userId}',
        ...options
    });
};