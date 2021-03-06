import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/api/patient.service';
import { Patient } from 'src/app/models/patient';
import { SessionService } from 'src/app/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationInfoComponent } from '../../modal/application-info/application-info.component';
import { ApplicationErrorComponent } from '../../modal/application-error/application-error.component';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  public patient: Patient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private patientService: PatientService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => { this.sessionService.loading.next(true) }, 0);
    this.patientService.getPatient(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((rsp) => {
      this.patient = rsp;
      this.sessionService.loading.next(false);
    });
  }

  newConsult(): void {
    this.router.navigate(['/home/consult-add', this.patient.id]);
  }

  deletePatientButton(): void {
    var info: any = {
      action: "Eliminar paciente",
      message: "Está seguro de eliminar al paciente " + this.patient.firstname,
    };
    const dialogRef = this.dialog.open(ApplicationInfoComponent, {
      data: info
    });
    dialogRef.afterClosed().subscribe(rsp => {
      if (rsp == true)
        this.deletePatient();
    });
  }

  deletePatient(): void {
    this.patientService.deletePatient(this.patient.id).subscribe(() => {
      this.snack.open("Paciente Eliminado")._dismissAfter(2000);
      this.router.navigate(['/home/patient-list']);
    },
      (error) => {
        console.log(error)
        this.dialog.open(ApplicationErrorComponent, {
          data: error
        });
      });
  }

  public consultas: boolean = false;

  clicked() {
    this.consultas = !this.consultas;
  }

}
