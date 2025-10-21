import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendInterencheresExportDto } from './dto/send-interencheres-export.dto';
import { SendInvoiceEmailDto } from './dto/send-invoice-email.dto';

@ApiTags('Mail')
@Controller({
  path: 'mail',
  version: '1',
})
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('invoice')
  async sendInvoice(@Body() sendInvoiceEmailDto: SendInvoiceEmailDto) {
    return await this.mailService.sendInvoiceEmail(sendInvoiceEmailDto);
  }

  @Post('send-2fa')
  async send2fa() {
    return await this.mailService.sendDoubleFactorAuthEmail();
  }

  @Post('interencheres')
  async sendInterencheresExport(@Body() dto: SendInterencheresExportDto) {
    return this.mailService.sendInterencheresExportEmail(dto);
  }

  @Post('send/dummy')
  async sendDummyMail(): Promise<void> {
    await this.mailService.sendDummyMail();
  }
}
