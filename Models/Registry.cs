using System.Collections.Generic;

namespace Models
{
    public class Registry
    {
        public Dictionary<string, object> Services { get; } = new Dictionary<string, object>();

        public void RegisterService(object service)
        {
            Services.Add(service.GetType().Name, service);
        }
    }
}
