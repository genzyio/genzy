// Auto-generated by Genzy Client CLI
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Genzy.Common;
using Genzy.Models;
using Genzy.Models.Interfaces;

namespace Genzy.Services.Randomservice
{
    public class Address
    {
        public string Street { get; set; }
        public int Number { get; set; }
    }

    public class User
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public List<Address> Addresses { get; set; }
    }

    public class RandomService
    {
        private readonly IRemoteProxy _remoteProxy = new RemoteProxy();

        public async Task<Result<object>> DobaviNesto()
        {
            var result = await _remoteProxy.RemoteCallHandler<object>(
              HttpMethod.Get,
              "http://localhost:3030/api" + "/service",
              "/dobavi",
              new List<Argument> { }
            );
            return result;
        }

        public async Task<Result<List<User>>> TestPost(User body, object romano)
        {
            var result = await _remoteProxy.RemoteCallHandler<List<User>>(
              HttpMethod.Post,
              "http://localhost:3030/api" + "/service",
              "/",
              new List<Argument>
              {
                new Argument { Source = "body", Name = "body", Value = body },
                new Argument { Source = "query", Name = "romano", Value = romano },
              }
            );
            return result;
        }

        public async Task<Result<object>> TestPut(object id, object body)
        {
            var result = await _remoteProxy.RemoteCallHandler<object>(
              HttpMethod.Put,
              "http://localhost:3030/api" + "/service",
              "/:id",
              new List<Argument>
              {
                new Argument { Source = "path", Name = "id", Value = id },
                new Argument { Source = "body", Name = "body", Value = body },
              }
            );
            return result;
        }

        public async Task<Result<object>> TestDel(object id)
        {
            var result = await _remoteProxy.RemoteCallHandler<object>(
              HttpMethod.Delete,
              "http://localhost:3030/api" + "/service",
              "/:id",
              new List<Argument>
              {
                new Argument { Source = "path", Name = "id", Value = id },
              }
            );
            return result;
        }
    }
}