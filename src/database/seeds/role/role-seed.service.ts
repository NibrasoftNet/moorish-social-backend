import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleCodeEnum } from '@/enums/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleCodeEnum.TENANTADMIN,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.TENANTADMIN,
          name: 'ADMIN',
          code: RoleCodeEnum.TENANTADMIN,
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleCodeEnum.USER,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.USER,
          name: 'USER',
          code: RoleCodeEnum.USER,
        }),
      );
    }

    const countCollectivity = await this.repository.count({
      where: {
        id: RoleCodeEnum.SUPERADMIN,
      },
    });

    if (!countCollectivity) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.SUPERADMIN,
          name: 'SUPERADMIN',
          code: RoleCodeEnum.SUPERADMIN,
        }),
      );
    }
  }
}
