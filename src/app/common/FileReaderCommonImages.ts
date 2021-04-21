import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class FileReaderCommon {
  static imageDataToBase64(imageData: Blob): Observable<string> {
    const result = new Subject<string>();

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const buffer: string | ArrayBuffer = reader.result;
      if (typeof buffer === "string") {
      } else {
        const imageBase64: string = FileReaderCommon.arrayBufferToBase64(
          buffer
        );
        result.next(imageBase64);
      }
    });

    reader.addEventListener("error", () => {
      result.error("error reading image data");
    });

    reader.readAsArrayBuffer(imageData);

    return result.asObservable();
  }

  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; ++i) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
