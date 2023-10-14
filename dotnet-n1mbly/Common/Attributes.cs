using System;
using System.Collections.Generic;

namespace Genzy.Common
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class Controller : Attribute
    {
        public string Path { get; set; }

        public Controller(string path)
        {
            Path = path;
        }

        public Controller() { }

        public static List<Type> GetTypesWith<TAttribute>(bool inherit) where TAttribute : Attribute
        {
            var output = new List<Type>();
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();
            foreach (var assembly in assemblies)
            {
                var assemblyTypes = assembly.GetTypes();
                foreach (var type in assemblyTypes)
                {
                    if (type.IsDefined(typeof(TAttribute), inherit))
                        output.Add(type);
                }
            }
            return output;
        }
    }

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class Service : Attribute
    {
        public Service() { }
    }


    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class Repository : Attribute
    {
        public Repository() { }
    }

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class Get : Attribute
    {
        public string Path { get; set; }

        public Get(string path)
        {
            Path = path;
        }

        public Get() { }
    }
}
