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
            noteModel = fbx1;
            noteModel.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 50, transparent: true, opacity: 0.7 });
              }
            });
            noteModel.scale.set(0.05, 0.05, 0.05); // 調整縮放，根據實際模型大小微調

            loader.load(
              'assets/quarternote.fbx',
              (fbx2) => {
                quarterNoteModel = fbx2;
                quarterNoteModel.traverse((child) => {
                  if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 50, transparent: true, opacity: 0.7 });
                  }
                });
                quarterNoteModel.scale.set(0.05, 0.05, 0.05); // 同上
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
      note.position.set((Math.random() - 0.5) * 2, -3, 0); // 從底部隨機位置開始
      note.velocity = 0.015 + Math.random() * 0.005; // 上升速度
      note.fade = 1; // 透明度控制
      note.floatOffset = Math.random() * Math.PI * 2; // 隨機浮動偏移
      return note;
    };

    // 音符陣列
    const notes = [];
    const maxNotes = 4; // 限制音符數量
    let spawnInterval = 1200; // 初始生成間隔
    let spawnNoteInterval;

    function spawnNote() {
      if (notes.length < maxNotes && noteModel && quarterNoteModel) {
        const modelToUse = Math.random() > 0.5 ? noteModel : quarterNoteModel; // 隨機選擇模型
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
      spawnInterval = 800; // 音樂播放時加快生成
      startSpawning();
    });
    bgAudio.addEventListener('pause', () => {
      clearInterval(spawnNoteInterval);
      spawnInterval = 1200; // 音樂暫停時減慢生成
      startSpawning();
    });

    // 加載模型後啟動動畫
    loadModels()
      .then(() => {
        startSpawning(); // 初始啟動生成
      })
      .catch((error) => {
        console.error('Failed to load models, stopping animation:', error);
        // 停止動畫
        cancelAnimationFrame(animate);
        clearInterval(spawnNoteInterval);
      });

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xFFFFFF, 0.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 動畫：音符上升、淡出並輕微浮動
    function animate() {
      requestAnimationFrame(animate);
      notes.forEach((note, index) => {
        note.position.y += note.velocity; // 上升
        note.fade -= 0.003; // 緩慢淡出
        note.position.x += Math.sin(Date.now() * 0.001 + note.floatOffset) * 0.005; // 輕微左右浮動
        note.traverse((child) => {
          if (child.isMesh) child.material.opacity = note.fade;
        });

        // 當音符移出畫面或完全淡出時移除
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