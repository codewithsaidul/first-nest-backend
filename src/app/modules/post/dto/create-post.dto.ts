import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
  IsMongoId,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean; // The `?` makes it optional in TypeScript

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsUrl()
  @IsNotEmpty()
  thumbnail: string;
  
  @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  authorId: string;
}
