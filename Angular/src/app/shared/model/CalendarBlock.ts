/**
 * Clase que representa un bloqueo en el horario
 */
export class CalendarBlock {
    public id: string;
    public startHour: Date;
    public endHour: Date;
    public parentID: string;
    public name: string;
  
    constructor(
      private nID: string,
      private nStartHour: Date,
      private nEndHour: Date,
      private nParentID: string,
      private nName: string
    ) {
      this.id = nID;
      this.startHour = nStartHour;
      this.endHour = nEndHour;
      this.parentID = nParentID;
      this.name = nName;
    }
  }