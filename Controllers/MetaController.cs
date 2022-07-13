using Microsoft.AspNetCore.Mvc;

using N1mbly.Models;

namespace N1mbly.Controllers
{
    [ApiController]
    [Route("api/meta")]
    public class MetaController
    {
        public MetaController() { }

        [HttpGet]
        public object Get()
        {
            return Meta.Controllers;
        }
    }
}
