import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ImageModalProps {
  /** 여러 장을 전달할 때 사용 */
  imageUrls?: string[];
  /** 단일 이미지를 전달할 때 사용 (하위 호환) */
  imageUrl?: string;
  startIndex?: number;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Img = styled.img<{scale:number}>`
  transform: scale(${({scale})=>scale});
  width: auto;
  height: auto;
  max-width: 98vw;
  max-height: 98vh;
  object-fit: contain;
  border-radius: 0;

`;

const NavButton = styled.button`
  position: absolute;
  bottom: 1rem;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: .25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const ZoomButton = styled(NavButton)`
  right: 1rem;
`;
const PrevButton = styled(NavButton)`
  left: 1rem;
`;
const NextButton = styled(NavButton)`
  right: 4rem;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

const ImageModal: React.FC<ImageModalProps> = ({ imageUrls, imageUrl, startIndex = 0, onClose }) => {
  const urls = imageUrls ?? (imageUrl ? [imageUrl] : []);

  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(2);
  const currentUrl = urls[index] ?? '';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 표시할 이미지가 없으면 아무 것도 렌더링하지 않음
  if (!currentUrl) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Img src={currentUrl} alt="진단 사진" scale={scale} onWheel={(e)=>{e.stopPropagation();const delta=e.deltaY>0?-1:1;setScale(prev=>Math.max(1,Math.min(prev+delta,10)));}} onClick={(e)=>e.stopPropagation()} />
      <ZoomButton onClick={(e)=>{e.stopPropagation();setScale(prev=>Math.min(prev+1,10));}}>확대</ZoomButton>
          {urls.length>1 && (
        <>
          {index>0 && <PrevButton onClick={(e)=>{e.stopPropagation();setIndex(prev=>prev-1);setScale(2);}}>이전</PrevButton>}
          {index<urls.length-1 && <NextButton onClick={(e)=>{e.stopPropagation();setIndex(prev=>prev+1);setScale(2);}}>다음</NextButton>}
        </>
      )}
    </Overlay>,
    document.body,
  );
};

export default ImageModal;
