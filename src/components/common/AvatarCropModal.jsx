import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { AVATAR_SHAPES } from '../../constants/defaultState.js';

export default function AvatarCropModal() {
  const { cropModal, closeCropModal, updatePersonal, state, showToast } = useResume();
  const [selectedShape, setSelectedShape] = useState('circle');
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const viewportRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  // Determine viewport dimensions based on shape
  const isRect = selectedShape === 'rect';
  const viewportWidth = isRect ? 210 : 240;
  const viewportHeight = isRect ? 280 : 240;

  // Initialize shape from personal.avatarShape
  useEffect(() => {
    if (cropModal.isOpen) {
      const initialShape = state.personal?.avatarShape || 'circle';
      setSelectedShape(initialShape);
      setZoom(1);
    }
  }, [cropModal.isOpen, state.personal?.avatarShape]);

  // Compute base fit scale and initial centering
  const resetToCenter = useCallback((nw, nh, vw = viewportWidth, vh = viewportHeight, customZoom = 1) => {
    if (!nw || !nh) return;
    // Cover the viewport by default so there are no empty borders
    const baseScale = Math.max(vw / nw, vh / nh);
    const scaledW = nw * baseScale * customZoom;
    const scaledH = nh * baseScale * customZoom;
    setPos({
      x: (vw - scaledW) / 2,
      y: (vh - scaledH) / 2
    });
  }, [viewportWidth, viewportHeight]);

  // When image loads or shape changes, re-center
  const handleImageLoad = (e) => {
    const nw = e.target.naturalWidth || e.target.width;
    const nh = e.target.naturalHeight || e.target.height;
    setNaturalSize({ width: nw, height: nh });
    setZoom(1);
    resetToCenter(nw, nh, viewportWidth, viewportHeight, 1);
  };

  // Re-center when shape changes
  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    const newVw = shape === 'rect' ? 210 : 240;
    const newVh = shape === 'rect' ? 280 : 240;
    if (naturalSize.width > 0) {
      resetToCenter(naturalSize.width, naturalSize.height, newVw, newVh, zoom);
    }
  };

  // Pointer drag handling
  const onPointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { ...pos };
  }, [pos]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPos({
      x: startPosRef.current.x + dx,
      y: startPosRef.current.y + dy
    });
  }, [isDragging]);

  const onPointerUp = useCallback((e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  // Mouse wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => {
      const nextZoom = Math.min(4, Math.max(0.3, Math.round((prev + delta) * 100) / 100));
      // Zoom toward center
      if (naturalSize.width > 0) {
        const baseScale = Math.max(viewportWidth / naturalSize.width, viewportHeight / naturalSize.height);
        const oldW = naturalSize.width * baseScale * prev;
        const oldH = naturalSize.height * baseScale * prev;
        const newW = naturalSize.width * baseScale * nextZoom;
        const newH = naturalSize.height * baseScale * nextZoom;
        setPos(p => ({
          x: p.x + (oldW - newW) / 2,
          y: p.y + (oldH - newH) / 2
        }));
      }
      return nextZoom;
    });
  }, [naturalSize, viewportWidth, viewportHeight]);

  const handleSliderZoomChange = (newZoom) => {
    if (naturalSize.width > 0) {
      const baseScale = Math.max(viewportWidth / naturalSize.width, viewportHeight / naturalSize.height);
      const oldW = naturalSize.width * baseScale * zoom;
      const oldH = naturalSize.height * baseScale * zoom;
      const newW = naturalSize.width * baseScale * newZoom;
      const newH = naturalSize.height * baseScale * newZoom;
      setPos(p => ({
        x: p.x + (oldW - newW) / 2,
        y: p.y + (oldH - newH) / 2
      }));
    }
    setZoom(newZoom);
  };

  // Confirm crop and export high-res canvas
  const handleConfirm = useCallback(() => {
    if (!naturalSize.width || !naturalSize.height) return;

    const canvas = document.createElement('canvas');
    const outWidth = isRect ? 360 : 400;
    const outHeight = isRect ? 480 : 400;
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext('2d');

    const scaleX = outWidth / viewportWidth;
    const scaleY = outHeight / viewportHeight;

    const baseScale = Math.max(viewportWidth / naturalSize.width, viewportHeight / naturalSize.height);
    const totalScale = baseScale * zoom;

    const renderW = naturalSize.width * totalScale;
    const renderH = naturalSize.height * totalScale;

    ctx.save();
    if (selectedShape === 'circle') {
      ctx.beginPath();
      ctx.arc(outWidth / 2, outHeight / 2, outWidth / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const drawX = pos.x * scaleX;
    const drawY = pos.y * scaleY;
    const drawW = renderW * scaleX;
    const drawH = renderH * scaleY;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      updatePersonal('avatar', croppedDataUrl);
      updatePersonal('avatarShape', selectedShape);
      closeCropModal();
      showToast('头像裁切完成！');
    };
    img.src = cropModal.imageUrl;
  }, [naturalSize, isRect, viewportWidth, viewportHeight, zoom, pos, selectedShape, cropModal.imageUrl, updatePersonal, closeCropModal, showToast]);

  if (!cropModal.isOpen) return null;

  const baseScale = naturalSize.width ? Math.max(viewportWidth / naturalSize.width, viewportHeight / naturalSize.height) : 1;
  const currentRenderW = naturalSize.width * baseScale * zoom;
  const currentRenderH = naturalSize.height * baseScale * zoom;

  return (
    <div className="crop-modal" style={{ display: 'flex' }}>
      <div className="crop-modal-backdrop" onClick={closeCropModal} />
      <div className="crop-modal-content" style={{ width: isRect ? 380 : 360 }}>
        <h3 className="crop-title">裁切与适配头像</h3>

        {/* Shape Switcher */}
        <div className="crop-shape-selector">
          {AVATAR_SHAPES.map(s => (
            <button
              key={s.id}
              type="button"
              className={`crop-shape-btn ${selectedShape === s.id ? 'active' : ''}`}
              onClick={() => handleShapeChange(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Viewport */}
        <div
          ref={viewportRef}
          className={`crop-viewport shape-${selectedShape}`}
          style={{
            width: viewportWidth,
            height: viewportHeight,
            borderRadius: selectedShape === 'circle' ? '50%' : selectedShape === 'square' ? '12px' : '8px'
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
        >
          <img
            src={cropModal.imageUrl}
            alt="Crop target"
            className="crop-image"
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              width: currentRenderW > 0 ? `${currentRenderW}px` : 'auto',
              height: currentRenderH > 0 ? `${currentRenderH}px` : 'auto',
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          />
          <div
            className="crop-mask-ring"
            style={{
              borderRadius: selectedShape === 'circle' ? '50%' : selectedShape === 'square' ? '12px' : '8px'
            }}
          />
        </div>

        <div className="crop-hint">支持鼠标拖拽平移、滚轮缩放</div>

        {/* Zoom Controls */}
        <div className="crop-zoom-row">
          <Minimize2 size={16} />
          <input
            type="range"
            id="crop-zoom"
            min="0.3"
            max="3.5"
            step="0.01"
            value={zoom}
            onChange={(e) => handleSliderZoomChange(parseFloat(e.target.value))}
          />
          <Maximize2 size={16} />
          <button
            type="button"
            className="crop-reset-btn"
            title="重置居中"
            onClick={() => {
              setZoom(1);
              if (naturalSize.width > 0) {
                resetToCenter(naturalSize.width, naturalSize.height, viewportWidth, viewportHeight, 1);
              }
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Actions */}
        <div className="crop-actions">
          <button className="btn btn-secondary" onClick={closeCropModal}>取消</button>
          <button className="btn btn-primary" onClick={handleConfirm}>确认使用此头像</button>
        </div>
      </div>
    </div>
  );
}
