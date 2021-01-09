import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { addDays, addMinutes, startOfDay, subDays, subMinutes } from 'date-fns';
import { Clip } from '../models/clipRequestDTO';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }

  clipToEvent(clip:Clip, actions: CalendarEventAction[]):CalendarEvent{
    
    let event = {
    start: subMinutes(new Date(clip.created_at), 10),
    end: addMinutes(new Date(clip.created_at), 10),
    title: clip.title,
    color: colors.blue,
    actions: actions,
    allDay: false,
    resizable: {
      beforeStart: false,
      afterEnd: false,
    },
    draggable: false,
  }
  return event;
}

clipArrayToEventArray(clips:Clip[], actions: CalendarEventAction[]):CalendarEvent[]{
  let result:Array<CalendarEvent>= [];
  for(let clip of clips){
      result.push(this.clipToEvent(clip,actions));
  }
  return result;
}

}