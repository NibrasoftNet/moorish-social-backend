import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { SessionEntity } from './entities/session.entity';
import { NullableType } from '../utils/types/nullable.type';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly i18n: I18nService,
  ) {}
  async create(createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    const session = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(session);
  }

  async findAll(): Promise<SessionEntity[]> {
    return await this.sessionRepository.find();
  }

  async findOne(
    field: FindOptionsWhere<SessionEntity>,
  ): Promise<NullableType<SessionEntity>> {
    return await this.sessionRepository.findOne({
      where: field,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<SessionEntity>,
  ): Promise<SessionEntity> {
    const session = await this.findOne(field);
    if (!session) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          errors: {
            auth: this.i18n.t('auth.wrongToken', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return session;
  }

  async update(
    userId: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<SessionEntity> {
    const session = await this.findOne({ userId });
    if (!session) {
      return await this.create(updateSessionDto);
    }
    Object.assign(session, updateSessionDto);
    return await this.sessionRepository.save(session);
  }

  async remove(userId: string): Promise<DeleteResult> {
    return this.sessionRepository.delete(userId);
  }
}
