import {Group} from './Group';

export class Course {
  private _courseNumber: number;
  private _group: Group[];


  get courseNumber(): number {
    return this._courseNumber;
  }

  set courseNumber(value: number) {
    this._courseNumber = value;
  }

  get group(): Group[] {
    return this._group;
  }

  set group(value: Group[]) {
    this._group = value;
  }
}
