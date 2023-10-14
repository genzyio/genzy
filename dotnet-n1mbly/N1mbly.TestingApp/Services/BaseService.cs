using System.Collections.Generic;
using System.Threading.Tasks;

using Genzy.Common;
using Genzy.Repositories.Interfaces;
using Genzy.Services.Interfaces;

namespace Genzy.Services
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        private IBaseRepository<T> _baseRepository;

        public BaseService(IBaseRepository<T> baseRepository)
        {
            _baseRepository = baseRepository;
        }

        public async Task<Result<T>> Add(int id, T data)
        {
            var result = await _baseRepository.Add(data);
            return Result<T>.SuccessResult(result);
        }

        public async Task<Result<T>> DeleteById(int id)
        {
            var result = await _baseRepository.Delete(id);
            return Result<T>.SuccessResult(result);
        }

        public async Task<Result<List<T>>> GetAll()
        {
            var result = await _baseRepository.GetAll();
            return Result<List<T>>.SuccessResult(result);
        }

        public async Task<Result<T>> GetById(int id)
        {
            var result = await _baseRepository.Get();
            return Result<T>.SuccessResult(result);
        }

        public async Task<Result<T>> UpdateById(int id, T data)
        {
            var result = await _baseRepository.Update(data);
            return Result<T>.SuccessResult(result);
        }
    }
}
