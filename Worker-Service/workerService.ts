export class WorkerService {
  private static instance: WorkerService;

  private constructor() {}

  public static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  /**
   * Execute a function in a web worker.
   * NOTE: The function `fn` must be "pure" in the sense that it cannot rely on closures
   * or external variables. It must be self-contained.
   *
   * @param fn The function to execute. Receives `data` as argument.
   * @param data The data to pass to the function.
   */
  public execute<T, R>(fn: (data: T) => R, data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      // Create the worker script
      const code = `
        self.onmessage = function(e) {
          try {
            const fn = ${fn.toString()};
            const result = fn(e.data);
            self.postMessage({ result, error: null });
          } catch (error) {
            self.postMessage({ result: null, error: error.message });
          }
        };
      `;

      const blob = new Blob([code], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);

      worker.onmessage = (e) => {
        const { result, error } = e.data;
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
        // Cleanup
        worker.terminate();
        URL.revokeObjectURL(url);
      };

      worker.onerror = (e) => {
        reject(e);
        worker.terminate();
        URL.revokeObjectURL(url);
      };

      // Send data
      worker.postMessage(data);
    });
  }

  /**
   * Create a long-lived worker from a function.
   * The function body becomes the worker script.
   * Useful if you need to maintain state in the worker.
   */
  public createWorker(fn: () => void): Worker {
    const code = `(${fn.toString()})()`;
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  }
}

export const workerService = WorkerService.getInstance();
