import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller({
  path: 'mail',
  version: '1',
})
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send/dummy')
  async sendDummyMail(): Promise<void> {
    await this.mailService.sendDummyMail();
  }
}
