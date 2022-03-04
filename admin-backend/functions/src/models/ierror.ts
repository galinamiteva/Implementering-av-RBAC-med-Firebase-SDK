
export interface IErrorResult {
  message: string;
}

export function createError(message: string): IErrorResult {
  return {
      message: message
  }
}