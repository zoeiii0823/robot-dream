// 核心功能：点击左侧名字 → 右侧只切换内容，背景/位置全不变 【已修复残留+选中态问题】
const nameBtns = document.querySelectorAll('.name-btn');
const charBoxs = document.querySelectorAll('.char-box');

nameBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // ========【修改点1：新增这行，先移除所有名字的选中高亮】========
    nameBtns.forEach(item => item.classList.remove('active'));
    // ========【修改点2：新增这行，给当前点击的名字添加高亮】========
    btn.classList.add('active');
    
    // ========【原有代码保留，修复核心：强制隐藏所有内容，杜绝残留】========
    charBoxs.forEach(box => box.style.display = 'none');
    const targetId = btn.getAttribute('data-id');
    document.getElementById(targetId).style.display = 'block';
  });
});

// ========【初始化默认选中第一个人物A + 高亮第一个名字】========
document.querySelector('.name-btn').classList.add('active');
document.getElementById('A').style.display = 'block';

nameBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // ========【修改点1：新增这行，先移除所有名字的选中高亮】========
    nameBtns.forEach(item => item.classList.remove('active'));
    // ========【修改点2：新增这行，给当前点击的名字添加高亮】========
    btn.classList.add('active');
    
    // ========【原有代码保留，修复核心：强制隐藏所有内容，杜绝残留】========
    charBoxs.forEach(box => box.style.display = 'none');
    const targetId = btn.getAttribute('data-id');
    document.getElementById(targetId).style.display = 'block';
  });
});

// ========【初始化默认选中第一个人物A + 高亮第一个名字】========
document.querySelector('.name-btn').classList.add('active');
document.getElementById('A').style.display = 'block';

// ========【新增：头像点击跳转逻辑】========
const avatars = document.querySelectorAll('.avatar');
// 头像顺序与左侧名字顺序一一对应（A、B、C、D）
const avatarToIdMap = ['A', 'B', 'C', 'D'];
avatars.forEach((avatar, index) => {
  avatar.addEventListener('click', () => {
    // 获取对应ID（A/B/C/D）
    const targetId = avatarToIdMap[index];
    // 找到左侧对应data-id的名字按钮并模拟点击
    const targetNameBtn = document.querySelector(`.name-btn[data-id="${targetId}"]`);
    if (targetNameBtn) {
      targetNameBtn.click(); // 复用原有点击逻辑，保证样式和内容统一
    }
  });
});