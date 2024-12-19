import { StorableEntity } from '../interfaces/storable-entity.interface';

export type ReturnTypeToPOJOFunction<T extends StorableEntity<T>> = ReturnType<T['toPOJO']>;
