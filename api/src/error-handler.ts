import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
}

export type ErrorRegistry = { [key: string]: number };

export class ErrorHandler {

  private static response: Response;

  public static forResponse(response: Response) {
    this.response = response;
    return this;
  }

  public static handleError(e: Error, errorRegistry: ErrorRegistry): ErrorResponse {
    const statusCode = errorRegistry?.[e.name] || 500;
    const errorResponse = {
      statusCode,
      message: e.message
    };

    if(this.response)
      this.sendErrorResponse(errorResponse)
    
    this.response = null;
    return errorResponse;
  }

  private static sendErrorResponse(errorResponse: ErrorResponse) {
    this.response.status(errorResponse.statusCode);
    this.response.send({ message: errorResponse.message });
  }

}