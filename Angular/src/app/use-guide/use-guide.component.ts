import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-use-guide',
  templateUrl: './use-guide.component.html'
})
export class UseGuideComponent implements OnInit {
  private imageUrls: (string | IImage)[];
  private height: string = '70vh';
  private arrowSize: string = '30px';
  private showArrows: boolean = false;
  private disableSwiping: boolean = false;
  private autoPlay: boolean = false;
  private backgroundSize: string = 'cover';
  private backgroundPosition: string = 'center center';
  private backgroundRepeat: string = 'no-repeat';
  private showDots: boolean = false;
  private showCaptions: boolean = true;
  private captionColor: string = '#4b4b4b';
  private captionBackground: string = '#e4f2f5';
  private width: string = '100%';
  private dotColor: string = '#008ca4';

  private device :string;
  private guideTitles:string[] = ['Buscar Materias', 'Información de Materia','Alternativas de Horario','Bloqueos','Visualizar Horario','Remover Materias','Conflictos','Inscribir Materias'];
  private guideMiniTitles:string[] = ['Buscar', 'Info. Materia','Alternativas','Bloqueos','Horario','Remover Materias','Conflictos','Inscribir Materias'];

  @ViewChild('slideshow') slides: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 768) {
      this.device = 'mobile';
    } 
    else if(event.target.innerWidth >= 768 && event.target.innerWidth <= 1024){
      this.device = 'tablet';
    }
    else if(event.target.innerWidth>= 1025){
      this.device = 'desktop';
    }
  }
  private descriptions = {
    mobile : {
      search:'Para buscar materias, utiliza el buscador de la aplicación, puedes utilizar el filtro básico o el avanzado, llenar los criterios de búsqueda deseados y una lista de materias que cumplan tus criterios será desplegada',
      moreInfo:'Una vez tengas la lista de materias, se mostrará una lista con los diferentes horarios ofrecidos en dicha materia, para obtener más información de esta, presiona sobre ella y podrás ver todos los datos.',
      plan:'En JPlanner puedes crear hasta 6 alternativas de horarios, estas están ubicadas en la parte superior, puedes cambiar el nombre de la alternativa y puedes navegar entre alternativas presionando los botones respectivos. Para inscribir una materia oprime el botón "+" en la materia que deseas inscribir y esta se inscribirá en la alternativa que tienes seleccionada'  ,    
      block:'Puedes crear bloqueos en los cuales no quieras inscribir materias, para hacerlo oprime el botón "+" ubicado en la esquina inferior derecha, ahí encontraras la opción Agregar Bloqueo, un formulario con los datos del bloqueo se desplegará y podrás crear tus bloqueos. Cuando busques materias no aparecerán las que se crucen con los bloqueados creados. Puedes editar y eliminar bloqueos',
      horaries: 'Para ver tus diferentes tentativas de horario oprime el icono respectivo y podrás navegar por tus diferentes alternativas de horario viendo las materias y bloqueos que tienes planeado inscribir. Periodicamente se actualizaran los cupos de las materias preinscritas, si alguna se queda sin cupos la alternativa entrarà en conflicto',
      remove: 'Para eliminar una materia de una alterativa, oprime el botón "x" que aparece en la esquina superior de la materia y esta será removida de la alternativa.',
      conflicts: 'Jplanner te notificara si tienes materias en conflicto, es decir si se cruzan sus horarios, antes de inscribir materias debes resolver esos conflictos',
      enroll:'Cuando tu cita de inscripción este habilitado, podrás ver en la sección de inscripción las materias de la alternativa actual, podrás remover las que no desees. Cuando estés listo presiona el botón de inscribir y el sistema intentara inscribir dicha alternativa en tu horario universitario.',
    },
    desktop : {
      search:'Para buscar materias, utiliza el buscador de la aplicación, puedes utilizar el filtro básico o el avanzado, llenar los criterios de búsqueda deseados y una lista de materias que cumplan tus criterios será desplegada',
      moreInfo:'Una vez tengas la lista de materias, se mostrará una lista con los diferentes horarios ofrecidos en dicha materia, para obtener más información de esta, presiona sobre ella y podrás ver todos los datos.',
      plan:'En JPlanner puedes crear hasta 6 alternativas de horarios, estas están ubicadas en la parte superior, puedes cambiar el nombre de la alternativa y puedes navegar entre alternativas presionando los botones respectivos. Para inscribir una materia oprime el botón "+" en la materia que deseas inscribir o arrástrala hacia el horario, esta se inscribirá en la alternativa que tienes seleccionada',    
      block:'Puedes crear bloqueos en los cuales no quieras inscribir materias, para hacerlo clickea y arrastra en el horario cubriendo las horas en las que quieres tener el bloqueo. Cuando busques materias no aparecerán las que se crucen con los bloqueados creados. Puedes editar o eliminar un bloqueo, marca la casilla que indica si quieres modificar todos los bloqueos de ese tipo o solo el seleccionado',
      horaries: 'Para ver tus diferentes tentativas de horario,navegaa por tus diferentes alternativas de horario viendo las materias y bloqueos que tienes planeado inscribir. Periodicamente se actualizaran los cupos de las materias preinscritas, si alguna se queda sin cupos la alternativa entrarà en conflicto',
      remove: 'Para eliminar una materia de una alterativa, oprime el botón "x" que aparece en la esquina superior de la materia y esta será removida de la alternativa.',
      conflicts: 'Jplanner te notificara si tienes materias en conflicto, es decir si se cruzan sus horarios, antes de inscribir materias debes resolver esos conflictos',
      enroll:'Cuando tu cita de inscripción este habilitado, podrás ver en la sección de inscripción las materias de la alternativa actual, podrás remover las que no desees. Cuando estés listo presiona el botón de inscribir y el sistema intentara inscribir dicha alternativa en tu horario universitario.',
    },
    tablet : {
      search:'Para buscar materias, utiliza el buscador de la aplicación, puedes utilizar el filtro básico o el avanzado, llenar los criterios de búsqueda deseados y una lista de materias que cumplan tus criterios será desplegada',
      moreInfo:'Una vez tengas la lista de materias, se mostrará una lista con los diferentes horarios ofrecidos en dicha materia, para obtener más información de esta, presiona sobre ella y podrás ver todos los datos.',
      plan:'En JPlanner puedes crear hasta 6 alternativas de horarios, estas están ubicadas en la parte superior, puedes cambiar el nombre de la alternativa y puedes navegar entre alternativas presionando los botones respectivos. Para inscribir una materia oprime el botón "+" en la materia que deseas inscribir o arrástrala hacia el horario, esta se inscribirá en la alternativa que tienes seleccionada',    
      block:'Puedes crear bloqueos en los cuales no quieras inscribir materias, para hacerlo clickea y arrastra en el horario cubriendo las horas en las que quieres tener el bloqueo. Cuando busques materias no aparecerán las que se crucen con los bloqueados creados. Puedes editar o eliminar un bloqueo, marca la casilla que indica si quieres modificar todos los bloqueos de ese tipo o solo el seleccionado',
      horaries: 'Para ver tus diferentes tentativas de horario,navegaa por tus diferentes alternativas de horario viendo las materias y bloqueos que tienes planeado inscribir. Periodicamente se actualizaran los cupos de las materias preinscritas, si alguna se queda sin cupos la alternativa entrarà en conflicto',
      remove: 'Para eliminar una materia de una alterativa, oprime el botón "x" que aparece en la esquina superior de la materia y esta será removida de la alternativa.',
      conflicts: 'Jplanner te notificara si tienes materias en conflicto, es decir si se cruzan sus horarios, antes de inscribir materias debes resolver esos conflictos',
      enroll:'Cuando tu cita de inscripción este habilitado, podrás ver en la sección de inscripción las materias de la alternativa actual, podrás remover las que no desees. Cuando estés listo presiona el botón de inscribir y el sistema intentara inscribir dicha alternativa en tu horario universitario.',
    }
  }
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
      if (window.screen.width <= 768) {
      this.device = 'mobile';
    } 
    else if(window.screen.width >= 768 && window.screen.width <= 1024){
      this.device = 'tablet';
    }
    else if(window.screen.width>= 1025){
      this.device = 'desktop';
    }
    this.imageUrls = [
      { url: 'assets/start-guide/images/'+this.device+'_search.PNG',
      caption: this.descriptions[this.device]["search"],
      backgroundSize: 'contain', backgroundPosition: 'center', 
      
      },
      
      { url: 'assets/start-guide/images/'+this.device+'_moreInfo.PNG',
      caption: this.descriptions[this.device]["moreInfo"],
      backgroundSize: 'contain', backgroundPosition: 'center'      
      }, 
      { url: 'assets/start-guide/images/'+this.device+'_plan.PNG',
      caption: this.descriptions[this.device]["plan"],
      backgroundSize: 'contain', backgroundPosition: 'center'      
      }, 
      { url: 'assets/start-guide/images/'+this.device+'_block.PNG',
      caption: this.descriptions[this.device]["block"],
      backgroundSize: 'contain', backgroundPosition: 'center',
      },
      { url: 'assets/start-guide/images/'+this.device+'_horaries.PNG',
      caption: this.descriptions[this.device]["horaries"],
      backgroundSize: 'contain', backgroundPosition: 'center',
      },
      { url: 'assets/start-guide/images/'+this.device+'_remove.PNG',
      caption: this.descriptions[this.device]["remove"],
      backgroundSize: 'contain', backgroundPosition: 'center',
      },
      { url: 'assets/start-guide/images/'+this.device+'_conflicts.PNG',
      caption: this.descriptions[this.device]["conflicts"],
      backgroundSize: 'contain', backgroundPosition: 'center',
      },
      { url: 'assets/start-guide/images/'+this.device+'_enroll.PNG',
      caption: this.descriptions[this.device]["enroll"],
      backgroundSize: 'contain', backgroundPosition: 'center'
      },
    ];
  }

  private changeSlide(index: number) {
    this.slides.goToSlide(index);
  }

  private nextPrevSlide(index: number) {
    this.slides.onSlide(index);
  }
}
