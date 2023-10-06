using System.Collections.Generic;
using System.Threading.Tasks;

using N1mbly.Common;

namespace N1mbly.Models.Interfaces
{
    public interface IRemoteProxy
    {
        Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path);
        Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, object body = null);
        Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, List<Dictionary<string, string>> headers = null);
        Task<Result<T>> RemoteCallHandler<T>(HttpMethod httpMethod, string origin, string path, object body = null, List<Dictionary<string, string>> headers = null);
    }
}
