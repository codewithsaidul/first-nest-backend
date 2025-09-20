import { IsOptional, IsNumber, Min, IsString, IsIn, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer'; // ✅ এটি class-transformer থেকে ইম্পোর্ট করুন

export class FindAllPostQueryDto {
  @IsOptional()
  @Type(() => Number) // ধাপ ১: ভ্যালুটিকে নম্বরে রূপান্তর করো
  @IsNumber() // ধাপ ২: এখন চেক করো এটি আসলেই একটি নম্বর কিনা
  @Min(1) // ধাপ ৩: অতিরিক্ত ভ্যালিডেশন (ঐচ্ছিক)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()

  search?: string;
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}