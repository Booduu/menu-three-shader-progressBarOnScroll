
uniform float u_time;
uniform float progress;
uniform sampler2D u_image;
uniform sampler2D u_hoverImage;
uniform vec3 u_mouse;
uniform float u_wheel;

varying vec2 v_uv;
// varying vec2 vPosition;




void main()	{

	vec4 displace = texture2D(u_hoverImage, v_uv.yx);
	// vec2 displacedUv = vec2(
	// 	v_uv.x + progress * 0.1 * sin(v_uv.y * 19. + time/4.), 
	// 	v_uv.y);
	// vec2 displacedUv = vec2(
	// 	v_uv.x + displace.r * progress, 
	// 	v_uv.y);
	vec2 displacedUv = vec2(
		v_uv.x, 
		v_uv.y
	);

	displacedUv.y = mix(v_uv.y + abs(u_wheel), displace.r, progress);
	displacedUv.x = mix(v_uv.x + abs(u_wheel), displace.r, progress / 2.0);


	vec4 color = texture2D(u_image, displacedUv);
	color.r = texture2D(u_image, displacedUv + vec2(0.0, 0.005) * progress).r;
	color.g = texture2D(u_image, displacedUv + vec2(0.0, 0.003) * progress).g;
	color.b = texture2D(u_image, displacedUv + vec2(0.0, 0.003) * progress).b;


	gl_FragColor = color;
}