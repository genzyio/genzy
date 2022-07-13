using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace N1mbly.Common
{
    public class ResponseProvider : ControllerBase
    {
        public IActionResult FromResult<T>(Result<T> result)
        {
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            switch (result.Error.ErrorType)
            {
                case ErrorType.Error:
                    return BadRequest(result.Error.Message);
                case ErrorType.NotFound:
                    return NotFound(result.Error.Message);
                case ErrorType.NoAccess:
                    return StatusCode((int)HttpStatusCode.Forbidden, result.Error.Message);
            }

            return BadRequest(result.Error.Message);
        }
    }
}
