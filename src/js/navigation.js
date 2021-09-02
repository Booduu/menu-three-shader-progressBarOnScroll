export default class Navigation {
    constructor() {
        this.navStick = document.querySelectorAll(".navigation ul li");
        this.tiles = document.querySelectorAll(".tile");
        this.init();
    }

    init() {
        console.log('okoko')
        Array.from(this.navStick).map((stick, index) => {
            stick.addEventListener('click', event => {

                const cueMarkLeft = this.tiles[0].offsetLeft;
                window.scrollTo(this.tiles[index].offsetLeft - cueMarkLeft, 0);
            })
        })
    }

}