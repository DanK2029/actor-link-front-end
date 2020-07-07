import React, { Component } from 'react';
import * as THREE from 'three';
import MeshLine, { MeshLineMaterial } from 'three.meshline';
import './LinkVisualizer.css';

var linkData = [
  {
    type: "ACTOR",
    name: "ACTOR 1",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
  {
    type: "MOVIE",
    name: "MOVIE 1",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
  {
    type: "ACTOR",
    name: "ACTOR 2",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
  {
    type: "MOVIE",
    name: "MOVIE 2",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
  {
    type: "ACTOR",
    name: "ACTOR 3",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
];

class LinkVisualizer extends Component {
  randRange(min, max) { return (Math.random() * (max-min)) + min; }

  componentDidMount() {
    this.scene = new THREE.Scene();
    let orgContainer = document.getElementById('link-visualizer-container');

    this.aspectRatio = orgContainer.offsetWidth / orgContainer.offsetHeight;
    this.camera = new THREE.OrthographicCamera(-this.aspectRatio, this.aspectRatio, 1, -1, 1, -1);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(orgContainer.offsetWidth, orgContainer.offsetHeight);
    
    window.addEventListener('resize', () => {
      this.resizeCamera();
      this.resizeLink();
    });


    this.mousePullStrength = 0.5;
    this.mouse = new THREE.Vector3();
    this.mouseSet = false;
    orgContainer.addEventListener('mousemove', (event) => {
      this.mouseSet = true;
      let canvasBounds = orgContainer.getBoundingClientRect();
      this.mouse.x = 2 * this.aspectRatio * (((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) - 0.5);
      this.mouse.y = -2 * (((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) - 0.5);
    });

    this.mount.appendChild(this.renderer.domElement);
    
    this.createLink(linkData);

    var animate = () => {
      requestAnimationFrame( animate );
      this.updateScene();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  applyMouseForce(node) {
    if (!this.mouseSet) return;

    let mouseDist = this.mouse.distanceTo(node.userData.origPos);
    let nodeTravelDist = node.position.distanceTo(node.userData.origPos);

    if (mouseDist < this.mousePullRange && nodeTravelDist < this.mousePullRange) {
      let pullStrength = Math.pow(this.mousePullRange - mouseDist, 2);
      node.position.lerp(this.mouse, pullStrength);
    } else {
      node.position.lerp(node.userData.origPos, 0.1);
    }
  }

  createCurve(controlPoints) {
    let curvePoints = new THREE.CatmullRomCurve3(controlPoints)
      .getPoints(linkData.length * 32)
      .map((point) => {return [point.x, point.y, point.z]})
      .flat();

    let meshLine = new MeshLine.MeshLine();
    meshLine.setGeometry(curvePoints);
    let size = new THREE.Vector2();
    this.renderer.getSize(size)
    let lineMaterial = new MeshLineMaterial({
      color: new THREE.Color(1, 1, 1),
      resolution: size,
      lineWidth: 0.01
    });

    let curve = new THREE.Mesh(meshLine.geometry, lineMaterial);
    curve.name = 'curve';

    return curve;
  }

  updateScene() {
    let curveControlPoints = linkData.map((_, index) => {
      let node = this.scene.getObjectByName(`node-${index}`);
      this.applyMouseForce(node);
      return node.position;
    });
    
    let curve = this.scene.getObjectByName('curve');
    this.scene.remove(curve);
    this.scene.add(this.createCurve(curveControlPoints));
    
  }

  resizeCamera() {
    let container = document.getElementById('link-visualizer-container');

    this.prevAspectRatio = this.aspectRatio;
    this.aspectRatio = container.offsetWidth / container.offsetHeight;

    this.renderer.setSize(container.offsetWidth, container.offsetHeight);

    this.camera.right = this.aspectRatio;
    this.camera.left = -this.aspectRatio;

    this.camera.updateProjectionMatrix();
  }

  resizeLink() {
    const colWidth = 2 * this.aspectRatio / linkData.length;
    this.mousePullRange = colWidth / 2;


    linkData.forEach((node, index) => {
      let circle = this.scene.getObjectByName(`node-${index}`);

      circle.position.x = this.aspectRatio * circle.position.x / this.prevAspectRatio;
      circle.userData.origPos.x = circle.position.x;

      circle.scale.set(colWidth/4, colWidth/4, 1);

      this.applyMouseForce(circle);
    })
  }

  createLink(link) {
    const colWidth = 2 * this.aspectRatio / link.length;
    this.mousePullRange = colWidth / 2;

    let loader = new THREE.TextureLoader();

    link.forEach((node, index) => {
      var circle = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64), 
        new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          map: loader.load(node.imageURL)
        })
      );
      
      circle.scale.set(colWidth/4, colWidth/4, 1);
      circle.name = `node-${index}`;

      const x = colWidth * index + colWidth/2 - this.aspectRatio; 
      const offsetX = this.randRange(-colWidth/8, colWidth/8);
      const offsetY = this.randRange(0.33, -0.33);

      circle.position.set(x + offsetX, offsetY, 0);
      circle.userData.origPos = new THREE.Vector3(x + offsetX, offsetY, 0);
      this.scene.add(circle);
    });

    let curveControlPoints = this.scene.children.map((obj) => {
      return new THREE.Vector3(obj.position.x, obj.position.y, 0.5);
    });

    let curve = this.createCurve(curveControlPoints);
    this.scene.add(curve);

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div id="link-visualizer-container" ref={ref => (this.mount = ref)}/>
    );
  }
}

export default LinkVisualizer;