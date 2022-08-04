using Microsoft.AspNetCore.Mvc.Controllers;
using System.Collections.Generic;
using System.Reflection;

namespace N1mbly.Filters
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
            var isController = base.IsController(typeInfo);

            if (!isController)
            {
                return false;
            }

            if (_names.Contains(typeInfo.Name))
            {
                return false;
            }

            return isController;
        }
    }
}