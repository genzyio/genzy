using Microsoft.Extensions.Configuration;

using N1mbly.Examples;
using N1mbly.Models;

namespace N1mbly
{
    public class N1mblyApi : Startup
    {
        public N1mblyApi(IConfiguration configuration) : base(configuration)
        {
            var n1mbly = new N1mble();
            n1mbly.AddLocalService(typeof(ExampleModel));
            dynamic service = new object();
            n1mbly.Registry.Services.TryGetValue("ExampleModel", out service);
            System.Console.WriteLine($"Value from ExampleModel controller -- {service.GetName()} -- by using N1mbly");
            // TODO: Get service
            // TODO: Register routes (routes with n1mbly decorators will be automatically added, register only ones inside addLocalService/addRemoteService)
            // TODO: Add swagger
        }
    }
}
