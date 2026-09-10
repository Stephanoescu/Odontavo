import { IUserRepository } from '@identity/domain/IUserRepository';
import { Result, ok, fail } from '@shared/lib/result';
import { LoginRequestDto } from './dtos/LoginRequestDto';
import { UserResponseDto } from './dtos/UserResponseDto';

/**
 * USE CASE — LoginUseCase
 * Orchestrates user authentication.
 * Returns Result<UserResponseDto> — no exceptions thrown.
 */
export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: LoginRequestDto): Promise<Result<UserResponseDto>> {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());

    if (!user) {
      return fail('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }

    const passwordValid = user.verifyPassword(dto.password);
    if (!passwordValid) {
      return fail('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }

    return ok(user.toPlain());
  }
}
