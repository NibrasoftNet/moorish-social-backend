import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { OAuthGoogleResponseDto } from '../auth/dto/oAuth-google-response.dto';

@Controller({
  path: 'auth/google',
  version: '1',
})
export class OauthController {
  constructor(
    private readonly oauthGoogleService: OauthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  @Get()
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CurrentUser() user: OAuthGoogleResponseDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const existUser = await this.usersService.findOne({
      email: user.emails[0].value,
    });
    if (!existUser) {
      console.log('aswer', user);
    }
  }
}
