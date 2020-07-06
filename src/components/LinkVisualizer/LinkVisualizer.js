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
      let container = document.getElementById('link-visualizer-container');
      this.prevAspectRatio = this.aspectRatio;
      this.aspectRatio = container.offsetWidth / container.offsetHeight;
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      this.updateScene();
    });
    

    this.mount.appendChild(this.renderer.domElement);
    
    this.createLink(linkData);

    var animate = () => {
      requestAnimationFrame( animate );
      this.renderer.render( this.scene, this.camera );
    };
    animate();
  }

  updateScene() {
    this.camera.right = this.aspectRatio;
    this.camera.left = -this.aspectRatio;
    this.camera.updateProjectionMatrix();
    
    this.updateLink();
  }

  updateLink() {
    const colWidth = 2 * this.aspectRatio / linkData.length;

    let prevNode = undefined;
    for (let index = 0; index < linkData.length; index++) {
      let node = this.scene.getObjectByName(`node-${index}`);
      node.position.x = this.aspectRatio * node.position.x / this.prevAspectRatio;
      node.scale.set(colWidth/4, colWidth/4, 1);
      
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
      this.scene.add(circle);

      if (prevCirclePos !== undefined) {
        let line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(prevCirclePos.x, prevCirclePos.y, 0.5), 
            new THREE.Vector3(x + offsetX, offsetY, 0.5)
          ]),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 5,
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