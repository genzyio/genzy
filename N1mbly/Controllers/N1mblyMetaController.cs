using Microsoft.AspNetCore.Mvc;

using N1mbly.Models;

namespace N1mbly.Controllers
{
    [ApiController]
    [Route("api/meta")]
    public class N1mblyMetaController
    {
        public N1mblyMetaController() { }

        [HttpGet]
        public object Get()
        {
            return Meta.Controllers;
        }
    }
}
