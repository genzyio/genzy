using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

using N1mbly.Common;
using N1mblyController = N1mbly.Common.Controller;

public class GenericControllerRouteConvention : IControllerModelConvention
{
    // Use to adjust paths for generic controller which has N1mbly controller attribute
    public void Apply(ControllerModel controller)
    {
        if (controller.ControllerType.IsGenericType)
        {
            var genericType = controller.ControllerType.GenericTypeArguments[0];
            var customNameAttribute = genericType.GetCustomAttribute<N1mblyController>();

            var basePath = customNameAttribute?.Path ?? Helpers.CamelToKebab(genericType.Name);
            if (basePath.Contains("[model]"))
            {
                basePath = basePath.Replace("[model]", genericType.Name);
            }

            controller.Selectors.Add(new SelectorModel
            {
                AttributeRouteModel = new AttributeRouteModel(new RouteAttribute(basePath)),
            });
            controller.ControllerName = genericType.Name;
        }
    }
}
