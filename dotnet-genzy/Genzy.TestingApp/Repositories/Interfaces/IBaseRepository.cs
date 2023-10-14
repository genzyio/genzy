using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Genzy.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        Task<List<T>> GetAll(Expression<Func<T, bool>> filter = null, params Expression<Func<T, object>>[] includes);
        Task<T> Get(Expression<Func<T, bool>> filter = null, params Expression<Func<T, object>>[] includes);
        Task<T> Add(T entity);
        Task<T> Update(T entity);
        Task<T> Delete(int id);
        Task<List<T>> DeleteRange(List<T> entities);
    }
}
