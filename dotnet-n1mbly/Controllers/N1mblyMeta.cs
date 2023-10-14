using Microsoft.AspNetCore.Mvc;

using Genzy.Models;

namespace Genzy.Controllers
{
    [Route("api/meta")]
    public class GenzyMeta
    {
        public GenzyMeta()
        { }

        [HttpGet]
        public object Get()
        {
            return Meta.Controllers;
        }
    }
}