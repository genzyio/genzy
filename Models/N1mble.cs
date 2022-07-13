using System;
using System.Collections.Generic;

using Models;

namespace N1mbly.Models
{
    public class N1mble
    {
        public Registry Registry { get; } = new Registry();

        public N1mble AddLocalService(Type service)
        {
            Registry.RegisterService(Activator.CreateInstance(service));
            return this;
        }

        public N1mble AddLocalServices(List<Type> services)
        {
            foreach (var service in services)
            {
                Registry.RegisterService(Activator.CreateInstance(service));
            }
            return this;
        }

        public N1mble AddRemoteService(Type service, string origin, string basePath = "/api")
        {
            Registry.RegisterService(Activator.CreateInstance(service));
            return this;
        }

        public N1mble AddRemoteServices(List<Type> services, string origin, string basePath = "/api")
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
