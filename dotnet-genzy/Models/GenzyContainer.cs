using System;
using System.Collections.Generic;

namespace Genzy.Models
{
    public class GenzyContainer
    {
        public Registry Registry { get; } = new Registry();

        public GenzyContainer AddLocalService(Type service)
        {
            Registry.RegisterService(Activator.CreateInstance(service));
            return this;
        }

        public GenzyContainer AddLocalServices(List<Type> services)
        {
            foreach (var service in services)
            {
                Registry.RegisterService(Activator.CreateInstance(service));
            }
            return this;
        }

        public GenzyContainer AddRemoteService(Type service, string origin, string basePath = "/api")
        {
            Registry.RegisterService(Activator.CreateInstance(service));
            return this;
        }

        public GenzyContainer AddRemoteServices(List<Type> services, string origin, string basePath = "/api")
        {
            foreach (var service in services)
            {
                Registry.RegisterService(Activator.CreateInstance(service));
            }
            return this;
        }

        public Dictionary<string, object> GetAllServices() => Registry.Services;

        public override string ToString() => String.Join("-", GetAllServices().Keys);
    }
}
