import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goals';
import {MatSnackBar} from '@angular/material';
//import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-goals.component',
    templateUrl: 'add-goals.component.html',
})
export class AddGoalComponent {
//    isLinear = true;
//    firstFormGroup: FormGroup;
//    secondFormGroup: FormGroup;
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddGoalComponent>,
//        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
/*
    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
    }
    */
}
