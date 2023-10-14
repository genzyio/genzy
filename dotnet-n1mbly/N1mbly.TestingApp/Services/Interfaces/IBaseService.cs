using System.Collections.Generic;
using System.Threading.Tasks;

using Genzy.Common;

namespace Genzy.Services.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        public Task<Result<List<T>>> GetAll();
        public Task<Result<T>> GetById(int id);
        public Task<Result<T>> Add(int id, T data);
        public Task<Result<T>> UpdateById(int id, T data);
        public Task<Result<T>> DeleteById(int id);
    }
}
