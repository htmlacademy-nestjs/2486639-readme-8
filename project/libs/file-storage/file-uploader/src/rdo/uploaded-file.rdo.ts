import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { FileApiProperty } from '../file-uploader.constant.property';

export class UploadedFileRdo {
  @ApiProperty(FileApiProperty.Id)
  @Expose()
  public id: string;

  @ApiProperty(FileApiProperty.OriginalName)
  @Expose()
  public originalName: string;

  @ApiProperty(FileApiProperty.HashName)
  @Expose()
  public hashName: string;

  @ApiProperty(FileApiProperty.SubDirectory)
  @Expose()
  public subDirectory: string;

  @ApiProperty(FileApiProperty.Mimetype)
  @Expose()
  public mimetype: string;

  @ApiProperty(FileApiProperty.Size)
  @Expose()
  public size: number;
}
