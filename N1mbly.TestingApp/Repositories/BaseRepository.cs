using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

using N1mbly.Repositories.Interfaces;

namespace N1mbly.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
    {
        public BaseRepository() { }

        public async Task<TEntity> Add(TEntity entity)
        {
            return await Task.FromResult(entity);
        }

        public async Task<TEntity> Delete(int id)
        {
            return await Task.FromResult<TEntity>(null);
        }

        public async Task<List<TEntity>> DeleteRange(List<TEntity> entities)
        {
            return await Task.FromResult(entities);
        }

        public async Task<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Task.FromResult<TEntity>(null);
        }

        public async Task<List<TEntity>> GetAll(Expression<Func<TEntity, bool>> filter = null, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Task.FromResult(new List<TEntity>() { });
        }

        public async Task<TEntity> Update(TEntity entity)
        {
            return await Task.FromResult(entity);
        }
    }
}
