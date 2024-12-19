import { ReturnTypeToPOJOFunction } from '../types/return-to-pojo.type';
import { StorableEntity } from './storable-entity.interface';

export interface EntityFactory<T extends StorableEntity<T>> {
  create(entityPlainData: ReturnTypeToPOJOFunction<T>): T;
}
