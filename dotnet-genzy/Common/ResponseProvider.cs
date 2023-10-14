using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Genzy.Common
{
    public class ResponseProvider : ControllerBase
    {
        public IActionResult FromResult<T>(Result<T> result)
        {
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            return result.Error.ErrorType switch
            {
                ErrorType.Error => BadRequest(result.Error.Message),
                ErrorType.NotFound => NotFound(result.Error.Message),
                ErrorType.NoAccess => StatusCode((int)HttpStatusCode.Forbidden, result.Error.Message),
                _ => BadRequest(result.Error.Message),
            };
        }
    }
}