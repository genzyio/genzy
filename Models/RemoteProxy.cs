using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using N1mbly.Common;
using N1mbly.Models.Interfaces;
using Newtonsoft.Json;

using HttpMethod = N1mbly.Common.HttpMethod;

namespace Models
{
    public class RemoteProxy : IRemoteProxy
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly HttpClient _client;

        public RemoteProxy(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _client = _clientFactory.CreateClient();
        }

        public async Task<Result<object>> RemoteCallHandler(string origin, string path, object body, HttpMethod httpMethod)
        {
            try
            {
                var response = await GetResponse($"{origin}/{path}", body, httpMethod);
                if (!response.IsSuccessStatusCode)
                {
                    return Result<object>.ErrorResult("Error while calling remote service", ErrorType.Error);
                }
                var content = await response.Content.ReadAsStringAsync();
                var jsonObject = JsonConvert.DeserializeObject<object>(content);
                return Result<object>.SuccessResult(jsonObject);
            }
            catch
            {
                return Result<object>.ErrorResult("Error while calling remote service", ErrorType.Error);
            }
        }

        // TODO: Add support for query and header params
        private async Task<HttpResponseMessage> GetResponse(string path, object body, HttpMethod httpMethod)
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
            var json = new StringContent(
                    JsonConvert.SerializeObject(body),
                    Encoding.UTF8,
                    encoding);
            return json;
        }
    }
}
