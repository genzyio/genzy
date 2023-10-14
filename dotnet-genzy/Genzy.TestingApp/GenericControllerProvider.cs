using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;

using Genzy.Common;

using GenzyController = Genzy.Common.Controller;

namespace Genzy
{
    public class GenericControllerProvider : IApplicationFeatureProvider<ControllerFeature>
    {
        // Use to register controllers in runtime, register only controller with Genzy attribute
        public void PopulateFeature(IEnumerable<ApplicationPart> parts, ControllerFeature feature)
        {
            var currentAssembly = typeof(GenericControllerProvider).Assembly;
            var candidates = currentAssembly.GetExportedTypes().Where(x => x.GetCustomAttributes<GenzyController>().Any());

            foreach (var candidate in candidates)
            {
                foreach (var method in candidate.GetMethods())
                {
                    var dynamicType = GetDynamicType(candidate);
                    string methodName = method.Name;
                    string className = method.ReflectedType.Name;

                    var dismiss = new List<string> { "GetType", "ToString", "Equals", "GetHashCode" };
                    if (dismiss.Contains(methodName)) continue;

                    string fullMethodName = className + "." + methodName;
                    Console.WriteLine(fullMethodName);
                    var _method = dynamicType.DefineMethod(methodName, MethodAttributes.Public);
                    _method.GetILGenerator().Emit(OpCodes.Ret);

                    Type[] ctorParams = new Type[] { typeof(string) };
                    ConstructorInfo classCtorInfo = typeof(HttpGetAttribute).GetConstructor(ctorParams);

                    CustomAttributeBuilder myCABuilder = new CustomAttributeBuilder(
                                        classCtorInfo,
                                        new object[] { $"{Helpers.CamelToKebab(candidate.Name)}-{methodName}" });
                    dynamicType.SetCustomAttribute(myCABuilder);
                    var type = dynamicType.CreateType();
                    feature.Controllers.Add(type.GetTypeInfo());
                }
                // feature.Controllers.Add(typeof(BaseController<>).MakeGenericType(candidate).GetTypeInfo());
                // feature.Controllers.Add(candidateType.GetTypeInfo());
            }
        }

        private TypeBuilder GetDynamicType(Type candidate)
        {
            var assemblyName = new AssemblyName($"{candidate.Name}Controller");
            var dynamicAssembly = AssemblyBuilder.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
            var dynamicModule = dynamicAssembly.DefineDynamicModule("Main");
            var dynamicType = dynamicModule.DefineType($"{candidate.Name}Controller",
                    TypeAttributes.Public |
                    TypeAttributes.Class |
                    TypeAttributes.AutoClass |
                    TypeAttributes.AnsiClass |
                    TypeAttributes.BeforeFieldInit |
                    TypeAttributes.AutoLayout,
                    null);     // This is the type of class to derive from. Use null if there isn't one
            dynamicType.DefineDefaultConstructor(MethodAttributes.Public |
                                                MethodAttributes.SpecialName |
                                                MethodAttributes.RTSpecialName);

            // MethodBuilder meth = dynamicType.DefineMethod(
            //     "MyMethod",
            //     MethodAttributes.Public,
            //     typeof(int),
            //     new Type[] { typeof(int) });
            // meth.DefineParameter(1, ParameterAttributes.None, "number");
            // ILGenerator methIL = meth.GetILGenerator();
            // // To retrieve the private instance field, load the instance it
            // // belongs to (argument zero). After loading the field, load the
            // // argument one and then multiply. Return from the method with
            // // the return value (the product of the two numbers) on the
            // // execution stack.
            // methIL.Emit(OpCodes.Ldarg_1);
            // methIL.Emit(OpCodes.Ret);

            // dynamicAssembly.met = (Action)(() => System.Console.WriteLine("1"));
            // foreach (var property in Properties)
            //     AddProperty(dynamicType, property.Key, property.Value);

            // Type[] ctorParams = new Type[] { typeof(string) };
            // ConstructorInfo classCtorInfo = typeof(HttpGetAttribute).GetConstructor(ctorParams);

            // CustomAttributeBuilder myCABuilder = new CustomAttributeBuilder(
            //                     classCtorInfo,
            //                     new object[] { $"{Helpers.CamelToKebab(candidate.Name)}" });
            // dynamicType.SetCustomAttribute(myCABuilder);
            // var type = dynamicType.CreateType();
            return dynamicType;
        }

        private Type Initialise()
        {
            var newTypeName = Guid.NewGuid().ToString();
            var assemblyName = new AssemblyName("SomeNameController");
            var dynamicAssembly = AssemblyBuilder.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
            var dynamicModule = dynamicAssembly.DefineDynamicModule("Main");
            var dynamicType = dynamicModule.DefineType("SomeNameController",
                    TypeAttributes.Public |
                    TypeAttributes.Class |
                    TypeAttributes.AutoClass |
                    TypeAttributes.AnsiClass |
                    TypeAttributes.BeforeFieldInit |
                    TypeAttributes.AutoLayout,
                    null);     // This is the type of class to derive from. Use null if there isn't one
            dynamicType.DefineDefaultConstructor(MethodAttributes.Public |
                                                MethodAttributes.SpecialName |
                                                MethodAttributes.RTSpecialName);

            MethodBuilder meth = dynamicType.DefineMethod(
                "MyMethod",
                MethodAttributes.Public,
                typeof(int),
                new Type[] { typeof(int) });
            meth.DefineParameter(1, ParameterAttributes.None, "number");
            ILGenerator methIL = meth.GetILGenerator();
            // To retrieve the private instance field, load the instance it
            // belongs to (argument zero). After loading the field, load the
            // argument one and then multiply. Return from the method with
            // the return value (the product of the two numbers) on the
            // execution stack.
            methIL.Emit(OpCodes.Ldarg_1);
            methIL.Emit(OpCodes.Ret);

            Type[] ctorParams = new Type[] { typeof(string) };
            ConstructorInfo classCtorInfo = typeof(HttpGetAttribute).GetConstructor(ctorParams);

            CustomAttributeBuilder myCABuilder = new CustomAttributeBuilder(
                                classCtorInfo,
                                new object[] { "my-method" });
            dynamicType.SetCustomAttribute(myCABuilder);

            var type = dynamicType.CreateType();

            return type;
        }
    }
}
