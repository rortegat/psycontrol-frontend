import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})
export class PatientAddComponent implements OnInit {


  public addForm: FormGroup
  public mismatch: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PatientAddComponent>
    ) {
      
  }

  ngOnInit() {
    
    this.addForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phone:['',Validators.required]
    })


  }

  cancel(): void {
    this.dialogRef.close();
  }

}