using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using N1mbly.Models;

namespace N1mbly.Extensions
{
    public static class UseN1mblyExtension
    {
        public static IApplicationBuilder UseN1mbly(this IApplicationBuilder app)
        {
            var provider = app.ApplicationServices.GetService(typeof(IActionDescriptorCollectionProvider)) as IActionDescriptorCollectionProvider;
            Meta.CollectControllersMetaData(provider);

            return app;
        }
    }
}