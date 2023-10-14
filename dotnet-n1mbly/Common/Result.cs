namespace Genzy.Common
{
    public class Result<T>
    {
        private Result() { }

        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public Error Error { get; set; }

        public static Result<T> ErrorResult(string message, ErrorType errorType)
        {
            return new Result<T>
            {
                IsSuccess = false,
                Error = new Error
                {
                    ErrorType = errorType,
                    Message = message
                }
            };
        }

        public static Result<T> SuccessResult(T data)
        {
            return new Result<T> { IsSuccess = true, Data = data };
        }
    }
}
