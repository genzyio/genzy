using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Genzy.Models;

namespace Genzy.Common
{
    public static class Helpers
    {
        public static string CamelToKebab(string camelCaseString) => Regex.Replace(camelCaseString, "([a-z0-9]|(?=[a-z]))([A-Z])", "$1-$2").ToLower();

        public static string ConstructJsPath(string dotnetPath)
        {
            var jsPath = dotnetPath;
            var regex = new Regex("{(.*?)}");
            var matches = regex.Matches(dotnetPath);
            foreach (Match match in matches)
            {
                var valueWithoutBrackets = match.Groups[1].Value;
                var valueWithBrackets = match.Value;
                jsPath = jsPath.Replace(valueWithBrackets, $":{valueWithoutBrackets}");
            }
            return jsPath;
        }

        public static string ConstructPathFromParams(string path, List<Argument> pathArgs, List<Argument> queryArgs)
        {
            var constructedPath = path;
            var regex = new Regex("(:\\w+)");
            var matches = regex.Matches(path);
            foreach (Match match in matches)
            {
                var matchedValue = match.Value;
                var matchedParamName = matchedValue.Substring(1);
                var value = pathArgs.FirstOrDefault(p => p.Name == matchedParamName)?.Value?.ToString() ?? "";
                constructedPath = constructedPath.Replace(matchedValue, value);
            }
            var index = 0;
            foreach (Argument param in queryArgs)
            {
                constructedPath += index == 0 ? "?" : "&";
                constructedPath += $"{param.Name}={param.Value}";
            }
            return constructedPath;
        }

        public static void MatchAndMap<TSource, TDestination>(this TSource source, TDestination destination)
            where TSource : class, new()
            where TDestination : class, new()
        {
            if (source != null && destination != null)
            {
                List<PropertyInfo> sourceProperties = source.GetType().GetProperties().ToList<PropertyInfo>();
                List<PropertyInfo> destinationProperties = destination.GetType().GetProperties().ToList<PropertyInfo>();

                foreach (PropertyInfo sourceProperty in sourceProperties)
                {
                    PropertyInfo destinationProperty = destinationProperties.Find(item => item.Name == sourceProperty.Name);

                    if (destinationProperty != null)
                    {
                        try
                        {
                            destinationProperty.SetValue(destination, sourceProperty.GetValue(source, null), null);
                        }
                        catch (Exception ex)
                        {
                            System.Console.WriteLine("Exception occurred in MatchAndMap", ex);
                        }
                    }
                }
            }

        }

        public static TDestination MapProperties<TDestination>(this object mapSource)
            where TDestination : class, new()
        {
            var destination = Activator.CreateInstance<TDestination>();
            MatchAndMap(mapSource, destination);

            return destination;
        }
    }
}
