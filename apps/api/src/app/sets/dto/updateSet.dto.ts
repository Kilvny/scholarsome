import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CardWithIdValidator } from "../validator/cardWithId.validator";

export class UpdateSetDto {
  @ApiProperty({
    description: "The title or name of the set",
    required: false
  })
  @IsString()
  @IsOptional()
    title?: string;

  @ApiProperty({
    description: "A description explaining what the set contains",
    required: false
  })
  @IsString()
  @IsOptional()
    description?: string;

  @ApiProperty({
    description: "Whether the set is private",
    required: false
  })
  @IsBoolean()
  @IsOptional()
    private?: boolean;

  @ApiProperty({
    description: "New cards to replace the existing ones in the set with",
    required: false
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardWithIdValidator)
    cards?: CardWithIdValidator[];
}