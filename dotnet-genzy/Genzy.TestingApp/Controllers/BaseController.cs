using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Genzy.Common;
using Genzy.Services.Interfaces;

namespace Genzy.Controllers
{
    public class BaseController<T> : ResponseProvider where T : class
    {
        private readonly IBaseService<T> _baseService;

        public BaseController(IBaseService<T> baseService)
        {
            _baseService = baseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _baseService.GetAll();
            return FromResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _baseService.GetById(id);
            return FromResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int id, [FromBody] T data)
        {
            var result = await _baseService.Add(id, data);
            return FromResult(result);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> UpdateById(int id, [FromBody] T data)
        {
            var result = await _baseService.UpdateById(id, data);
            return FromResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(int id)
        {
            var result = await _baseService.DeleteById(id);
            return FromResult(result);
        }
    }
}