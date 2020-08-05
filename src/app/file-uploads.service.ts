import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FileUploadsService {
  postUrl = "http://localhost:3000/uploadFiles";
  getUrl = "http://localhost:3000/getFiles";

  constructor(private http: HttpClient) {}

  uploadFiles(formData) {
    const data = [];
    data.push(formData);
    return this.http
      .post(`${this.postUrl}`, formData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        map((event) => this.getErrorMessage(event, formData)),
        catchError(this.handleError)
      );
  }

  getProfilesImage() {
    return this.http.get(this.getUrl).pipe(catchError(this.handleError));
  }

  private getErrorMessage(event, data) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
      case HttpEventType.Response:
        return this.apiResponse(event);
      default:
        return `You get ${event.status} status surprising upload event: ${event.statusText}.`;
    }
  }

  private fileUploadProgress(event) {
    const hasDone = event.loaded - event.total;
    const totalFiles = event.total;
    return {
      status: 1,
      hasDone,
      totalFiles,
    };
  }

  private apiResponse(event) {
    return event.body;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }
}
