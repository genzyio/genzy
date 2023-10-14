using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

using Genzy.Common;
using GenzyController = Genzy.Common.Controller;

public class GenericControllerRouteConvention : IControllerModelConvention
{
    // Use to adjust paths for generic controller which has Genzy controller attribute
    public void Apply(ControllerModel controller)
    {
        if (controller.ControllerType.IsGenericType)
        {
            var genericType = controller.ControllerType.GenericTypeArguments[0];
            var customNameAttribute = genericType.GetCustomAttribute<GenzyController>();

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
