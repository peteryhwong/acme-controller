import { path as assigneePaths } from './assignee';
import { path as commandPaths } from './command';
import { path as connectivityPath } from './connectivity';
import { path as devicePaths } from './device';
import { path as jobPaths } from './job';
import { path as locationPaths } from './location';
import { path as masterProgramPaths } from './masterprogram';
import { path as treatmentplanPaths } from './treatmentplan';
import { path as userPaths } from './user';

export default {
    ...connectivityPath,
    ...assigneePaths,
    ...commandPaths,
    ...devicePaths,
    ...jobPaths,
    ...locationPaths,
    ...masterProgramPaths,
    ...treatmentplanPaths,
    ...userPaths,
};
