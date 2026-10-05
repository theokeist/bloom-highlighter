/**
 * Bloom C# Stress Test
 * Testing: Interfaces, Flow, Properties, Async/Await, and Linq.
 */

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Bloom.Core
{
    public interface IProcessor<T> where T : class
    {
        Task<T> ProcessAsync(T input);
        bool IsAvailable { get; }
    }

    public abstract class BaseManager<T> : IProcessor<T> where T : class
    {
        protected readonly object _lock = new object();
        private List<T> _history = new List<T>();

        public virtual bool IsAvailable => _history != null && _history.Count < 100;

        public abstract Task<T> ProcessAsync(T input);

        protected void RecordHistory(T item)
        {
            lock (_lock)
            {
                if (item != null)
                {
                    _history.Add(item);
                }
            }
        }
    }

    public class MainEngine<T> : BaseManager<T> where T : class
    {
        public static readonly string Version = "2.5.0";
        private int _counter = 0;

        public override async Task<T> ProcessAsync(T input)
        {
            try
            {
                if (input is null)
                {
                    throw new ArgumentNullException(nameof(input));
                }

                // Flow and Logic
                var result = await Task.Run(() =>
                {
                    _counter++;
                    // Linq Test (Structural/logic hybrid)
                    var query = from h in new List<int> { 1, 2, 3 }
                                where h > 0
                                select h;

                    return input;
                });

                bool isValid = (result != null) && (_counter > 0);

                if (isValid)
                {
                    RecordHistory(result);
                    return result;
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return await Task.FromResult<T>(null);
            }
            finally
            {
                Console.WriteLine("Cleanup...");
            }
        }
    }
}
