import { User } from './User';

/**
 * PORT — IUserRepository
 * Domain interface (port) for user persistence.
 * Infrastructure layer provides the adapter.
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
