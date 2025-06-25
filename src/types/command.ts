import { components } from './schema';

export type CommandDetail = components['schemas']['JobDetail'] | components['schemas']['JobAction'] | components['schemas']['Ping'] | components['schemas']['MasterProgramUpgrade'];
