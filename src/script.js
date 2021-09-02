import './style.css'
import * as THREE from 'three';
import { ProgressBar, Layout, Tile, Navigation } from './js';
import fragmentShader from './shaders/fragment.glsl';
import fragmentShaderBis from './shaders/fragmentBis.glsl';
import fragmentShaderTer from './shaders/gooeyShader.glsl';
// import gsap from 'gsap';

// import fragmentShader from './shaders/fragment.glsl';
// import gooeyShader from './shaders/gooeyShader.glsl';
// import revealShader from './shaders/revealShader.glsl';

const imagesToDisplay = document.querySelectorAll('img');
imagesToDisplay.forEach((image, index) => {
  image.src = `images/px${index + 1}.jpeg`;
});

const shaders = [
  fragmentShaderBis,
  fragmentShaderBis,
  fragmentShaderBis,
  fragmentShaderBis,
];

const perspective = 800;

export default class Scene {
    constructor() {


      this.$tiles = document.querySelectorAll('.slide');

      this.clock = new THREE.Clock();

      this.pageDisplayed = true;

      this.scroll = 0;



      this.init();
      this.initLight();
      
      // this.update();

      window.addEventListener('resize', event => {
          //update Camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //update Render
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio));

      });

      window.addEventListener('scroll', event => {
        // console.log(event.path[1].scrollX);
        this.scroll = event.path[1].scrollX;
        // console.log(window.scrollX);
      })

      window.addEventListener('mousemove', event => {
        // console.log(event)
      })
     
    }

   


    init() {


        this.scene = new THREE.Scene();

        const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;

        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, perspective);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.tiles = Array.from(this.$tiles).map((tile, index) => {
          new Tile(this.scene, tile, shaders[index], new Layout().isMobile, )
        });

        this.update();
    }

    initLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambientLight);
    }

   

    update() {
      requestAnimationFrame(this.update.bind(this));
      this.renderer.render(this.scene, this.camera);
    }

    openPageContent() {
      this.pageDisplayed = true;
    }

}


window.onload = () => {
  new Scene(imagesToDisplay);
  new ProgressBar(new Layout().isMobile);
  new Navigation();
};


