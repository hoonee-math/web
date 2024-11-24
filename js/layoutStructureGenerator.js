// 레이아웃 제너레이터 클래스
class LayoutGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.updateLayout();
    }

    // DOM 요소 초기화
    initializeElements() {
        this.elements = {
            layoutContainer: document.getElementById('layoutContainer'),
            htmlCode: document.getElementById('htmlCode'),
            cssCode: document.getElementById('cssCode'),
            copyButton: document.getElementById('copyCode')
        };

        // 모든 입력 요소 참조 저장
        this.inputs = {
            includeHeader: document.getElementById('includeHeader'),
            includeFooter: document.getElementById('includeFooter'),
            includeAside: document.getElementById('includeAside'),
            headerPosition: document.getElementById('headerPosition'),
            headerHeight: document.getElementById('headerHeight'),
            headerSticky: document.getElementById('headerSticky'),
            maxWidth: document.getElementById('maxWidth'),
            contentPadding: document.getElementById('contentPadding'),
            sectionLayout: document.getElementById('sectionLayout'),
            asidePosition: document.getElementById('asidePosition'),
            asideWidth: document.getElementById('asideWidth'),
            asideSticky: document.getElementById('asideSticky'),
            footerHeight: document.getElementById('footerHeight'),
            footerPosition: document.getElementById('footerPosition'),
            tabletBreakpoint: document.getElementById('tabletBreakpoint'),
            mobileBreakpoint: document.getElementById('mobileBreakpoint')
        };
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 모든 입력 요소에 대한 변경 이벤트 리스너
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('change', () => this.updateLayout());
            }
        });

        // 체크박스 상태에 따른 옵션 패널 표시/숨김
        this.inputs.includeHeader.addEventListener('change', () => {
            document.querySelector('.header-options').classList.toggle('hidden', !this.inputs.includeHeader.checked);
        });
        this.inputs.includeAside.addEventListener('change', () => {
            document.querySelector('.aside-options').classList.toggle('hidden', !this.inputs.includeAside.checked);
        });
        this.inputs.includeFooter.addEventListener('change', () => {
            document.querySelector('.footer-options').classList.toggle('hidden', !this.inputs.includeFooter.checked);
        });

        // 코드 복사 버튼
        this.elements.copyButton.addEventListener('click', () => this.copyCode());

        // 탭 전환
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    // 레이아웃 업데이트
    updateLayout() {
        const options = this.getOptions();
        this.elements.layoutContainer.innerHTML = this.generateLayoutHTML(options);
        this.updateCode(options);
    }

    // 현재 옵션 가져오기
    getOptions() {
        return {
            header: {
                include: this.inputs.includeHeader.checked,
                position: this.inputs.headerPosition.value,
                height: parseInt(this.inputs.headerHeight.value),
                sticky: this.inputs.headerSticky.value
            },
            main: {
                maxWidth: parseInt(this.inputs.maxWidth.value),
                padding: parseInt(this.inputs.contentPadding.value),
                layout: this.inputs.sectionLayout.value
            },
            aside: {
                include: this.inputs.includeAside.checked,
                position: this.inputs.asidePosition.value,
                width: parseInt(this.inputs.asideWidth.value),
                sticky: this.inputs.asideSticky.value
            },
            footer: {
                include: this.inputs.includeFooter.checked,
                height: parseInt(this.inputs.footerHeight.value),
                position: this.inputs.footerPosition.value
            },
            responsive: {
                tablet: parseInt(this.inputs.tabletBreakpoint.value),
                mobile: parseInt(this.inputs.mobileBreakpoint.value)
            }
        };
    }

    // 레이아웃 HTML 생성
    generateLayoutHTML(options) {
        let html = '';

        // 헤더
        if (options.header.include) {
            html += `
                <header class="layout-header" style="height: ${options.header.height}px;">
                    <h1>Header</h1>
                </header>`;
        }

        // 메인 컨텐츠
        html += `<main class="layout-main">`;
        
        // 왼쪽 사이드바
        if (options.aside.include && options.aside.position === 'left') {
            html += this.generateAside(options.aside);
        }

        // 섹션 레이아웃
        html += this.generateSections(options.main.layout);

        // 오른쪽 사이드바
        if (options.aside.include && options.aside.position === 'right') {
            html += this.generateAside(options.aside);
        }

        html += `</main>`;

        // 푸터
        if (options.footer.include) {
            html += `
                <footer class="layout-footer" style="height: ${options.footer.height}px;">
                    <p>Footer</p>
                </footer>`;
        }

        return html;
    }

    // 섹션 생성
    generateSections(layout) {
        switch(layout) {
            case 'single':
                return `<section class="layout-section">Main Content</section>`;
            case 'two-equal':
                return `
                    <section class="layout-section">Section 1</section>
                    <section class="layout-section">Section 2</section>`;
            case 'three-equal':
                return `
                    <section class="layout-section">Section 1</section>
                    <section class="layout-section">Section 2</section>
                    <section class="layout-section">Section 3</section>`;
            case 'main-aside':
                return `
                    <section class="layout-section">Main Content</section>
                    <aside class="layout-aside">Sub Content</aside>`;
            default:
                return '';
        }
    }

    // 사이드바 생성
    generateAside(asideOptions) {
        return `
            <aside class="layout-aside" style="width: ${asideOptions.width}px;">
                Sidebar
            </aside>`;
    }

    // 코드 업데이트
    updateCode(options) {
        this.elements.htmlCode.textContent = this.generateFinalHTML(options);
        this.elements.cssCode.textContent = this.generateFinalCSS(options);
    }

    // 최종 HTML 코드 생성
    generateFinalHTML(options) {
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
</head>
<body>
    ${this.generateLayoutHTML(options)}
</body>
</html>`;
    }

    // 최종 CSS 코드 생성
    generateFinalCSS(options) {
        let css = `/* 기본 스타일 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}`;

        // 헤더 스타일
        if (options.header.include) {
            css += `

/* 헤더 스타일 */
.layout-header {
    height: ${options.header.height}px;
    ${options.header.sticky !== 'none' ? `position: ${options.header.sticky};
    top: 0;
    z-index: 1000;` : ''}
}`;
        }

        // 메인 컨텐츠 스타일
        css += `

/* 메인 컨텐츠 스타일 */
.layout-main {
    max-width: ${options.main.maxWidth}px;
    margin: 0 auto;
    padding: ${options.main.padding}px;
    display: flex;
    gap: 20px;
    flex: 1;
}

.layout-section {
    flex: 1;
    min-height: 300px;
}`;

        // 사이드바 스타일
        if (options.aside.include) {
            css += `

/* 사이드바 스타일 */
.layout-aside {
    width: ${options.aside.width}px;
    ${options.aside.sticky === 'sticky' ? `position: sticky;
    top: ${options.header.include && options.header.sticky !== 'none' ? options.header.height + 'px' : '0'};
    height: fit-content;` : ''}
}`;
        }

        // 푸터 스타일
        if (options.footer.include) {
            css += `

/* 푸터 스타일 */
.layout-footer {
    height: ${options.footer.height}px;
    ${options.footer.position === 'sticky' ? `position: sticky;
    bottom: 0;` : ''}
}`;
        }

        // 반응형 스타일
        css += `

/* 반응형 스타일 */
@media (max-width: ${options.responsive.tablet}px) {
    .layout-main {
        flex-direction: column;
    }
    
    .layout-aside {
        width: 100% !important;
    }
}

@media (max-width: ${options.responsive.mobile}px) {
    .layout-main {
        padding: 10px;
    }
}`;

        return css;
    }

    // 유틸리티 메서드
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn, .code-panel').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Code`).classList.add('active');
    }

    copyCode() {
        const activePanel = document.querySelector('.code-panel.active');
        if (activePanel) {
            navigator.clipboard.writeText(activePanel.textContent)
                .then(() => alert('코드가 복사되었습니다!'))
                .catch(err => console.error('복사 실패:', err));
        }
    }
}

// 제너레이터 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    new LayoutGenerator();
});