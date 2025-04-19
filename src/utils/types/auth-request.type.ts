import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

type I18nService = {
  i18nOptions: {
    resolvers: unknown[];
    formatter: (...args: unknown[]) => unknown;
    logging: boolean;
    throwOnMissingKey: boolean;
    loader: unknown;
    fallbackLanguage: string;
    loaderOptions: Record<string, unknown>;
  };
  logger: {
    context: string;
    options: Record<string, unknown>;
  };
  // Add other properties as needed
};

export type AuthRequest = Request & {
  user: JwtPayloadType;
  i18nService: I18nService;
  i18nLang: string;
  log: {
    child: (options: unknown) => unknown;
    [key: symbol]: unknown;
  };
};
