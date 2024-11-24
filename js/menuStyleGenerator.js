
// DOM 요소 참조
const menuContainer = document.getElementById('menuContainer');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 모든 입력 요소에 대한 이벤트 리스너
    document.querySelectorAll('.style-input select, .style-input input').forEach(input => {
        input.addEventListener('change', updateMenu);
    });

    // 탭 전환
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .code-panel').forEach(el => {
                el.classList.remove('active');
            });
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Code`).classList.add('active');
        });
    });

    // 코드 복사 버튼
    document.getElementById('copyCode').addEventListener('click', () => {
        const activePanel = document.querySelector('.code-panel.active');
        if (activePanel) {
            navigator.clipboard.writeText(activePanel.textContent)
                .then(() => alert('코드가 복사되었습니다!'))
                .catch(err => console.error('복사 실패:', err));
        }
    });

    // 초기 메뉴 생성
    updateMenu();
});

// 메뉴 업데이트
// 메뉴 업데이트 함수를 다음과 같이 수정
function updateMenu() {
    const menuType = document.getElementById('menuType').value;
    const animation = document.getElementById('animation').value;
    const mainCount = parseInt(document.getElementById('mainMenuCount').value);
    const subCount = parseInt(document.getElementById('subMenuCount').value);
    
    let menuHTML = '';
    
    switch(menuType) {
        case 'dropdown':
            menuHTML = generateDropdownMenu(menuType, mainCount, subCount, animation);  // type을 menuType으로 수정
            break;
        case 'slide':
            menuHTML = generateSlideMenu(mainCount, subCount, animation);
            break;
        case 'accordion':
            menuHTML = generateAccordionMenu(mainCount, subCount, animation);
            break;
        case 'mega':
            menuHTML = generateMegaMenu(mainCount, subCount, animation);
            break;
    }
    
    menuContainer.innerHTML = menuHTML;
    applyStyles();
    setupEventListeners();
    updateCode();
}

function generateSlideMenu(mainCount, subCount, animation) {
    let html = '';
    for(let i = 1; i <= mainCount; i++) {
        html += `
            <div class="slide">
                <button class="slide-btn">메뉴 ${i}</button>
                <div class="slide-content ${animation}">`;
        for(let j = 1; j <= subCount; j++) {
            html += `<a href="#" class="menu-item">서브메뉴 ${i}-${j}</a>`;
        }
        html += `</div>
            </div>`;
    }
    return html;
}
// 메뉴 HTML 생성 함수들
function generateDropdownMenu(type, mainCount, subCount, animation) {
    let html = '';
    for(let i = 1; i <= mainCount; i++) {
        html += `
            <div class="${type}">
                <button class="${type}-btn">메뉴 ${i}</button>
                <div class="${type}-content ${animation}">`;
        for(let j = 1; j <= subCount; j++) {
            html += `<a href="#" class="menu-item">서브메뉴 ${i}-${j}</a>`;
        }
        html += `</div>
            </div>`;
    }
    return html;
}

function generateAccordionMenu(mainCount, subCount, animation) {
    let html = '<div class="accordion">';
    for(let i = 1; i <= mainCount; i++) {
        html += `
            <button class="accordion-btn">메뉴 ${i}</button>
            <div class="accordion-content ${animation}">`;
        for(let j = 1; j <= subCount; j++) {
            html += `<a href="#" class="menu-item">서브메뉴 ${i}-${j}</a>`;
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
}

function generateMegaMenu(mainCount, subCount, animation) {
    let html = '';
    for(let i = 1; i <= mainCount; i++) {
        html += `
            <div class="mega">
                <button class="mega-btn">메뉴 ${i}</button>
                <div class="mega-content ${animation}">`;
        for(let j = 0; j < 3; j++) {
            html += `
                <div class="mega-column">`;
                    for(let k = 1; k <= Math.ceil(subCount/3); k++) {
                html += `<a href="#" class="menu-item">서브메뉴 ${i}-${j+1}-${k}</a>`;
            }
            html += `</div>`;
        }
        html += `</div>
            </div>`;
    }
    return html;
}

// 스타일 적용
function applyStyles() {
    const backgroundColor = document.getElementById('backgroundColor').value;
    const borderColor = document.getElementById('borderColor').value;
    const textColor = document.getElementById('textColor').value;
    const hoverColor = document.getElementById('hoverColor').value;
    const borderWidth = document.getElementById('borderWidth').value;
    const borderStyle = document.getElementById('borderStyle').value;

    // 메뉴 버튼 스타일
    const buttons = document.querySelectorAll('.dropdown-btn, .accordion-btn, .mega-btn');
    buttons.forEach(btn => {
        btn.style.backgroundColor = backgroundColor;
        btn.style.color = textColor;
        btn.style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
    });

    // 메뉴 콘텐츠 스타일
    const contents = document.querySelectorAll('.dropdown-content, .slide-content, .accordion-content, .mega-content');
    contents.forEach(content => {
        content.style.backgroundColor = backgroundColor;
        content.style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
    });

    // 메뉴 아이템 스타일
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        item.style.color = textColor;
        item.addEventListener('mouseover', () => {
            item.style.backgroundColor = hoverColor;
        });
        item.addEventListener('mouseout', () => {
            item.style.backgroundColor = backgroundColor;
        });
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    const menuType = document.getElementById('menuType').value;
    const allContents = document.querySelectorAll('.dropdown-content, .slide-content, .accordion-content, .mega-content');
    
    switch(menuType) {
        case 'dropdown':
        case 'mega':
            document.querySelectorAll(`.${menuType}-btn`).forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const wasDisplayed = content.style.display === 'block';
                    
                    // 다른 모든 메뉴 닫기
                    allContents.forEach(el => {
                        el.style.display = 'none';
                        el.classList.remove('show');
                    });

                    if (!wasDisplayed) {
                        content.style.display = 'block';
                        setTimeout(() => content.classList.add('show'), 10);
                    }
                });
            });
            break;
        case 'slide':
            document.querySelectorAll('.slide-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const wasDisplayed = content.classList.contains('show');
                    
                    // 다른 모든 메뉴 닫기
                    document.querySelectorAll('.slide-content').forEach(el => {
                        el.classList.remove('show');
                        setTimeout(() => {
                            if (!el.classList.contains('show')) {
                                el.style.visibility = 'hidden';
                            }
                        }, 300);
                    });

                    if (!wasDisplayed) {
                        content.style.visibility = 'visible';
                        setTimeout(() => content.classList.add('show'), 10);
                    }
                });
            });
            break;
        case 'accordion':
            document.querySelectorAll('.accordion-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const wasDisplayed = content.style.display === 'block';

                    if (!wasDisplayed) {
                        content.style.display = 'block';
                        setTimeout(() => content.classList.add('show'), 10);
                    } else {
                        content.classList.remove('show');
                        setTimeout(() => content.style.display = 'none', 300);
                    }
                });
            });
            break;
    }
}

// 코드 업데이트
function updateCode() {
    // HTML 코드
    htmlCode.textContent = menuContainer.innerHTML.trim();

    // CSS 코드
    const menuType = document.getElementById('menuType').value;
    const animation = document.getElementById('animation').value;
    const cssContent = generateCssCode(menuType, animation);
    cssCode.textContent = cssContent;

    // JavaScript 코드
    const jsContent = generateJsCode(menuType);
    jsCode.textContent = jsContent;
}

// CSS 코드 생성
function generateCssCode(menuType, animation) {
    const backgroundColor = document.getElementById('backgroundColor').value;
    const borderColor = document.getElementById('borderColor').value;
    const textColor = document.getElementById('textColor').value;
    const hoverColor = document.getElementById('hoverColor').value;
    const borderWidth = document.getElementById('borderWidth').value;
    const borderStyle = document.getElementById('borderStyle').value;

    // 기본 스타일
    const baseStyles = `
        .${menuType} {
            position: relative;
            display: inline-block;
            margin-right: 10px;
        }

        .menu-item {
            color: ${textColor};
            padding: 10px 15px;
            text-decoration: none;
            display: block;
        }

        .menu-item:hover {
            background-color: ${hoverColor};
        }`;

    // 메뉴 타입별 스타일
    let menuStyles = '';
    if (menuType === 'slide') {
        menuStyles = `
        .slide-btn {
            padding: 10px 20px;
            background-color: ${backgroundColor};
            color: ${textColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            cursor: pointer;
            border-radius: 4px;
        }

        .slide-content {
            position: absolute;
            top: 0;
            left: 100%;
            min-width: 160px;
            background-color: ${backgroundColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            opacity: 0;
            visibility: hidden;
            transform: translateX(20px);
            transition: all 0.3s ease;
            z-index: 1;
        }

        .slide-content.show {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
        }`;
    } else {
        menuStyles = `
        .${menuType}-btn {
            padding: 10px 20px;
            background-color: ${backgroundColor};
            color: ${textColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            cursor: pointer;
        }

        .${menuType}-content {
            display: none;
            position: absolute;
            min-width: 160px;
            background-color: ${backgroundColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            z-index: 1;
        }`;
    }

    return `/* 메뉴 스타일 */
${baseStyles}

${menuStyles}

/* 애니메이션 */
${generateAnimationCss(animation)}`;
}

// 애니메이션 CSS 생성
function generateAnimationCss(animation) {
    switch(animation) {
        case 'fade':
            return `.fade {
    opacity: 0;
    transition: opacity 0.3s ease;
}
.fade.show {
    opacity: 1;
}`;
        case 'slide-down':
            return `.slide-down {
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s ease;
}
.slide-down.show {
    transform: translateY(0);
    opacity: 1;
}`;
        case 'slide-up':
            return `.slide-up {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
}
.slide-up.show {
    transform: translateY(0);
    opacity: 1;
}`;
        default:
            return '';
    }
}

// JavaScript 코드 생성
function generateJsCode(menuType) {
    return `// 메뉴 동작 설정
document.querySelectorAll('.${menuType}-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const wasDisplayed = content.style.display === 'block';
        
        ${menuType !== 'accordion' ? `
        // 다른 메뉴 닫기
        document.querySelectorAll('.${menuType}-content').forEach(el => {
            el.style.display = 'none';
            el.classList.remove('show');
        });` : ''}

        if (!wasDisplayed) {
            content.style.display = 'block';
            setTimeout(() => content.classList.add('show'), 10);
        } ${menuType === 'accordion' ? `else {
            content.classList.remove('show');
            setTimeout(() => content.style.display = 'none', 300);
        }` : ''}
    });
});`;
}