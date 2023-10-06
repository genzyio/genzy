using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using N1mbly.Models;
using System;

namespace N1mbly.Filters
{
    public class UseN1mblyStartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
        {
            return app =>
            {
                var provider = app.ApplicationServices.GetService(typeof(IActionDescriptorCollectionProvider)) as IActionDescriptorCollectionProvider;
                Meta.CollectControllersMetaData(provider);

                next(app);
            };
        }
    }
}