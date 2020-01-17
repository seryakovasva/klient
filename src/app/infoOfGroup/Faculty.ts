import {Course} from './Course';

export class Faculty {
  private _facultyName: string;
  private _course: Course[];


  get facultyName(): string {
    return this._facultyName;
  }

  set facultyName(value: string) {
    this._facultyName = value;
  }

  get course(): Course[] {
    return this._course;
  }

  set course(value: Course[]) {
    this._course = value;
  }
}
