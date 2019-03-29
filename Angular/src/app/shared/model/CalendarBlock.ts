/**
 * Clase que representa un bloqueo en el horario
 */
export class CalendarBlock {
    public id: string;
    public startHour: Date;
    public endHour: Date;
    public parentID: string;
    public dayID: string;
    public name: string;
  
    constructor(
      private nID: string,
      private nStartHour: Date,
      private nEndHour: Date,
      private nParentID: string,
      private nDayID: string,
      private nName: string
    ) {
      this.id = nID;
      this.startHour = nStartHour;
      this.endHour = nEndHour;
      this.parentID = nParentID;
      this.dayID = nDayID;
      this.name = nName;
    }
  }