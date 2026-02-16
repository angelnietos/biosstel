import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Partial<Repository<User>>;

  beforeEach(() => {
    mockRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };

    service = new UsersService(mockRepository as Repository<User>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, email: 'test@example.com', name: 'Test User' },
      ];
      mockRepository.find = vi.fn().mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockRepository.findOne = vi.fn().mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      mockRepository.findOne = vi.fn().mockResolvedValue(null);

      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });
});
