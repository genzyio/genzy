using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Genzy.Controllers;
using Genzy.Filters;
using Genzy.Options;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Genzy.Extensions
{
    public static class UseGenzyExtension
    {
        public static IServiceCollection AddGenzy(this IServiceCollection services, Action<GenzyOptions> optionsBuilder)
        {
            var options = new GenzyOptions();
            optionsBuilder(options);

            if (!options.AddMetaRoute)
            {
                return services;
            }

            services.AddControllers()
                    .ConfigureApplicationPartManager(m =>
                    {
                        m.FeatureProviders.Add(new NameControllerFilter(nameof(GenzyMeta)));
                    });

            services.AddControllers().AddNewtonsoftJson(opts => opts.SerializerSettings
                    .Converters.Add(new StringEnumConverter(typeof(CamelCaseNamingStrategy))));

            return services.AddSingleton<IStartupFilter, UseGenzyStartupFilter>();
        }
    }
}
