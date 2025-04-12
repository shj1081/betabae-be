import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateMatchRequestDto {
  @IsInt()
  @IsNotEmpty()
  requestedId: number; // ID of the user to whom the match request is being sent
}
