using Microsoft.Extensions.Configuration;

using Genzy.Examples;
using Genzy.Models;

namespace Genzy
{
    public class GenzyApi : Startup
    {
        public GenzyApi(IConfiguration configuration) : base(configuration)
        {
            var genzy = new N1mble();
            genzy.AddLocalService(typeof(ExampleModel));
            dynamic service = new object();
            genzy.Registry.Services.TryGetValue("ExampleModel", out service);
            System.Console.WriteLine($"Value from ExampleModel controller -- {service.GetName()} -- by using Genzy");
            // TODO: Get service
            // TODO: Register routes (routes with genzy decorators will be automatically added, register only ones inside addLocalService/addRemoteService)
            // TODO: Add swagger
        }
    }
}
