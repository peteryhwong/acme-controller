import { OpenAPIV3 } from 'openapi-types';

type OperationObjectV2 = OpenAPIV3.OperationObject<{
    'x-eov-operation-handler': string;
}>;

export interface PathsObjectV2 {
    [pattern: string]: OpenAPIV3.PathItemObject<OperationObjectV2>;
}
