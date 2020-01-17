import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {Pair} from '../Pair';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class PairService {
  constructor(private http: ApiService) {
  }

  uploadFile(file: File, semestr: string) {
    const formData = new FormData();
    formData.append(semestr, file, file.name);
    return this.http.post('changeRasp/inputFile', formData);
  }

  addInfOfGroups(file: File) {
    const formData = new FormData();
    formData.append('groups', file, file.name);
    return this.http.post('changeRasp/addInfofGroups', formData);
  }

  getWeek(week: number, sun: Date, mon: Date) {
    const reqBody = {
      week: week,
      sunday: sun,
      monday: mon
    };
    return this.http.post('main/getToWeek', reqBody);
  }

  getData(query: string) {
    return this.http.get(query);
  }

  getFilePdf(group: string, teacher: string) {
    return this.http.getFile('main/exportPdf', group, teacher);
  }
  getFileXsl() {
    return this.http.getFile('main/exportXsl', null, null);
  }

  getParam(teacher: string, name: string) {
    const reqBody = {
      teacher: teacher,
      nameG: name
    };
    console.log(reqBody);
    return this.http.post('main/getParam' , reqBody);
  }

  getSearch( groups: string[], teachers: string[], dis: string, para: number,  room: string,
            date: Date, monday: string) {
    const reqBody = {
      name: groups,
      Teachers: teachers,
      discipline: dis,
      numberPair: para,
      room: room,
      date: date,
      monday: monday
    };
    console.log(reqBody);
    return this.http.post('main/search' , reqBody);
  }
  transfer(teacher: string, id: number, day: any, para: number, room: string) {
    const reqBody = {
      teacher: teacher,
      id_el: id,
      numberPair: para,
      date: day,
      room: room
    };
    return this.http.post('changeRasp/transfer' , reqBody);
  }


  // ---------------запрос на получ пар авториз преподавателя
  raspTeach(teacher: string, group_name: string[], dis: string, date: Date, monday: string) {
    const reqBody = {
      teacher: teacher,
      name: group_name,
      discipline: dis,
      date: date,
      monday: monday
    };
    return this.http.post('changeRasp/raspTeach' , reqBody);
  }

  // ------------------запрос на отмену пары
  cancelPair(pair: Pair) {
    const reqBody = {
      id_el: pair.id_el,
      nameGroup: pair.nameGroup,
      teacher: pair.teacher,
      discipline: pair.discipline,
      numberPair: pair.numberPair,
      room: pair.room,
      date: pair.date,
      dayWeek: pair.dayWeek,
      typepair: pair.typepair
    };
    return this.http.post('changeRasp/cancelPair' , reqBody);
  }
  // ----------запрос на восстановление пары
  recovery(pair: Pair) {
    const reqBody = {
      id_el: pair.id_el,
      nameGroup: pair.nameGroup,
      teacher: pair.teacher,
      discipline: pair.discipline,
      numberPair: pair.numberPair,
      room: pair.room,
      date: pair.date,
      dayWeek: pair.dayWeek,
      typepair: pair.typepair,
      info: pair.info
    };
    console.log(reqBody);
    return this.http.post('changeRasp/recovery' , reqBody);
  }
  addPair(teacher: string, group_name: string, dis: string, para: number,  date: Date, room: string, type: string, subdroup: string) {
    const reqBody = {
      nameGroup: group_name,
      teacher: teacher,
      discipline: dis,
      numberPair: para,
      room: room,
      date: date,
      typepair: type,
      subgroup: subdroup
    };
    return this.http.post('changeRasp/addPair' , reqBody);
  }

  // свододна ли группа
  // chek(name: String, date: Date, numP: String ) {
  //   const reqBody = {
  //     nameGroup: name,
  //     numberPair: numP,
  //     date: date,
  //   };
  //   return this.http.post('changeRasp/chek' , reqBody);
  // }
  // cвободные пары группы
  getPair(name: String, date: Date, subgroup: string) {

    const reqBody = {
      nameG: name,
      date: date,
      subgroup: subgroup
    };
    return this.http.post('changeRasp/getPair' , reqBody);
  }
  // получение дисциплин
  getDisGroup(teacher: string, name: string) {
    const reqBody = {
      teacher: teacher,
      nameG: name
    };
    return this.http.post('changeRasp/getDis' , reqBody);
  }
  // ----добавление консультации
  addClass(teacher: string, group_name: string, dis: string, para: number,  date: Date, room: string) {
    const reqBody = {
      teacher: teacher,
      nameGroup: group_name,
      discipline: dis,
      numberPair: para,
      room: room,
      date: date,
      typepair: 'к',
      subgroup: 'все'
    };
    console.log(reqBody);
    return this.http.post('changeRasp/addPair' , reqBody);
  }
  // удаление занятия
  deletePair(id: number) {
    const reqBody = {
      id_el: id
    };
    return this.http.post('changeRasp/deletePair' , reqBody);
  }

  getInfo(fio: string) {
    const reqBody = {
      FIO: fio
    };
    return this.http.post('main/getInfo' , reqBody);
  }
  //-------no using
  // ParamPair(teacher: string) {
  //   const reqBody = {
  //     teacher: teacher
  //   };
  //   return this.http.post('changeRasp/getParamPair' , reqBody);
  // }
}
