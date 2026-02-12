import BaseService from "@/API-Service/baseApiService";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  type?: "image/jpeg" | "image/png" | "image/webp";
}

export class FileService {
  private static instance: FileService;

  private constructor() {}

  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  /**
   * Standard single-request upload
   */
  public async upload<T>(
    file: File,
    url: string,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return BaseService.post<T>(url, formData);
  }

  /**
   * Upload a file in chunks.
   * Useful for large files to ensure reliability and progress tracking.
   * Assumes backend supports a chunked upload protocol (e.g., separate init, chunk, and complete endpoints).
   *
   * This generic implementation assumes a simplified flow:
   * 1. POST /init -> returns uploadId
   * 2. POST /chunk -> uploads parts
   * 3. POST /complete -> assembles file
   */
  public async uploadChunked<T>(
    file: File,
    baseUrl: string, // e.g., 'videos/upload'
    onProgress?: (progress: UploadProgress) => void,
    chunkSize: number = 5 * 1024 * 1024, // 5MB default
  ): Promise<T> {
    const totalChunks = Math.ceil(file.size / chunkSize);

    // 1. Initialize
    const initResponse = await BaseService.post<{ uploadId: string }>(
      `${baseUrl}/init`,
      {
        filename: file.name,
        totalChunks,
        totalSize: file.size,
        contentType: file.type,
      },
    );
    const { uploadId } = initResponse;

    let loaded = 0;

    // 2. Upload chunks sequentially
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("uploadId", uploadId);
      formData.append("chunkIndex", i.toString());

      await BaseService.post(`${baseUrl}/chunk`, formData);

      loaded += chunk.size;
      if (onProgress) {
        onProgress({
          loaded,
          total: file.size,
          percentage: Math.round((loaded / file.size) * 100),
        });
      }
    }

    // 3. Complete
    return BaseService.post<T>(`${baseUrl}/complete`, { uploadId });
  }

  /**
   * Generate a preview URL for a given file.
   * Supports Images (via FileReader) and returns a blob URL for others.
   */
  public async generatePreview(file: File): Promise<string> {
    if (file.type.startsWith("image/")) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    return URL.createObjectURL(file);
  }

  /**
   * Compress an image file using HTML Canvas.
   */
  public async compressImage(
    file: File,
    options: CompressionOptions = {},
  ): Promise<File> {
    if (!file.type.startsWith("image/")) {
      console.warn(
        "FileService: compressImage only supports image files. Returning original file.",
      );
      return file;
    }

    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      type = "image/jpeg",
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }
            // Create new File object
            const newFile = new File([blob], file.name, {
              type: type,
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          type,
          quality,
        );
      };

      img.onerror = (err) => reject(err);
    });
  }
}

export const fileService = FileService.getInstance();
