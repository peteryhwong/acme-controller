import { initialiseDb } from '@ankh/ankh-db/lib/migration';
import { dbConfig } from './component/db';

initialiseDb(dbConfig);
