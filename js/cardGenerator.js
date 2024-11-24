// 제너레이터 클래스 정의
class CardGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.updatePreview();
    }

    // DOM 요소 초기화
    initializeElements() {
        this.elements = {
            cardContainer: document.getElementById('cardContainer'),
            htmlCode: document.getElementById('htmlCode'),
            cssCode: document.getElementById('cssCode'),
            copyButton: document.getElementById('copyCode')
        };

        // 모든 입력 요소 참조 저장
        this.inputs = {
            cardCount: document.getElementById('cardCount'),
            gridColumns: document.getElementById('gridColumns'),
            cardGap: document.getElementById('cardGap'),
            cardWidth: document.getElementById('cardWidth'),
            heightType: document.getElementById('heightType'),
            cardHeight: document.getElementById('cardHeight'),
            aspectRatio: document.getElementById('aspectRatio'),
            includeImage: document.getElementById('includeImage'),
            imagePosition: document.getElementById('imagePosition'),
            imageRatio: document.getElementById('imageRatio'),
            includeTitle: document.getElementById('includeTitle'),
            includeSubtitle: document.getElementById('includeSubtitle'),
            includeText: document.getElementById('includeText'),
            includeButton: document.getElementById('includeButton'),
            borderStyle: document.getElementById('borderStyle'),
            borderWidth: document.getElementById('borderWidth'),
            borderColor: document.getElementById('borderColor'),
            borderRadius: document.getElementById('borderRadius'),
            shadowStyle: document.getElementById('shadowStyle'),
            shadowX: document.getElementById('shadowX'),
            shadowY: document.getElementById('shadowY'),
            shadowBlur: document.getElementById('shadowBlur'),
            shadowSpread: document.getElementById('shadowSpread'),
            shadowColor: document.getElementById('shadowColor'),
            shadowOpacity: document.getElementById('shadowOpacity'),
            hoverEffect: document.getElementById('hoverEffect')
        };
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 모든 입력 요소에 대한 변경 이벤트 리스너
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('change', () => this.updatePreview());
            }
        });

        // 특별한 처리가 필요한 이벤트 리스너들
        this.inputs.heightType.addEventListener('change', () => this.toggleHeightInputs());
        this.inputs.includeImage.addEventListener('change', () => this.toggleImageOptions());
        this.inputs.shadowStyle.addEventListener('change', () => this.toggleShadowOptions());
        this.inputs.borderStyle.addEventListener('change', () => this.toggleBorderOptions());

        // 코드 복사 버튼
        this.elements.copyButton.addEventListener('click', () => this.copyCode());

        // 탭 전환
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    // 미리보기 업데이트
    updatePreview() {
        const options = this.getOptions();
        this.elements.cardContainer.innerHTML = this.generateCards(options);
        this.applyStyles(options);
        this.updateCode(options);
    }

    // 현재 옵션 가져오기
    getOptions() {
        return {
            cardCount: parseInt(this.inputs.cardCount.value),
            gridColumns: parseInt(this.inputs.gridColumns.value),
            cardGap: parseInt(this.inputs.cardGap.value),
            cardWidth: parseInt(this.inputs.cardWidth.value),
            heightType: this.inputs.heightType.value,
            cardHeight: parseInt(this.inputs.cardHeight.value),
            aspectRatio: this.inputs.aspectRatio.value,
            includeImage: this.inputs.includeImage.checked,
            imagePosition: this.inputs.imagePosition.value,
            imageRatio: parseInt(this.inputs.imageRatio.value),
            includeTitle: this.inputs.includeTitle.checked,
            includeSubtitle: this.inputs.includeSubtitle.checked,
            includeText: this.inputs.includeText.checked,
            includeButton: this.inputs.includeButton.checked,
            border: {
                style: this.inputs.borderStyle.value,
                width: parseInt(this.inputs.borderWidth.value),
                color: this.inputs.borderColor.value,
                radius: parseInt(this.inputs.borderRadius.value)
            },
            shadow: this.getShadowOptions(),
            hoverEffects: Array.from(this.inputs.hoverEffect.selectedOptions).map(opt => opt.value)
        };
    }

    // 그림자 옵션 가져오기
    getShadowOptions() {
        const style = this.inputs.shadowStyle.value;
        if (style === 'none') return null;
        
        if (style === 'custom') {
            return {
                x: parseInt(this.inputs.shadowX.value),
                y: parseInt(this.inputs.shadowY.value),
                blur: parseInt(this.inputs.shadowBlur.value),
                spread: parseInt(this.inputs.shadowSpread.value),
                color: this.inputs.shadowColor.value,
                opacity: parseInt(this.inputs.shadowOpacity.value)
            };
        }

        // 프리셋 그림자 스타일
        const presets = {
            subtle: { x: 0, y: 2, blur: 10, spread: 0, opacity: 10 },
            medium: { x: 0, y: 4, blur: 15, spread: 0, opacity: 15 },
            strong: { x: 0, y: 8, blur: 30, spread: 0, opacity: 20 }
        };

        return presets[style];
    }

    // 카드 HTML 생성
    generateCards(options) {
        let cards = '';
        for (let i = 0; i < options.cardCount; i++) {
            cards += this.generateCardHTML(i, options);
        }
        return cards;
    }

    // 단일 카드 HTML 생성
    generateCardHTML(index, options) {
        const hoverClasses = options.hoverEffects.map(effect => `hover-${effect}`).join(' ');
        
        return `
            <div class="card ${hoverClasses}">
                ${options.includeImage ? this.generateImageHTML(options) : ''}
                <div class="card-content">
                    ${options.includeTitle ? `<h2 class="card-title">카드 제목 ${index + 1}</h2>` : ''}
                    ${options.includeSubtitle ? `<h3 class="card-subtitle">부제목 ${index + 1}</h3>` : ''}
                    ${options.includeText ? `<p class="card-text">이것은 카드 ${index + 1}의 샘플 텍스트입니다. 실제 컨텐츠로 교체해주세요.</p>` : ''}
                    ${options.includeButton ? `<a href="#" class="card-button">자세히 보기</a>` : ''}
                </div>
            </div>`;
    }

    // 이미지 HTML 생성
    generateImageHTML(options) {
        return `
            <div class="card-image" style="padding-bottom: ${options.imageRatio}%">
                <img src="/api/placeholder/400/300" alt="카드 이미지">
            </div>`;
    }

    // 스타일 적용
    applyStyles(options) {
        const container = this.elements.cardContainer;
        container.style.gridTemplateColumns = `repeat(${options.gridColumns}, 1fr)`;
        container.style.gap = `${options.cardGap}px`;

        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
            // 카드 크기 설정
            card.style.width = '100%';
            if (options.heightType === 'fixed') {
                card.style.height = `${options.cardHeight}px`;
            }

            // 테두리 설정
            if (options.border.style !== 'none') {
                card.style.border = `${options.border.width}px ${options.border.style} ${options.border.color}`;
                card.style.borderRadius = `${options.border.radius}px`;
            }

            // 그림자 설정
            if (options.shadow) {
                const shadow = options.shadow;
                const shadowColor = this.hexToRGBA(shadow.color || '#000000', shadow.opacity / 100);
                card.style.boxShadow = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadowColor}`;
            }
        });
    }

    // 코드 업데이트
    updateCode(options) {
        this.elements.htmlCode.textContent = this.generateFinalHTML(options);
        this.elements.cssCode.textContent = this.generateFinalCSS(options);
    }

    // 최종 HTML 코드 생성
    generateFinalHTML(options) {
        const container = this.elements.cardContainer.cloneNode(true);
        container.removeAttribute('style'); // 인라인 스타일 제거
        container.className = 'card-container';
        return container.outerHTML;
    }

    // 최종 CSS 코드 생성
    generateFinalCSS(options) {
        let css = `
/* 카드 컨테이너 스타일 */
.card-container {
    display: grid;
    grid-template-columns: repeat(${options.gridColumns}, 1fr);
    gap: ${options.cardGap}px;
    padding: 20px;
}

/* 카드 기본 스타일 */
.card {
    background: white;
    overflow: hidden;
    ${options.heightType === 'fixed' ? `height: ${options.cardHeight}px;` : ''}
    ${options.border.style !== 'none' ? `
    border: ${options.border.width}px ${options.border.style} ${options.border.color};
    border-radius: ${options.border.radius}px;` : ''}
    ${options.shadow ? `
    box-shadow: ${options.shadow.x}px ${options.shadow.y}px ${options.shadow.blur}px ${options.shadow.spread}px ${this.hexToRGBA(options.shadow.color || '#000000', options.shadow.opacity / 100)};` : ''}
    transition: all 0.3s ease;
}`;

        // 이미지 스타일
        if (options.includeImage) {
            css += `

/* 카드 이미지 스타일 */
.card-image {
    width: 100%;
    height: 0;
    padding-bottom: ${options.imageRatio}%;
    position: relative;
    overflow: hidden;
    background: #e0e0e0;
}

.card-image img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
}`;
        }

        // 컨텐츠 스타일
        css += `

