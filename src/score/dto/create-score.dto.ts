import { IsString, IsNumber, IsNotEmpty, Min, Max, Length } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  time: number;
}

