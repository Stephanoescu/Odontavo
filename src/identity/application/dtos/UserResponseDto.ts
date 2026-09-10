import { UserRoleType } from '@identity/domain/UserRole';

/**
 * DTO — UserResponseDto
 * Plain serializable object returned from use cases to the presentation layer.
 * Never exposes the domain entity directly.
 */
export interface UserResponseDto {
  id: string;
  email: string;
  role: UserRoleType;
  name: string;
  avatar?: string;
  clinicName?: string;
  licenseNumber?: string;
}
