using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;

using N1mbly.Common;

namespace N1mbly.Models
{
    public static class Meta
    {
        public static List<Controller> Controllers { get; } = new List<Controller>();

        public static void CollectControllersMetaData(IActionDescriptorCollectionProvider provider)
        {
            var controllerActionsDescriptors = provider.ActionDescriptors.Items
                .Select(actionDescriptor => (ControllerActionDescriptor)actionDescriptor)
                .Where(actionDescriptor => !actionDescriptor.ControllerName.Equals("") && !actionDescriptor.ControllerName.Equals("Meta"))
                .ToLookup(actionDescriptor => actionDescriptor.ControllerName, actionDescriptor => actionDescriptor)
                .ToList();

            foreach (var controllerActionDescriptor in controllerActionsDescriptors)
            {
                var controller = new Controller();
                var controllerName = controllerActionDescriptor.Key;
                controller.Name = controllerName;
                controller.Path = "";

                foreach (var action in controllerActionDescriptor.Select(item => item))
                {
                    var controllerAction = new Action();
                    var actionConstraint = action.ActionConstraints.FirstOrDefault();
                    var httpMethodActionConstraint = actionConstraint as HttpMethodActionConstraint;
                    var httpMethod = httpMethodActionConstraint.HttpMethods.FirstOrDefault();
                    var route = action.AttributeRouteInfo?.Template;
                    var actionMethodInfo = action.ControllerTypeInfo.GetMethod(action.ActionName);
                    var returnType = actionMethodInfo.ReturnType;
                    var nestedTypes = GetNestedTypes(returnType);
                    controllerAction.Name = action.ActionName;
                    controllerAction.Path = route;
                    controllerAction.HttpMethod = httpMethod;
                    controllerAction.Result = nestedTypes == null ? GetParsedTypeName(returnType.Name) : nestedTypes;

                    foreach (var actionParameter in action.Parameters.Where(param => !param.Equals(null)))
                    {
                        var param = new Param();
                        var paramType = actionParameter.ParameterType;
                        var nestedParamTypes = GetNestedTypes(paramType);
                        var parameterSource = actionParameter.BindingInfo.BindingSource.DisplayName;
                        param.Source = (ParamType)Enum.Parse(typeof(ParamType), parameterSource);
                        param.Name = actionParameter.Name;
                        param.Type = nestedParamTypes == null ? GetParsedTypeName(paramType.Name) : nestedParamTypes;
                        controllerAction.Params.Add(param);
                    }
                    controller.Actions.Add(controllerAction);
                }
                Meta.Controllers.Add(controller);
            }
        }

        private static ExpandoObject GetNestedTypes(Type currentType)
        {
            if ((!currentType.IsClass && !typeof(IEnumerable<object>).IsAssignableFrom(currentType)) || currentType == typeof(string))
            {
                return null;
            }

            if ((currentType.FullName.StartsWith("System.Collections.Generic") && currentType.GetGenericArguments()[0].FullName.StartsWith("System")) || currentType.FullName.Contains("[]"))
            {
                var nativeTypeName = currentType.FullName.Contains("[]") ? currentType.Name : currentType.GetGenericArguments()[0].Name;
                var nativeObject = new ExpandoObject();
                nativeObject.TryAdd("$isArray", true);
                nativeObject.TryAdd("$typeName", GetParsedTypeName(nativeTypeName));
                return nativeObject;
            }

            if (currentType.FullName.StartsWith("System.Threading.Tasks"))
            {
                currentType = currentType.GetGenericArguments()[0];
            }

            var result = new ExpandoObject { };
            var modelProperties = new PropertyInfo[0];
            var isArray = false;
            var typeName = GetParsedTypeName(currentType.Name);
            if (typeof(IEnumerable<object>).IsAssignableFrom(currentType))
            {
                var genericArguments = currentType.GetGenericArguments();
                var model = genericArguments.Length > 0 ? genericArguments[0] : null;
                modelProperties = model?.GetProperties() ?? new PropertyInfo[0];
                isArray = true;
                typeName = GetParsedTypeName(model?.Name ?? currentType.Name);
            }
            else if (currentType.IsClass)
            {
                modelProperties = currentType?.GetProperties() ?? new PropertyInfo[0];
            }

            foreach (var property in modelProperties)
            {
                var nestedType = GetNestedTypes(property.PropertyType);
                result.TryAdd(property.Name, nestedType == null ? GetParsedTypeName(property.PropertyType.Name) : nestedType);
            }
            result.TryAdd("$isArray", isArray);
            result.TryAdd("$typeName", GetParsedTypeName(typeName));

            return result;
        }

        private static string GetParsedTypeName(string typeName) => typeName.ToLower().Replace("32", "").Replace("[]", "").Replace("64", "").Replace("double", "float").Replace("single", "float");
    }

    public class Controller
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public List<Action> Actions { get; } = new List<Action>();
    }

    public class Action
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string HttpMethod { get; set; }
        public List<Param> Params { get; } = new List<Param>();
        public object Result { get; set; }
    }

    public class Param
    {
        public ParamType Source { get; set; }
        public string Name { get; set; }
        public object Type { get; set; }
    }
}
