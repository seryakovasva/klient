export class Search {
  private _nameGroup: string;
  private _room: string;
  private _discipline: string;
  private _teacher: string;


  get nameGroup(): string {
    return this._nameGroup;
  }

  // set nameGroup(value: string) {
  //   this._nameGroup = value;
  // }

  get room(): string {
    return this._room;
  }

  // set room(value: string) {
  //   this._room = value;
  // }

  get discipline(): string {
    return this._discipline;
  }

  // set discipline(value: string) {
  //   this._discipline = value;
  // }

  get teacher(): string {
    return this._teacher;
  }

  // set teacher(value: string) {
  //   this._teacher = value;
  // }
}
