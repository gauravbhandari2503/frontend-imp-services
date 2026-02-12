# FileService

The `FileService` provides utilities for handling file uploads, client-side processing, and previews.

## Overview

Handling files on the frontend involves more than just sending them to an API. Key challenges include:

1.  **Large Files**: Uploading 1GB+ files in one go often fails. We need chunking.
2.  **Performance**: Compressing images _before_ upload saves bandwidth.
3.  **UX**: Showing instant previews without waiting for a server round-trip.

### Key Features

- **Chunked Uploads**: Splits large files into 5MB chunks and uploads them sequentially.
- **Client-Side Compression**: Resizes and compresses images using the browser's Canvas API.
- **Instant Previews**: Generates `blob:` or `data:` URLs for immediate display.

## How to Use

### 1. Simple Upload

For small files (e.g., avatars, documents < 10MB).

```typescript
import { fileService } from "@/File-Service/fileService";

async function handleUpload(file: File) {
  try {
    const response = await fileService.upload(file, "users/avatar");
    console.log("Uploaded:", response);
  } catch (error) {
    console.error("Upload failed", error);
  }
}
```

### 2. Chunked Upload (Recommended for Video/Large Files)

Automatically handles the `init -> chunk -> complete` flow.

```typescript
const onProgress = (progress) => {
  console.log(`Upload is ${progress.percentage}% complete`);
};

await fileService.uploadChunked(largeVideoFile, "videos/upload", onProgress);
```

**Backend Requirements**:
Your backend must support the following endpoints for chunked uploads:

- `POST /init`: Returns `{ uploadId: string }`
- `POST /chunk`: Accepts `formData` with `chunk`, `uploadId`, `chunkIndex`
- `POST /complete`: Accepts `{ uploadId }` and reassembles the file.

### 3. Image Compression

Compress an image before uploading to save bandwidth.

```typescript
const compressedFile = await fileService.compressImage(originalFile, {
  maxWidth: 1024,
  quality: 0.7, // 70% quality
  type: "image/webp",
});

// Now upload the smaller file
await fileService.upload(compressedFile, "posts/image");
```

### 4. Generatng Previews

```typescript
// specific method
const previewUrl = await fileService.generatePreview(file);
// <img src={previewUrl} />
```
