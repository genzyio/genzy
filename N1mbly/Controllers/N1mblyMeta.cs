using Microsoft.AspNetCore.Mvc;

using N1mbly.Models;

namespace N1mbly.Controllers
{
    [Route("api/meta")]
    public class N1mblyMeta
    {
        public N1mblyMeta()
        { }

        [HttpGet]
        public object Get()
        {
            return Meta.Controllers;
        }
    }
}