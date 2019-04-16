import { Component, OnInit, HostListener } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';

@Component({
  selector: 'app-use-guide',
  templateUrl: './use-guide.component.html'
})
export class UseGuideComponent implements OnInit {
  imageUrls: (string | IImage)[];
  height: string = '70vh';
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = false;
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  width: string = '100%';

  device;

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
  descriptions = {
    mobile : {
      search:'mobi',
      plan:'',
      block:'',
      enroll:'',
    },
    desktop : {
      search:'desti',
      plan:'',
      block:'',
      enroll:'',        
    },
    tablet : {
      search:'tabli',
      plan:'',
      block:'',
      enroll:'',          
    }
  }
  constructor() { }

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
      { url: 'assets/start-guide/images/'+this.device+'_search.jpg',
      caption: this.descriptions[this.device]["search"],
      backgroundSize: 'contain', backgroundPosition: 'center', 
      
      },
      { url: 'assets/start-guide/images/'+this.device+'_plan.jpg',
      caption: this.descriptions[this.device]["plan"],
      backgroundSize: 'contain', backgroundPosition: 'center'      
      }, 
      { url: 'assets/start-guide/images/'+this.device+'_block.jpg',
      caption: this.descriptions[this.device]["block"],
      backgroundSize: 'contain', backgroundPosition: 'center',
      },
      { url: 'assets/start-guide/images/'+this.device+'_enroll.jpg',
      caption: this.descriptions[this.device]["enroll"],
      backgroundSize: 'contain', backgroundPosition: 'center'
      },
    ];
  }

}