/* 카드 컨텐츠 스타일 */
.card-content {
    padding: 16px;
}`;

        if (options.includeTitle) {
            css += `

.card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}`;
        }

        if (options.includeSubtitle) {
            css += `

.card-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}`;
        }

        if (options.includeText) {
            css += `

.card-text {
    font-size: 14px;
    line-height: 1.5;
    color: #444;
    margin-bottom: 16px;
}`;
        }

        if (options.includeButton) {
            css += `

.card-button {
    display: inline-block;
    padding: 8px 16px;
    background: #0066ff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
}`;
        }

        // 호버 효과 스타일
        if (options.hoverEffects.length > 0) {
            css += `

/* 호버 효과 */`;
            if (options.hoverEffects.includes('scale')) {
                css += `
.hover-scale:hover {
    transform: scale(1.05);
}`;
            }
            if (options.hoverEffects.includes('lift')) {
                css += `
.hover-lift:hover {
    transform: translateY(-8px);
}`;
            }
            if (options.hoverEffects.includes('glow')) {
                css += `
.hover-glow:hover {
    box-shadow: 0 0 20px rgba(0,128,255,0.2);
}`;
            }
            if (options.hoverEffects.includes('border')) {
                css += `
.hover-border:hover {
    border-color: #0066ff;
}`;
            }
        }

        // 반응형 스타일
        css += `

/* 반응형 스타일 */
@media (max-width: 600px) {
    .card-container {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}`;

        return css;
    }

    // 유틸리티 메서드들
    toggleHeightInputs() {
        const heightValue = document.querySelector('.height-value');
        const ratioValue = document.querySelector('.ratio-value');
        const type = this.inputs.heightType.value;

        heightValue.style.display = type === 'fixed' ? 'flex' : 'none';
        ratioValue.style.display = type === 'ratio' ? 'flex' : 'none';
    }

    toggleImageOptions() {
        const imageOptions = document.querySelector('.image-options');
        imageOptions.style.display = this.inputs.includeImage.checked ? 'block' : 'none';
    }

    toggleShadowOptions() {
        const customOptions = document.querySelector('.shadow-custom');
        customOptions.style.display = this.inputs.shadowStyle.value === 'custom' ? 'block' : 'none';
    }

    toggleBorderOptions() {
        const borderOptions = document.querySelector('.border-options');
        borderOptions.style.display = this.inputs.borderStyle.value === 'none' ? 'none' : 'block';
    }

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

    hexToRGBA(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// 제너레이터 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    new CardGenerator();
});