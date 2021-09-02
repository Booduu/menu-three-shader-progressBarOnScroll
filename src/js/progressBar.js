export default class ProgressBar {
    constructor(isMobile) {

        this.isMobile = isMobile;

        this.progressBar = document.querySelector('.progress_bar');
        this.container = document.querySelector('.wrapper');
        this.body = document.querySelector('.body');

        this.containerWidth =  this.container.getBoundingClientRect().width - window.innerWidth;
        this.percentScrollX = 0;

        this.containerHeight =  this.container.getBoundingClientRect().height - window.innerHeight;
        this.percentScrollY = 0;


        window.addEventListener('scroll', event =>  this.calculateScroll(event));
        window.addEventListener('touchmove', (event) => this.calculateScroll(event));

        
    }

    calculateScroll(event) {

        if (!this.isMobile) {
            this.percentScrollX = event.path[1].scrollX * 100 / this.containerWidth;
            this.progressBar.style.width = `${this.percentScrollX}%`;
        } else {
            this.percentScrollY = event.path[1].scrollY * 100 / this.containerHeight;
            this.progressBar.style.width = `${this.percentScrollY}%`;

        }
    }
}


// 50/80 = x/100
//distance parcouru / containerWidth = pourcentage / 100
// distance parcouru * 100 / containerWidth = pourcentage
