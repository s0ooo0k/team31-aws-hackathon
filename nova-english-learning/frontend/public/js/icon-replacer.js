// 기하학적 도형을 예쁜 아이콘으로 교체

const iconReplacements = {
  // 고급 재생/미디어 컨트롤
  '■': '⬛',
  '▶': '⏵️',
  '◀': '⏴️', 
  '●': '⚫',
  '▲': '🔼',
  '▼': '🔽',
  '◆': '🔶',
  '★': '⭐',
  '☆': '🌟',
  '♦': '🔸',
  '♠': '♠️',
  '♥': '♥️',
  '♣': '♣️',
  
  // 세련된 화살표들
  '→': '⟶',
  '←': '⟵',
  '↑': '⟰',
  '↓': '⟱',
  '↗': '⤴️',
  '↘': '⤵️',
  '↙': '↙️',
  '↖': '↖️',
  
  // 프리미엄 체크/상태 마크
  '✓': '✔️',
  '✗': '✖️',
  '×': '✖️',
  
  // 고급 기하학적 형태
  '◯': '⭕',
  '△': '🔺',
  '□': '▫️',
  '◇': '🔹',
  '※': '✦',
  '⚫': '⚫',
  '⚪': '⚪',
  
  // 프로페셔널 미디어 컨트롤
  '⏸': '⏸️',
  '⏹': '⏹️',
  '⏺': '⏺️',
  '⏯': '⏯️',
  
  // 수학/과학 기호들
  '±': '±',
  '÷': '÷',
  '×': '×',
  '=': '=',
  
  // 비즈니스/문서 아이콘
  '§': '§',
  '¶': '¶',
  '©': '©️',
  '®': '®️',
  '™': '™️'
};

function replaceIconsInElement(element) {
  // 텍스트 노드만 처리
  if (element.nodeType === Node.TEXT_NODE) {
    let text = element.textContent;
    let hasReplacement = false;
    
    for (const [oldIcon, newIcon] of Object.entries(iconReplacements)) {
      if (text.includes(oldIcon)) {
        text = text.replace(new RegExp(oldIcon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newIcon);
        hasReplacement = true;
      }
    }
    
    if (hasReplacement) {
      element.textContent = text;
    }
    return;
  }
  
  // 자식 요소들 재귀적으로 처리
  if (element.childNodes) {
    element.childNodes.forEach(child => {
      replaceIconsInElement(child);
    });
  }
}

function replaceAllIcons() {
  // 전체 문서에서 아이콘 교체
  replaceIconsInElement(document.body);
  
  // 동적으로 추가되는 요소들을 위한 MutationObserver
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          replaceIconsInElement(node);
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', replaceAllIcons);

// 이미 로드된 경우를 위해 즉시 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', replaceAllIcons);
} else {
  replaceAllIcons();
}