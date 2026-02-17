export interface WorkerOptions {
  timeout?: number;
}

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
   * NOTE: The function `fn` must be strictly self-contained (no external closures).
   *
   * @param fn The function to execute.
   * @param data The data to pass to the function.
   * @param options Execution options (e.g., timeout).
   */
  public execute<T, R>(
    fn: (data: T) => R,
    data: T,
    options?: WorkerOptions,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const code = `
        self.onmessage = function(e) {
          try {
            const fn = ${fn.toString()};
            const result = fn(e.data);
            self.postMessage({ result, error: null });
          } catch (error) {
            self.postMessage({ result: null, error: error instanceof Error ? error.message : String(error) });
          }
        };
      `;

      const blob = new Blob([code], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      let timeoutId: any;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        worker.terminate();
        URL.revokeObjectURL(url);
      };

      worker.onmessage = (e) => {
        const { result, error } = e.data;
        cleanup();
        if (error) {
          reject(new Error(`Worker execution failed: ${error}`));
        } else {
          resolve(result);
        }
      };

      worker.onerror = (e) => {
        cleanup();
        reject(new Error(`Worker error: ${e.message}`));
      };

      if (options?.timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Worker timed out after ${options.timeout}ms`));
        }, options.timeout);
      }

      worker.postMessage(data);
    });
  }

  /**
   * Run a worker from a script file URL.
   * @param scriptUrl URL of the worker script.
   * @param data Data to pass.
   * @param options Execution options.
   */
  public runWorker<T, R>(
    scriptUrl: string,
    data: T,
    options?: WorkerOptions,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(scriptUrl);
      let timeoutId: any;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        worker.terminate();
      };

      worker.onmessage = (e) => {
        cleanup();
        resolve(e.data as R);
      };

      worker.onerror = (e) => {
        cleanup();
        reject(new Error(`Worker error: ${e.message}`));
      };

      if (options?.timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Worker timed out after ${options.timeout}ms`));
        }, options.timeout);
      }

      worker.postMessage(data);
    });
  }
}

export const workerService = WorkerService.getInstance();
