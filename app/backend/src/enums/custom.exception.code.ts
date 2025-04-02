export enum ExceptionCode {
  USER_ALREADY_EXISTS = 'AUTH_001',
  USER_NOT_FOUND = 'AUTH_002',
  INVALID_CREDENTIALS = 'AUTH_003',
  SESSION_NOT_FOUND = 'AUTH_004',
  ALREADY_LOGGED_IN = 'AUTH_005',
  SESSION_CREATION_ERROR = 'AUTH_006',
  SESSION_DELETION_ERROR = 'AUTH_007',
  REDIS_CONNECTION_ERROR = 'REDIS_001',
  REDIS_OPERATION_ERROR = 'REDIS_002',
  REDIS_AUTH_ERROR = 'REDIS_003',
}
