using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Genzy.Common;
using Genzy.Models;
using Genzy.Models.Interfaces;
using Genzy.Services.Randomservice;

using HttpMethod = Genzy.Common.HttpMethod;

namespace Genzy.Examples
{
    [ApiController]
    [Route("api-example/v1")]
    public class ExampleController : ResponseProvider
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ExampleController> _logger;
        private readonly IRemoteProxy _remoteProxy = new RemoteProxy();

        public ExampleController(ILogger<ExampleController> logger)
        {
            _logger = logger;
        }

        [HttpGet("queries/{query1}/queries/{query2}")]
        public bool QueryParamsTest(string query1, bool query2)
        {
            return query2;
        }

        [HttpPost("mixed/{param1}")]
        public IEnumerable<ExampleModel> MixedParamsTest(int param1, ExampleModel bodyParam)
        {
            var random = new Random();
            return Enumerable.Range(1, 5).Select(index => new ExampleModel
            {
                Date = DateTime.Now.AddDays(param1),
                TemperatureC = random.Next(-20, 55),
                Summary = Summaries[random.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost("body-params")]
        public List<ExampleModel> BodyParamsTest([FromBody] List<ExampleModel> bodyParams)
        {
            return bodyParams;
        }

        [HttpPost("single-model-response")]
        public ExampleModel SingleModelResponseTest()
        {
            var random = new Random();
            return new ExampleModel
            {
                Date = DateTime.Now.AddDays(0),
                TemperatureC = random.Next(-20, 55),
                Summary = Summaries[random.Next(Summaries.Length)]
            };
        }

        [HttpDelete("delete-test")]
        public ExampleModel DeleteTest()
        {
            var random = new Random();
            return new ExampleModel
            {
                Date = DateTime.Now.AddDays(0),
                TemperatureC = random.Next(-20, 55),
                Summary = Summaries[random.Next(Summaries.Length)]
            };
        }

        [HttpPut("put-test")]
        public ExampleModel PutTest(ExampleModel model)
        {
            var random = new Random();
            return new ExampleModel
            {
                Date = DateTime.Now.AddDays(0),
                TemperatureC = random.Next(-20, 55),
                Summary = Summaries[random.Next(Summaries.Length)]
            };
        }

        [HttpPost("remote-proxy")]
        public async Task<IActionResult> RemoteProxyInteractionTest()
        {
            var result = await _remoteProxy.RemoteCallHandler<ExampleModel>(HttpMethod.Post, "http://localhost:5000", "api-example/v1/single-model-response");

            return FromResult(result);
        }

        [HttpPost("remote-js-call")]
        public async Task<IActionResult> RemoteJsCallTest()
        {
            var remoteJsRandomService = new RandomService();
            var remoteJsResult = await remoteJsRandomService.DobaviNesto();

            return FromResult(remoteJsResult);
        }
    }
}
