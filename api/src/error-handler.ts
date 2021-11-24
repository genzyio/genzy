import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
}

const ErrorNameCode = {
  Error: 500,
}

export class ErrorHandler {

  private static response: Response;

  public static forResponse(response: Response) {
    this.response = response;
    return this;
  }

  public static handleError(e: Error): ErrorResponse {
    const errorResponse = {
      statusCode: ErrorNameCode[e.name] || 500,
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