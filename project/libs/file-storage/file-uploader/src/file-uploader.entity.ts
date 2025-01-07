import { Entity, File, StorableEntity } from '@project/shared/core';

export class FileUploaderEntity extends Entity implements StorableEntity<File> {
  public originalName: string;
  public hashName: string;
  public subDirectory: string;
  public path: string;
  public mimetype: string;
  public size: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(file?: File) {
    super();
    this.populate(file);
  }

  public populate(file?: File): void {
    if (!file) {
      return;
    }

    this.id = file.id ?? '';
    this.originalName = file.originalName;
    this.hashName = file.hashName;
    this.subDirectory = file.subDirectory;
    this.path = file.path;
    this.mimetype = file.mimetype;
    this.size = file.size;
    this.createdAt = file.createdAt;
    this.updatedAt = file.updatedAt;
  }

  public toPOJO(): File {
    return {
      id: this.id,
      originalName: this.originalName,
      hashName: this.hashName,
      subDirectory: this.subDirectory,
      path: this.path,
      mimetype: this.mimetype,
      size: this.size,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
