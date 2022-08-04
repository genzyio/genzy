using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using N1mbly.Extensions;
using N1mbly.Repositories;
using N1mbly.Repositories.Interfaces;
using N1mbly.Services;
using N1mbly.Services.Interfaces;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace N1mbly
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddN1mbly(options =>
            {
                options.AddMetaRoute = false;
            });

            services.AddHttpClient();

            // Define services here
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

            // Define repositories here
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddControllers().AddNewtonsoftJson(opts => opts.SerializerSettings
                .Converters.Add(new StringEnumConverter(typeof(CamelCaseNamingStrategy))));

            services.AddMvc(o =>
                 o.Conventions.Add(new GenericControllerRouteConvention())
            ).ConfigureApplicationPartManager(m =>
            {
                m.FeatureProviders.Add(new GenericControllerProvider());
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "N1mbly", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "N1mbly v1");
                    c.RoutePrefix = "docs";
                });
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}