using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using N1mbly.Controllers;
using N1mbly.Filters;
using N1mbly.Options;
using System;

namespace N1mbly.Extensions
{
    public static class UseN1mblyExtension
    {
        public static IServiceCollection AddN1mbly(this IServiceCollection services, Action<N1mblyOptions> optionsBuilder)
        {
            var options = new N1mblyOptions();
            optionsBuilder(options);

            if (options.AddMetaRoute)
            {
                return services.AddSingleton<IStartupFilter, UseN1mblyStartupFilter>();
            }

            services.AddControllers()
                    .ConfigureApplicationPartManager(m =>
                    {
                        m.FeatureProviders.Clear();
                        m.FeatureProviders.Add(new NameControllerFilter(nameof(N1mblyMetaController)));
                    });

            return services;
        }
    }
}