using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Genzy.Models;
using System;

namespace Genzy.Filters
{
    public class UseGenzyStartupFilter : IStartupFilter
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