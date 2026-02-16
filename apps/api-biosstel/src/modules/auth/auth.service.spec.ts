import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(() => {
    mockUsersService = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    mockJwtService = {
      sign: vi.fn().mockReturnValue('mock-jwt-token'),
    };

    service = new AuthService(
      mockUsersService as UsersService,
      mockJwtService as JwtService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUsersService.findOne = vi.fn().mockResolvedValue(mockUser);

      // Note: In real test, we'd need bcrypt comparison
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeTruthy();
    });

    it('should return null if user not found', async () => {
      mockUsersService.findOne = vi.fn().mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 1, email: 'test@example.com' };

      const result = await service.login(user);
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-jwt-token');
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      const mockCreatedUser = {
        id: 1,
        ...createUserDto,
      };

      mockUsersService.create = vi.fn().mockResolvedValue(mockCreatedUser);
      mockUsersService.save = vi.fn().mockResolvedValue(mockCreatedUser);

      const result = await service.register(createUserDto);
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(createUserDto.email);
    });
  });
});
