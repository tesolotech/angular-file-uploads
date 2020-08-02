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
  fileUploaded: { hasDone: 0; status: ""; totalFiles: 0 };
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
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      for (const img of event.target.files) {
        this.profileForm.get("profile").setValue(img);
      }
    }
  };

  onSubmitFormValues = () => {
    console.log(this.profileForm);
    const formData = new FormData();
    formData.append("profile", this.profileForm.get("profile").value);

    this.fileUploadsService.uploadFiles(this.profileForm).subscribe(
      (res) => (this.fileUploaded = res),
      (err) => (this.error = err)
    );
  };

  getFilePath = (path) => {
    return "http://localhost:3000/" + path;
  };
}
