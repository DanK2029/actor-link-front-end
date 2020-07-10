import React, { Component } from 'react';
import * as THREE from 'three';

import MeshLine, { MeshLineMaterial } from 'three.meshline';
import './LinkVisualizer.css';

import { colors } from './Colors.js';

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
  {
    type: "ACTOR",
    name: "ACTOR 3",
    imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
  },
];

class LinkVisualizer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      linkData: props.linkData,
    }
  }

  randRange(min, max) { return (Math.random() * (max-min)) + min; }

  clearScene() {
    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.linkData !== this.props.linkData) {
      this.clearScene();
      if (this.props.linkData.length >= 0) {
        this.colWidth = 2 * this.aspectRatio / this.props.linkData.length;
        this.circleRadius = this.colWidth / 4;
        this.circleXOffsetRange = this.colWidth / 8;
        this.curveWidth = this.colWidth / 32;
  
        this.createLink(this.props.linkData);
      }
    }
  }

  setSelectedNode = (selectedNode) => {
    this.props.setSelectedNode(selectedNode);
  }

  componentDidMount() {
    this.scene = new THREE.Scene();
    this.container = document.getElementById('link-visualizer-container');

    this.aspectRatio = this.container.offsetWidth / this.container.offsetHeight;
    this.camera = new THREE.OrthographicCamera(-this.aspectRatio, this.aspectRatio, 1, -1, 1, -1);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.setClearColor(0x2d3436);

    this.curveColor = colors[Math.floor(this.randRange(0, colors.length-1))];
    this.circleYOffsetRange = 0.33;
    
    window.addEventListener('resize', () => {
      this.resizeCamera();
      this.resizeLink();
    });

    this.mouse = new THREE.Vector3();
    this.mouseSet = false;
    
    this.container.addEventListener('mousemove', (event) => {
      this.mouseSet = true;
      let canvasBounds = this.container.getBoundingClientRect();
      this.mouse.x =  2 * this.aspectRatio * (((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) - 0.5);
      this.mouse.y = -2 * (((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) - 0.5);
    });

    this.container.addEventListener('mouseleave', (event) => {
      this.mouse.x = Infinity;
      this.mouse.x = Infinity;
    })

    this.container.addEventListener('click', (event) => {
      this.props.linkData.some((node, index) => {
        const circle = this.scene.getObjectByName(`node-${index}`);
        const dist = circle.position.distanceTo(this.mouse);
        const foundClicked = dist <= this.circleRadius;
        if (foundClicked) {
          this.setSelectedNode(this.props.linkData[index]);
        }
        return foundClicked;
      })
    });

    this.mount.appendChild(this.renderer.domElement);

    var animate = () => {
      requestAnimationFrame( animate );
      this.props.linkData.length !== 0 && this.updateScene();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  applyMouseForce(node) {
    if (!this.mouseSet) return;

    const mouseDist = this.mouse.distanceTo(node.userData.origPos);
    const nodeTravelDist = node.position.distanceTo(node.userData.origPos);

    if (mouseDist < this.mousePullRange && nodeTravelDist < this.mousePullRange) {
      const pullStrength = Math.pow(this.mousePullRange - mouseDist, 2);
      node.position.lerp(this.mouse, pullStrength);
    } else {
      node.position.lerp(node.userData.origPos, 0.1);
    }
  }

  createCurve(controlPoints) {
    let curvePoints = new THREE.CatmullRomCurve3(controlPoints)
      .getPoints(this.props.linkData.length * 32)
      .map((point) => { return [point.x, point.y, point.z] })
      .flat();

    let meshLine = new MeshLine.MeshLine();
    meshLine.setGeometry(curvePoints);
    
    let size = new THREE.Vector2();
    this.renderer.getSize(size)
    let lineMaterial = new MeshLineMaterial({
      color: this.curveColor,
      lineWidth: this.curveWidth
    });

    const curve = new THREE.Mesh(meshLine.geometry, lineMaterial);
    curve.name = 'curve';

    return curve;
  }

  updateScene() {
    let curveControlPoints = this.props.linkData.map((_, index) => {
      let node = this.scene.getObjectByName(`node-${index}`);
      this.applyMouseForce(node);
      return node.position;
    });
    
    const curve = this.scene.getObjectByName('curve');
    this.scene.remove(curve);
    this.scene.add(this.createCurve(curveControlPoints));
  }

  resizeCamera() {
    let container = document.getElementById('link-visualizer-container');

    this.prevAspectRatio = this.aspectRatio;
    this.aspectRatio = container.offsetWidth / container.offsetHeight;
    this.colWidth = 2 * this.aspectRatio / this.props.linkData.length;
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);

    this.camera.right = this.aspectRatio;
    this.camera.left = -this.aspectRatio;

    this.camera.updateProjectionMatrix();
  }

  resizeLink() {
    this.mousePullRange = this.colWidth / 8;
    this.circleRadius = this.colWidth / 4;
    this.circleXOffsetRange = this.colWidth / 8;
    this.curveWidth = this.colWidth / 32;

    this.props.linkData.forEach((node, index) => {
      let circle = this.scene.getObjectByName(`node-${index}`);

      circle.position.x = this.aspectRatio * circle.position.x / this.prevAspectRatio;
      circle.userData.origPos.x = circle.position.x;

      circle.scale.set(this.circleRadius, this.circleRadius, 1);

      this.applyMouseForce(circle);
    });
  }

  createLink(link) {
    this.mousePullRange = this.colWidth / 2;

    const loader = new THREE.TextureLoader();

    link.forEach((node, index) => {
      let circle = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64), 
        new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          map: loader.load(node.imageURL)
        })
      );
      circle.scale.set(this.circleRadius, this.circleRadius, 1);

      let outerCircle = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64), 
        new THREE.MeshBasicMaterial({ 
          color: this.curveColor,
        })
      )
      const outerCircleRadius = (this.circleRadius + this.curveWidth) / this.circleRadius;
      outerCircle.scale.set(outerCircleRadius, outerCircleRadius, 1);
      outerCircle.position.z = 0.1;
      circle.add(outerCircle);
      
      circle.name = `node-${index}`;

      const x = (this.colWidth * index + this.colWidth / 2) - this.aspectRatio;
      const offsetX = this.randRange(-this.circleXOffsetRange, this.circleXOffsetRange);
      const offsetY = this.randRange(-this.circleYOffsetRange, this.circleYOffsetRange);
      circle.position.set(x + offsetX, offsetY, 0);
      
      circle.userData.origPos = new THREE.Vector3(x + offsetX, offsetY, 0);
      this.scene.add(circle);
    });

    let curveControlPoints = this.scene.children.map((obj) => {
      return new THREE.Vector3(obj.position.x, obj.position.y, 0);
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