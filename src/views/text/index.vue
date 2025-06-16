// // FluidRenderer.vue //
<script setup lang="ts">
// import * as BABYLON from '@babylonjs/core';
// import '@babylonjs/loaders';
// import '@babylonjs/gui';
// import { GUI } from 'lil-gui';

// const props = defineProps({
//   modelUrl: {
//     type: String,
//     required: true
//   },
//   particleCount: {
//     type: Number,
//     default: 6000
//   },
//   fluidColor: {
//     type: String,
//     default: '#fbdada'
//   }
// });

// const canvasRef = ref<HTMLCanvasElement | null>(null);
// const engine = ref<BABYLON.Engine | null>(null);
// const scene = ref<BABYLON.Scene | null>(null);
// const fluidRenderer = ref<BABYLON.FluidRenderer | null>(null);
// const fluidRenderObject = ref<any>(null);
// const fluidSim = ref<any>(null);
// const particleGenerator = ref<any>(null);
// const gui = ref<GUI | null>(null);

// const initScene = async () => {
//   if (!canvasRef.value) return;

//   // 初始化引擎和场景
//   engine.value = new BABYLON.Engine(canvasRef.value, true);
//   scene.value = new BABYLON.Scene(engine.value);

//   // 设置环境光
//   const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene.value);
//   light.intensity = 0.7;

//   // 添加相机
//   const camera = new BABYLON.ArcRotateCamera(
//     "ArcRotateCamera",
//     3.06, 1.14, 2.96,
//     new BABYLON.Vector3(0, 0, 0),
//     scene.value
//   );
//   camera.fov = (60 * Math.PI) / 180;
//   camera.attachControl(canvasRef.value, true);
//   camera.minZ = 0.1;
//   camera.maxZ = 1000;
//   camera.wheelPrecision = 50;
//   scene.value.activeCamera = camera;

//   // 加载GLB模型
//   await loadModel(props.modelUrl);

//   // 初始化流体渲染器
//   initFluidRenderer();

//   // 初始化流体模拟
//   initFluidSimulation();

//   // 设置GUI
//   setupGUI();

//   // 开始渲染循环
//   engine.value.runRenderLoop(() => {
//     scene.value?.render();
//   });

//   // 窗口大小变化时调整引擎
//   window.addEventListener('resize', () => {
//     engine.value?.resize();
//   });
// };

// const loadModel = async (url: string) => {
//   if (!scene.value) return;

//   // 加载GLB模型
//   const result = await BABYLON.SceneLoader.ImportMeshAsync(
//     "",
//     "",
//     url,
//     scene.value
//   );

//   // 调整模型位置和大小
//   result.meshes.forEach(mesh => {
//     mesh.scaling.setAll(1);
//     mesh.position.set(0, 0, 0);
//   });

//   // 可以在这里添加碰撞体等
// };

// const initFluidRenderer = () => {
//   if (!scene.value) return;

//   // 启用流体渲染器
//   fluidRenderer.value = scene.value.enableFluidRenderer();

//   // 创建流体渲染对象
//   const camera = scene.value.activeCamera as BABYLON.ArcRotateCamera;
//   fluidRenderObject.value = fluidRenderer.value.addCustomParticles(
//     {},
//     0,
//     false,
//     undefined,
//     camera
//   );

//   // 配置流体渲染参数
//   fluidRenderObject.value.targetRenderer.enableBlurDepth = true;
//   fluidRenderObject.value.targetRenderer.blurDepthFilterSize = 20;
//   fluidRenderObject.value.targetRenderer.blurDepthNumIterations = 5;
//   fluidRenderObject.value.targetRenderer.blurDepthDepthScale = 10;
//   fluidRenderObject.value.targetRenderer.fluidColor = BABYLON.Color3.FromHexString(props.fluidColor);
//   fluidRenderObject.value.targetRenderer.density = 2.2;
//   fluidRenderObject.value.targetRenderer.refractionStrength = 0.02;
//   fluidRenderObject.value.targetRenderer.specularPower = 150;
//   fluidRenderObject.value.targetRenderer.blurThicknessFilterSize = 10;
//   fluidRenderObject.value.targetRenderer.blurThicknessNumIterations = 2;
//   fluidRenderObject.value.targetRenderer.dirLight = new BABYLON.Vector3(2, -1, 1);
// };

// const initFluidSimulation = () => {
//   if (!scene.value || !fluidRenderObject.value) return;

//   // 初始化流体模拟器
//   const particleRadius = 0.02;
//   fluidSim.value = new FluidSimulator();
//   fluidSim.value.smoothingRadius = particleRadius * 2;
//   fluidSim.value.maxVelocity = 3;

//   // 初始化粒子生成器
//   particleGenerator.value = new ParticleGenerator(scene.value);
//   particleGenerator.value.particleRadius = fluidSim.value.smoothingRadius / 2;
//   particleGenerator.value.position.y = 0.5;

//   // 设置初始粒子数据
//   fluidSim.value.setParticleData(
//     particleGenerator.value.positions,
//     particleGenerator.value.velocities
//   );

//   // 设置流体渲染对象的顶点缓冲区
//   fluidRenderObject.value.object.vertexBuffers['position'] = new BABYLON.VertexBuffer(
//     engine.value!,
//     fluidSim.value.positions,
//     BABYLON.VertexBuffer.PositionKind,
//     true,
//     false,
//     3,
//     true
//   );
//   fluidRenderObject.value.object.vertexBuffers['velocity'] = new BABYLON.VertexBuffer(
//     engine.value!,
//     fluidSim.value.velocities,
//     'velocity',
//     true,
//     false,
//     3,
//     true
//   );

