import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ImageModalProps {
  imageUrl: string;
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

const ZoomButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: .25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
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

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  const [scale,setScale]=useState(2);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Img src={imageUrl} alt="진단 사진" scale={scale} onWheel={(e)=>{e.stopPropagation();const delta=e.deltaY>0?-1:1;setScale(prev=>Math.max(1,Math.min(prev+delta,10)));}} onClick={(e)=>e.stopPropagation()} />
      <ZoomButton onClick={(e)=>{e.stopPropagation();setScale(prev=>Math.min(prev+1,10));}}>확대</ZoomButton>
    </Overlay>,
    document.body,
  );
};

export default ImageModal;
