using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using N1mbly.Common;
using N1mbly.Examples;
using N1mbly.Models.Interfaces;

namespace N1mbly.Controllers
{
    [ApiController]
    [Route("something/v1/nesto")]
    public class WeatherForecastController : ResponseProvider
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IRemoteProxy<WeatherForecast> _remoteProxy;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IRemoteProxy<WeatherForecast> remoteProxy)
        {
            _logger = logger;
            _remoteProxy = remoteProxy;
        }

        [HttpGet("temperatures")]
        public async Task<IEnumerable<WeatherForecast>> Get()
        {
            var result = await _remoteProxy.RemoteCallHandler(HttpMethod.Post, "https://localhost:5001", "something/v1/nesto/temperatures-form/1");

            if (!result.IsSuccess)
            {
                System.Console.WriteLine(result.Error.Message);
            }
            else
            {
                System.Console.WriteLine(result.Data.Date);
            }

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost("temperatures")]
        public IEnumerable<WeatherForecast> Update(string something, bool nesto)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost("temperatures-body")]
        public IEnumerable<WeatherForecast> UpdateBody([FromBody] List<int> something)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost("temperatures-form/{id}")]
        public WeatherForecast UpdateRoute(string id, int integer, [FromBody] int[] another, [FromForm] string form)
        {
            var rng = new Random();
            return new WeatherForecast
            {
                Date = DateTime.Now.AddDays(0),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            };
        }
    }
}
