export class Pair {
  id_el: number;
  nameGroup: string;
  subgroup: number;
  dayWeek: string;
  numberPair: number;
  typepair: string; //weeks: any;
  room: string;
  discipline: string;
  teacher: string;
  date: Date;
  info: string;

  editPair(p: Pair) {
    this.id_el = p.id_el;
    this.nameGroup = p.nameGroup;
    this.subgroup = p.subgroup;
    this.dayWeek = p.dayWeek;
    this.numberPair = p.numberPair;
    this.typepair = p.typepair;
    this.date = p.date;
   // this.weeks = p.weeks;
    this.discipline = p.discipline;
    this.room = p.room;
    this.teacher = p.teacher;
    this.info = p.info;
  }
}
