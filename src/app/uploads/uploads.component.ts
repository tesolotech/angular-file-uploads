import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadsService } from "../file-uploads.service";

@Component({
  selector: "app-uploads",
  templateUrl: "./uploads.component.html",
  styleUrls: ["./uploads.component.css"],
})
export class UploadsComponent implements OnInit {
  ImageList: any;
  profileForm: FormGroup;
  error: string;
  images;
  fileUploaded: { hasDone: 0; status: 0; totalFiles: 0 };
  constructor(
    private fb: FormBuilder,
    private fileUploadsService: FileUploadsService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profile: [""],
    });

    this.fileUploadsService.getProfilesImage().subscribe((data) => {
      this.ImageList = data;
    });
    console.log(this.ImageList);
  }

  onSelectFile = (event: any) => {
    if (event.target.files.length > 0) {
      this.images = event.target.files;
    }
  };

  onSubmitFormValues = () => {
    console.log(this.profileForm);
    const formData = new FormData();
    for (let img of this.images) {
      formData.append("profile", img);
    }

    this.fileUploadsService.uploadFiles(formData).subscribe(
      (res) => (this.fileUploaded = res),
      (err) => (this.error = err)
    );
  };

  getFilePath = (path) => {
    return "http://localhost:3000/" + path;
  };
}
