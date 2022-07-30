using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using N1mbly.Common;
using N1mbly.Models;
using N1mbly.Models.Interfaces;
using Newtonsoft.Json;

using HttpMethod = N1mbly.Common.HttpMethod;

namespace Models
{
    public class RemoteProxy<T> : IRemoteProxy<T> where T : class
    {
        private readonly IHttpClientFactory _clientFactory;
        private HttpClient _client;

        public RemoteProxy(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<Result<T>> RemoteCallHandler(HttpMethod httpMethod, string origin, string pathTemplate, List<Argument> argsList)
        {
            var path = Helpers.ConstructPathFromParams(pathTemplate,
                argsList.Where(p => p.Source == "path").ToList(),
                argsList.Where(p => p.Source == "query").ToList());
            var body = argsList.FirstOrDefault(p => p.Source == "body")?.Value;
            var result = await ProcessRemoteCall(httpMethod, origin, path, body);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler(HttpMethod httpMethod, string origin, string path)
        {
            var result = await ProcessRemoteCall(httpMethod, origin, path);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler(HttpMethod httpMethod, string origin, string path, object body = null)
        {
            var result = await ProcessRemoteCall(httpMethod, origin, path, body);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler(HttpMethod httpMethod, string origin, string path, List<Dictionary<string, string>> headers = null)
        {
            var result = await ProcessRemoteCall(httpMethod, origin, path, null, headers);
            return result;
        }

        public async Task<Result<T>> RemoteCallHandler(HttpMethod httpMethod, string origin, string path, object body = null, List<Dictionary<string, string>> headers = null)
        {
            var result = await ProcessRemoteCall(httpMethod, origin, path, body, headers);
            return result;
        }

        private async Task<Result<T>> ProcessRemoteCall(HttpMethod httpMethod, string origin, string path, object body = null, List<Dictionary<string, string>> headers = null)
        {
            try
            {
                _client = _clientFactory.CreateClient();

                if (headers != null)
                {
                    SetRequestHeaders(headers);
                }

                var response = await GetResponse(httpMethod, $"{origin}/{path}", body);
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

        private async Task<HttpResponseMessage> GetResponse(HttpMethod httpMethod, string path, object body = null)
        {
            HttpResponseMessage response = null;
            switch (httpMethod)
            {
                case HttpMethod.Get:
                    response = await _client.GetAsync(path);
                    break;
                case HttpMethod.Post:
                    response = await _client.PostAsync(path, GetJson(body));
                    break;
                case HttpMethod.Put:
                    response = await _client.PutAsync(path, GetJson(body));
                    break;
                case HttpMethod.Delete:
                    response = await _client.DeleteAsync(path);
                    break;
                case HttpMethod.Patch:
                    response = await _client.PatchAsync(path, GetJson(body));
                    break;
                default:
                    response = new HttpResponseMessage();
                    break;
            }

            return response;
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

        private void SetRequestHeaders(List<Dictionary<string, string>> headers)
        {
            foreach (var header in headers)
            {
                _client.DefaultRequestHeaders.Add(header.Keys.FirstOrDefault(), header.Values);
            }
        }
    }
}
