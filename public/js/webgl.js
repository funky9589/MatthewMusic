(function () {
  function initWebGL() {
    const canvas = document.getElementById('webglCanvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const scene = new THREE.Scene();
    scene.background = null; // 透明背景，顯示原始背景圖

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 初始化 FBXLoader
    const loader = new THREE.FBXLoader();

    // 儲存加載的模型
    let noteModel, quarterNoteModel;

    // 加載兩個 FBX 模型
    const loadModels = () => {
      return new Promise((resolve, reject) => {
        loader.load(
          'assets/note.fbx',
          (fbx1) => {
            console.log('Successfully loaded note.fbx');
            noteModel = fbx1;
            noteModel.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
              }
            });
            noteModel.scale.set(0.05, 0.05, 0.05);

            loader.load(
              'assets/quarternote.fbx',
              (fbx2) => {
                console.log('Successfully loaded quarternote.fbx');
                quarterNoteModel = fbx2;
                quarterNoteModel.traverse((child) => {
                  if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
                  }
                });
                quarterNoteModel.scale.set(0.05, 0.05, 0.05);
                resolve();
              },
              undefined,
              (error) => {
                console.error('Error loading quarternote.fbx:', error);
                reject(error);
              }
            );
          },
          undefined,
          (error) => {
            console.error('Error loading note.fbx:', error);
            reject(error);
          }
        );
      });
    };

    // 創建音符實例
    const createNote = (model) => {
      const note = model.clone();
      note.position.set((Math.random() - 0.5) * 2, -2, 0);
      note.velocity = 0.01 + Math.random() * 0.01; // 隨機上升速度
      note.fade = 1;
      note.rotationSpeed = Math.random() * 0.02; // 隨機旋轉速度
      note.waveOffset = Math.random() * Math.PI * 2; // 波動偏移
      note.floatOffset = Math.random() * Math.PI * 2; // 左右浮動偏移

      // 添加粒子尾跡
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.05,
        transparent: true,
        opacity: 0.5,
      });
      note.particles = new THREE.Points(particlesGeometry, particlesMaterial);
      note.particlePositions = [];
      note.add(note.particles);

      return note;
    };

    // 音符陣列
    const notes = [];
    const maxNotes = 4;
    let spawnInterval = 1200;
    let spawnNoteInterval;

    function spawnNote() {
      if (notes.length < maxNotes && noteModel && quarterNoteModel) {
        const modelToUse = Math.random() > 0.5 ? noteModel : quarterNoteModel;
        const note = createNote(modelToUse);
        notes.push(note);
        scene.add(note);
      }
    }

    // 與音頻播放同步
    const bgAudio = document.getElementById('bgAudio');
    function startSpawning() {
      spawnNoteInterval = setInterval(spawnNote, spawnInterval);
    }
    bgAudio.addEventListener('play', () => {
      clearInterval(spawnNoteInterval);
      spawnInterval = 800;
      startSpawning();
    });
    bgAudio.addEventListener('pause', () => {
      clearInterval(spawnNoteInterval);
      spawnInterval = 1200;
      startSpawning();
    });

    // 加載模型後啟動動畫
    loadModels()
      .then(() => {
        console.log('Models loaded, starting animation');
        startSpawning();
      })
      .catch((error) => {
        console.error('Failed to load models, stopping animation:', error);
        cancelAnimationFrame(animate);
        clearInterval(spawnNoteInterval);
      });

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // 動畫：音符上升、旋轉、波動、淡出並添加粒子尾跡
    function animate() {
      requestAnimationFrame(animate);
      notes.forEach((note, index) => {
        // 上升與波動
        note.position.y += note.velocity;
        note.position.y += Math.sin(Date.now() * 0.002 + note.waveOffset) * 0.05; // 上下波動

        // 旋轉
        note.rotation.z += note.rotationSpeed; // 沿 Z 軸旋轉

        // 左右浮動
        note.position.x += Math.sin(Date.now() * 0.001 + note.floatOffset) * 0.005;

        // 淡出
        note.fade -= 0.003;
        note.traverse((child) => {
          if (child.isMesh) child.material.opacity = note.fade;
        });

        // 粒子尾跡
        note.particlePositions.push(note.position.clone());
        if (note.particlePositions.length > 10) note.particlePositions.shift(); // 限制粒子數量
        note.particles.geometry.setFromPoints(note.particlePositions);
        note.particles.material.opacity = note.fade;

        // 移除條件
        if (note.position.y > 3 || note.fade <= 0) {
          scene.remove(note);
          notes.splice(index, 1);
        }
      });
      renderer.render(scene, camera);
    }
    animate();

    // 處理窗口大小變化
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  document.addEventListener('DOMContentLoaded', initWebGL);
})();