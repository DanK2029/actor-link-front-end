import React, { Component } from 'react';
import * as THREE from 'three';
import './LinkVisualizer.css';

var linkData = [
  {
    type: "ACTOR",
    name: "ACTOR 1"
  },
  {
    type: "MOVIE",
    name: "MOVIE 1"
  },
  {
    type: "ACTOR",
    name: "ACTOR 2"
  },
  {
    type: "MOVIE",
    name: "MOVIE 2"
  },
  {
    type: "ACTOR",
    name: "ACTOR 3"
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

    this.mouse = new THREE.Vector3();
    orgContainer.addEventListener('mousemove', (event) => {
      let canvasBounds = orgContainer.getBoundingClientRect();
      this.mouse.x = 2 * this.aspectRatio * (((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) - 0.5);
      this.mouse.y = -2 * (((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) - 0.5);
    });
    
    this.mousePullRange = 0.3;
    this.mousePullStrength = 0.25;

    this.mount.appendChild(this.renderer.domElement);
    
    this.createLink(linkData);

    var animate = () => {
      requestAnimationFrame( animate );
      this.updateScene();
      this.renderer.render( this.scene, this.camera );
    };

    animate();
  }

  applyMouseForce(node) {
    let mouseDist = this.mouse.distanceTo(node.userData.origPos);
    let nodeTravelDist = node.position.distanceTo(node.userData.origPos);

    if (mouseDist < this.mousePullRange && nodeTravelDist < this.mousePullRange) {
      let pullStrength = Math.pow(this.mousePullRange - mouseDist, 2);
      node.position.lerp(this.mouse, pullStrength);
    } else {
      node.position.lerp(node.userData.origPos, 0.1);
    }
  }

  updateScene() {
    for (let index = 0; index < linkData.length; index++) {
      let node = this.scene.getObjectByName(`node-${index}`);
      this.applyMouseForce(node);
    }

    for (let index = 1; index < linkData.length; index++) {
      let line = this.scene.getObjectByName(`line-${index-1}:${index}`);
      let prevNode = this.scene.getObjectByName(`node-${index-1}`);
      let node = this.scene.getObjectByName(`node-${index}`);
        
      line.geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(prevNode.position.x, prevNode.position.y, 0.5),
        new THREE.Vector3(node.position.x,     node.position.y,     0.5),
      ]);
    }
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

    let prevNode = undefined;
    for (let index = 0; index < linkData.length; index++) {
      let node = this.scene.getObjectByName(`node-${index}`);

      node.position.x = this.aspectRatio * node.position.x / this.prevAspectRatio;
      node.userData.origPos.x = node.position.x;

      node.scale.set(colWidth/4, colWidth/4, 1);

      this.applyMouseForce(node);
      
      if (prevNode !== undefined) {
        let line = this.scene.getObjectByName(`line-${index-1}:${index}`);
        
        line.geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(prevNode.position.x, prevNode.position.y, 0.5),
          new THREE.Vector3(node.position.x,     node.position.y,     0.5),
        ]);
      }

      prevNode = node;
    }
  }

  createLink(link) {
    const colWidth = 2 * this.aspectRatio / link.length;

    let prevCirclePos = undefined;
    link.forEach((node, index) => {
      var circle = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64), 
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
      );

      circle.scale.set(colWidth/4, colWidth/4, 1);
      circle.name = `node-${index}`;

      const x = colWidth * index + colWidth/2 - this.aspectRatio; 
      const offsetX = this.randRange(-colWidth/8, colWidth/8);
      const offsetY = this.randRange(-colWidth/4, colWidth/4);

      circle.position.set(x + offsetX, offsetY, 0);
      circle.userData.origPos = new THREE.Vector3(x + offsetX, offsetY, 0);
      this.scene.add(circle);

      if (prevCirclePos !== undefined) {
        let line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(prevCirclePos.x, prevCirclePos.y, 0.5), 
            new THREE.Vector3(x + offsetX, offsetY, 0.5)
          ]),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 50,
          })
        );

        line.name = `line-${index-1}:${index}`;

        this.scene.add(line);
      }

      prevCirclePos = new THREE.Vector3(x + offsetX, offsetY, 0);
    });

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div id="link-visualizer-container" ref={ref => (this.mount = ref)}/>
    );
  }
}

export default LinkVisualizer;