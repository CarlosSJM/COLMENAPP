import { PartialType } from '@nestjs/mapped-types';
import { CreateApiaryDto } from './create-apiary.dto';

export class UpdateApiaryDto extends PartialType(CreateApiaryDto) {}
