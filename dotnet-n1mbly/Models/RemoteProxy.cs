using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using N1mbly.Common;
using N1mbly.Models.Interfaces;
using Newtonsoft.Json;

using HttpMethod = N1mbly.Common.HttpMethod;
using NetHttpMethod = System.Net.Http.HttpMethod;

namespace N1mbly.Models
{
    public class RemoteProxy : IRemoteProxy
    {
        private static readonly HttpClient _client = new HttpClient();

        public RemoteProxy()
        { }

        public async Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string pathTemplate, List<Argument> argsList)
        {
            var path = Helpers.ConstructPathFromParams(pathTemplate,
                argsList.Where(p => p.Source == "path").ToList(),
                argsList.Where(p => p.Source == "query").ToList());
            var body = argsList.FirstOrDefault(p => p.Source == "body")?.Value;
            var result = await ProcessRemoteCall<T>(httpMethod, origin, path, body);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path)
        {
            var result = await ProcessRemoteCall<T>(httpMethod, origin, path);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, object body = null)
        {
            var result = await ProcessRemoteCall<T>(httpMethod, origin, path, body);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, List<Dictionary<string, string>> headers = null)
        {
            var result = await ProcessRemoteCall<T>(httpMethod, origin, path, null, headers);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, object body = null, List<Dictionary<string, string>> headers = null)
        {
            var result = await ProcessRemoteCall<T>(httpMethod, origin, path, body, headers);
            return result;
        }

        private async Task<Result<T>> ProcessRemoteCall<T>(HttpMethod httpMethod, string origin, string path, object body = null, List<Dictionary<string, string>> headers = null)
        {
            try
            {
                var fullPath = $"{origin}{$"/{path}".Replace("//", "/")}";
                var message = GetRequestMessage(httpMethod, fullPath, headers, body);

                using var response = await _client.SendAsync(message);
                if (!response.IsSuccessStatusCode)
                {
                    return Result<T>.ErrorResult("Error while calling remote service", ErrorType.Error);
                }
                var content = await response.Content.ReadAsStringAsync();
                var jsonObject = JsonConvert.DeserializeObject<T>(content);
                return Result<T>.SuccessResult(jsonObject);
            }
            catch
            {
                return Result<T>.ErrorResult("Error while calling remote service", ErrorType.Error);
            }
        }

        private HttpRequestMessage GetRequestMessage(HttpMethod httpMethod, string path, List<Dictionary<string, string>> headers = null, object body = null)
        {
            var message = new HttpRequestMessage(new NetHttpMethod(httpMethod.ToString()), path);
            if (headers != null)
            {
                SetRequestHeaders(message, headers);
            }

            message.Content = GetJson(body);

            return message;
        }

        private StringContent GetJson(object body, string encoding = "application/json")
        {
            if (body == null)
            {
                return null;
            }

            var json = new StringContent(
                    JsonConvert.SerializeObject(body),
                    Encoding.UTF8,
                    encoding);
            return json;
        }

        private void SetRequestHeaders(HttpRequestMessage message, List<Dictionary<string, string>> headers)
        {
            foreach (var header in headers)
            {
                message.Headers.Add(header.Keys.FirstOrDefault(), header.Values);
            }
        }
    }
}