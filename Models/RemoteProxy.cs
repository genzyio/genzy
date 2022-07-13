using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using N1mbly.Common;
using Newtonsoft.Json;

namespace Models
{
    public class RemoteProxy
    {
        private readonly IHttpClientFactory _clientFactory;

        public RemoteProxy(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<Result<object>> RemoteCallHandler(string origin, string path, object body, string httpMethod)
        {
            try
            {
                var client = _clientFactory.CreateClient();
                var json = new StringContent(
                    JsonConvert.SerializeObject(body),
                    Encoding.UTF8,
                    "application/json");
                var response = await client.PostAsync($"{origin}/{path}", json);
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
    }
}
