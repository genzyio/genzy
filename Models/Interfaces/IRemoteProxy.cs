using System.Threading.Tasks;

using N1mbly.Common;

namespace N1mbly.Models.Interfaces
{
    public interface IRemoteProxy
    {
        Task<Result<object>> RemoteCallHandler(string origin, string path, object body, HttpMethod httpMethod);
    }
}
