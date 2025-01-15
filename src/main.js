import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import gsap from "gsap";
const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const starTexture = loader.load("/stars.jpg");
starTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = starTexture;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 16;

camera.position.y = -26;
camera.position.x = -0.01;

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: "high-performance",
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const group = new THREE.Group();

const rgbeLoader = new RGBELoader();

rgbeLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/qwantani_sunset_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

const textureLoader = new THREE.TextureLoader();
textureLoader.colorSpace = THREE.SRGBColorSpace;

const spheres = [];

const textures = [
  "/csilla/color.webp",
  "/volcanic/color.webp",
  "/venus/map.webp",
  "/earth/map.webp",
];
for (let i = 0; i < 4; i++) {
  const texture = textureLoader.load(textures[i]);
  const geometry = new THREE.SphereGeometry(6, 82, 56);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });

  const sphere = new THREE.Mesh(geometry, material);
  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = Math.cos(angle) * 20;
  sphere.position.y = Math.sin(angle) * 20;

  group.add(sphere);
  spheres.push(sphere);
}
group.position.y = -0.5;

group.rotation.x = -0.3;

scene.add(group);

const controls = new OrbitControls(camera);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("wheel", throttledWheelHandler);

let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;

function throttledWheelHandler(event) {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    lastWheelTime = currentTime;
    scrollCount = (scrollCount + 1) % 4;
    const headings = document.querySelectorAll(".headings");

    gsap.to(headings, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power2.inOut",
    });

    gsap.to(group.rotation, {
      duration: 1.5,
      z: `+=${Math.PI / 2}%`,
      ease: "back.inOut",
    });

    if (scrollCount === 0) {
      gsap.to(headings, {
        duration: 1,
        y: "0",
        ease: "power2.inOut",
      });
    }
  }
}

spheres.forEach((sphere) => {
  sphere.material.transparent = true;
  sphere.material.opacity = 0;
});

spheres.forEach((sphere, index) => {
  gsap.to(sphere.material, {
    opacity: 1,
    duration: 2,
    ease: "power2.inOut",
    delay: Math.random() * 1.5,
  });
});
gsap.from(".headings-container", {
  y: 100,
  opacity: 0,
  duration: 1,
  ease: "power2.inOut",
  delay: 1,
});

gsap.from(".para p", {
  y: 100,
  opacity: 0,
  duration: 1,
  ease: "power2.inOut",
  delay: 1,
});
gsap.from(".line", {
  opacity: 0,
  scale: 0,
  duration: 1,
  ease: "power2.inOut",
  delay: 1,
});
gsap.from("nav h1 , nav a", {
  y: -100,
  opacity: 0,
  duration: 2,
  ease: "power2.inOut",
  stagger: 0.5,
});
window.onload = () => {
  setTimeout(() => {
    gsap.to(".loader", {
      duration: 1.5,
      scale: 0,
      ease: "power2.inOut",
    });
  }, 18000);
};

function animate() {
  renderer.render(scene, camera);
  spheres.forEach((e) => {
    e.rotation.z += 0.0004;
  });
  requestAnimationFrame(animate);
}

animate();