//   // 添加渲染前更新模拟
//   scene.value.onBeforeRenderObservable.add(() => {
//     if (!fluidSim.value || !particleGenerator.value || !fluidRenderObject.value) return;

//     // 更新粒子数量
//     fluidSim.value.currentNumParticles = Math.min(
//       props.particleCount,
//       particleGenerator.value.currNumParticles
//     );
//     fluidRenderObject.value.object.setNumParticles(fluidSim.value.currentNumParticles);

//     // 更新模拟
//     fluidSim.value.update(1 / 100);

//     // 更新顶点数据
//     fluidRenderObject.value.object.vertexBuffers['position'].updateDirectly(
//       fluidSim.value.positions,
//       0
//     );
//     fluidRenderObject.value.object.vertexBuffers['velocity'].updateDirectly(
//       fluidSim.value.velocities,
//       0
//     );
//   });
// };

// const setupGUI = () => {
//   gui.value = new GUI({ title: 'Fluid Controls' });

//   const params = {
//     particleCount: props.particleCount,
//     fluidColor: props.fluidColor,
//     density: 2.2,
//     refractionStrength: 0.02,
//     restart: () => {
//       particleGenerator.value?.generateParticles(params.particleCount);
//     }
//   };

//   gui.value.add(params, 'particleCount', 0, 20000, 100).name('Particle Count').onChange((value) => {
//     particleGenerator.value?.generateParticles(value);
//   });

//   gui.value.addColor(params, 'fluidColor').name('Fluid Color').onChange((value) => {
//     if (fluidRenderObject.value) {
//       fluidRenderObject.value.targetRenderer.fluidColor = BABYLON.Color3.FromHexString(value);
//     }
//   });

//   gui.value.add(params, 'density', 0, 20, 0.1).name('Density').onChange((value) => {
//     if (fluidRenderObject.value) {
//       fluidRenderObject.value.targetRenderer.density = value;
//     }
//   });

//   gui.value.add(params, 'refractionStrength', 0, 0.3, 0.005).name('Refraction').onChange((value) => {
//     if (fluidRenderObject.value) {
//       fluidRenderObject.value.targetRenderer.refractionStrength = value;
//     }
//   });

//   gui.value.add(params, 'restart').name('Restart Simulation');
// };

// // 流体模拟器类
// class FluidSimulator {
//   positions: Float32Array = new Float32Array();
//   velocities: Float32Array = new Float32Array();
//   currentNumParticles = 0;
//   smoothingRadius = 0.2;
//   densityReference = 2000;
//   pressureConstant = 20;
//   viscosity = 0.005;
//   maxVelocity = 75;

//   setParticleData(positions: Float32Array, velocities: Float32Array) {
//     this.positions = positions;
//     this.velocities = velocities;
//   }

//   update(deltaTime: number) {
//     // 这里简化了模拟逻辑，实际应用中需要实现完整的SPH模拟
//     for (let i = 0; i < this.currentNumParticles; i++) {
//       // 简单重力模拟
//       this.velocities[i * 3 + 1] -= 0.01; // y轴重力

//       // 更新位置
//       this.positions[i * 3] += this.velocities[i * 3] * deltaTime;
//       this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * deltaTime;
//       this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * deltaTime;

//       // 简单地面碰撞
//       if (this.positions[i * 3 + 1] < 0) {
//         this.positions[i * 3 + 1] = 0;
//         this.velocities[i * 3 + 1] *= -0.5; // 反弹
//       }
//     }
//   }
// }

// // 粒子生成器类
// class ParticleGenerator {
//   scene: BABYLON.Scene;
//   positions: Float32Array = new Float32Array();
//   velocities: Float32Array = new Float32Array();
//   currNumParticles = 0;
//   particleRadius = 0.04;
//   position = new BABYLON.Vector3(0, 0, 0);

//   constructor(scene: BABYLON.Scene) {
//     this.scene = scene;
//     this.generateParticles(6000);
//   }

//   generateParticles(count: number) {
//     const newPositions = new Float32Array(count * 3);
//     const newVelocities = new Float32Array(count * 3);

//     // 复制现有粒子
//     const copyCount = Math.min(this.currNumParticles, count);
//     newPositions.set(this.positions.subarray(0, copyCount * 3), 0);
//     newVelocities.set(this.velocities.subarray(0, copyCount * 3), 0);

//     // 生成新粒子
//     for (let i = copyCount; i < count; i++) {
//       // 在球体内随机分布
//       const theta = Math.random() * Math.PI * 2;
//       const phi = Math.acos(2 * Math.random() - 1);
//       const r = Math.random() * 0.5;

//       newPositions[i * 3] = this.position.x + r * Math.sin(phi) * Math.cos(theta);
//       newPositions[i * 3 + 1] = this.position.y + r * Math.sin(phi) * Math.sin(theta);
//       newPositions[i * 3 + 2] = this.position.z + r * Math.cos(phi);

//       // 初始速度
//       newVelocities[i * 3] = (Math.random() - 0.5) * 0.1;
//       newVelocities[i * 3 + 1] = Math.random() * 0.1;
//       newVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
//     }

//     this.positions = newPositions;
//     this.velocities = newVelocities;
//     this.currNumParticles = count;
//   }
// }

// onMounted(() => {
//   initScene();
// });

// onUnmounted(() => {
//   // 清理资源
//   gui.value?.destroy();
//   scene.value?.dispose();
//   engine.value?.dispose();
//   window.removeEventListener('resize', () => {
//     engine.value?.resize();
//   });
// });
//
</script>

<template>
  <canvas ref="canvasRef" class="fluid-canvas"></canvas>
</template>

<style scoped>
.fluid-canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
