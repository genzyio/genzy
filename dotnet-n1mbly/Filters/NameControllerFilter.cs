using Microsoft.AspNetCore.Mvc.Controllers;
using System.Collections.Generic;
using System.Reflection;

namespace Genzy.Filters
{
    public class NameControllerFilter : ControllerFeatureProvider
    {
        private readonly List<string> _names;

        public NameControllerFilter(params string[] names)
        {
            _names = new List<string>(names);
        }

        protected override bool IsController(TypeInfo typeInfo)
        {
            return _names.Contains(typeInfo.Name);
        }
    }
}