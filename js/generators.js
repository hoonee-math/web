// 동적으로 생성기 목록을 관리하는 스크립트
const GENERATORS = [
    {
        id: 'menu',
        name: '메뉴 생성기',
        icon: '📑',
        path: 'menuStyleGenerator.html'
    },
    {
        id: 'card',
        name: '카드 생성기',
        icon: '🎴',
        path: 'cardGenerator.html'
    },
    {
        id: 'layout',
        name: '레이아웃 생성기',
        icon: '📱',
        path: 'layoutStructureGenerator.html'
    },
    {
        id: 'bootStrapGrid',
        name: 'Grid 생성기',
        icon: '🪟',
        path: 'bootstrapGridGenerator.html'
    }
];

function toggleGeneratorList() {
    const selector = document.querySelector('.generator-selector');
    selector.classList.toggle('open');
}

// 현재 페이지에 맞는 제너레이터 표시
function updateCurrentGenerator() {
    const currentPath = window.location.pathname;
    const currentGenerator = GENERATORS.find(gen => 
        currentPath.includes(gen.path)
    );
    
    if (currentGenerator) {
        document.getElementById('currentGenerator').textContent = currentGenerator.name;
        
        // 활성 상태 업데이트
        document.querySelectorAll('.generator-item').forEach(item => {
            if (item.getAttribute('href').includes(currentGenerator.path)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// 생성기 목록 동적 생성
function initializeGeneratorList() {
    const list = document.querySelector('.generator-list');
    list.innerHTML = GENERATORS.map(gen => `
        <a href="${gen.path}" class="generator-item">
            <i class="generator-icon">${gen.icon}</i>
            <span>${gen.name}</span>
        </a>
    `).join('');
    
    updateCurrentGenerator();
}

// 클릭 이벤트 외의 영역 클릭 시 목록 닫기
document.addEventListener('click', (e) => {
    const selector = document.querySelector('.generator-selector');
    if (!selector.contains(e.target)) {
        selector.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', initializeGeneratorList);