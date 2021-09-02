import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl';
import { TweenMax as TM, Power2, Power3, Expo, Quad } from 'gsap/all';
import gsap from 'gsap';
import * as dat from 'dat.gui';

const gui = new dat.GUI();


export default class Tile {
    constructor(scene, $el, fragmentShader, isMobile) {
        this.isMobile = isMobile;

        this.els = {
            el: $el,
            link: $el.querySelector('a'),
            img: $el.querySelector('img'),
            data_src: $el.querySelector('img').dataset.src,
            data_hover: $el.querySelector('img').dataset.hover,  
        }

        this.tileContainer = $el.querySelector('.tile');
        this.text = $el.querySelector('h1');
        this.$image = $el.querySelector('img');
        this.scene = scene;
        this.loader = new THREE.TextureLoader();
        this.mainImage = this.loader.load(this.$image.dataset.src);
        this.hoverImage = this.loader.load(this.$image.dataset.hover);

        this.sizes = new THREE.Vector2(0, 0);
        this.offset = new THREE.Vector2(0, 0);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);

        this.uniforms = {
            u_image: { type: "t", value: this.mainImage },
            u_hoverImage: { type: "t", value: this.hoverImage },
            u_mouse: { value: this.mouse },
            progress: { type: "f", value: 0 },
            u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_time: { value: this.clock.getElapsedTime() },
            u_onHover : { value: false },
            u_alpha: { value: 1 },
            u_wheel: { value: 0 },

        };

        this.fragmentShader = fragmentShader;




        this.init();
        // this.getSizes();
        this.createMesh();

        window.addEventListener('resize', event => {
            this.uniforms.u_res = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) };

            this.getSizes();
            this.setPositionAndScale();
        });
        window.addEventListener('scroll', event => {
            
            
            this.uniforms.u_res = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) };

            this.getSizes();
            this.setPositionAndScale();
        });
        window.addEventListener('mousemove', event => { 
            this.onMouseMove(event); 
        });

        this.tileContainer.addEventListener('click', event => {
            event.preventDefault();
            const { left } = this.tileContainer.getBoundingClientRect();
            const body = document.body.getBoundingClientRect();

            const offset  = left - body.left - 102.75 ;
        })

        this.tileContainer.addEventListener('mouseenter', event => { this.onPointerEnter(event) });
        this.tileContainer.addEventListener('mouseleave', event => { this.onPointerLeave(event) });
       
        gui.add(this.uniforms.progress, 'value').min(0).max(0.2).step(0.01).name('progress');

    }

   


    init() {
        this.createTitle();
        this.getSizes();
    }

    createTitle() {
        const div = document.createElement('div');
        div.classList.add('text-menu');

        div.textContent = this.text.innerText;
        this.tileContainer.append(div);
        const $imagePosition = this.$image.getBoundingClientRect();

        const propertyToSet = this.isMobile ? 20 : $imagePosition.y;

        // div.style.setProperty('top', $imagePosition.y + 'px');
        div.style.setProperty('top', propertyToSet + 'px');
        // div.style.setProperty('text-align', 'center');

        this.text.style.display = "none";
    }

    onPointerEnter(event) {


        const tile = this.tileContainer.querySelector('.text-menu');
        tile.classList.add('text-menu-animation-hover');

        TM.to(this.uniforms.progress, 0.5, {
            value: 0.1,
            ease:Power2.easeIn,
        });
    }

    onPointerLeave(event) {

        const tile = this.tileContainer.querySelector('.text-menu');
        tile.classList.remove('text-menu-animation-hover');
        // TM.to(tile, .7, { css: { opacity: 0.5 }, ease: Power2.easeInOut});

        TM.to(this.uniforms.progress, 0.5, {
            value: 0,
            ease:Power2.easeOut,
        });
    }

    getSizes() {
        const { width, height, top, left } = this.$image.getBoundingClientRect();

		this.sizes.set(width, height);
		this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);

    }

    setPositionAndScale() {
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    }

    createMesh() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader:  this.fragmentShader,
            defines: {
                PR: window.devicePixelRatio.toFixed(1)
           }

        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.setPositionAndScale();

        this.scene.add(this.mesh);


        // gui.add(this.mesh.position, 'y').min(- 3).max(3).step(0.01)
    }

    updateWithFrame() {
        console.log(this.clock.getDelta());
        // this.uniforms.u_time.value += this.clock.getDelta();
    }

    onMouseMove(event) {

        TM.to(this.mouse, 0.5, {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
 
    }
}