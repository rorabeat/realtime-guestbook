'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Mode = 'upload' | 'drawing';

export default function GuestbookForm() {
  const [mode, setMode] = useState<Mode>('upload');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState('#1f2937');
  const [lineWidth, setLineWidth] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const startDrawing = (x: number, y: number) => {
    drawingRef.current = true;
    draw(x, y);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    setPreview(canvasRef.current?.toDataURL('image/png') ?? null);
  };

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMode('upload');
  };

  const clearAll = () => {
    setAuthor(''); setContent(''); setError(''); setFile(null); setPreview(null);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const submit = async () => {
    if (!author.trim() || !content.trim()) return setError('이름과 메시지를 입력하세요.');
    if (!preview) return setError('이미지를 첨부하거나 그림을 그려주세요.');
    setLoading(true); setError('');
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
      let blob: Blob;
      if (mode === 'upload' && file) blob = file;
      else {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('캔버스를 찾을 수 없습니다.');
        blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('이미지 변환 실패'))), 'image/png')
        );
      }
      const { error: uploadError } = await supabase.storage.from('guestbook-images').upload(fileName, blob, {
        upsert: false,
        contentType: 'image/png'
      });
      if (uploadError) throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
      const { data } = supabase.storage.from('guestbook-images').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('guestbook').insert({
        author: author.trim(),
        content: content.trim(),
        image_url: data.publicUrl,
        image_type: mode
      });
      if (insertError) throw new Error(`등록 실패: ${insertError.message}`);
      clearAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally { setLoading(false); }
  };

  return <main className="container">
    <h1>전자 방명록</h1>
    <div className="card">
      <div className="toolbar">
        <input type="file" accept="image/*" onChange={onUpload} />
        <button onClick={() => setMode('drawing')}>그림 모드</button>
        <a href="/board" className="btn">보드 보기</a>
      </div>
      <div className="layout">
        <div>
          <label>이름</label><input value={author} onChange={(e) => setAuthor(e.target.value)} />
          <label>메시지</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          <div className="buttonRow">
            <button onClick={clearAll}>지우기</button>
            <button disabled={loading} onClick={submit}>{loading ? '등록 중...' : '등록'}</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <div>
          {mode === 'drawing' && <div className="drawTools">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="range" min={1} max={20} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
          </div>}
          <canvas
            ref={canvasRef}
            width={560}
            height={380}
            className="canvas"
            onMouseDown={(e) => startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
            onMouseMove={(e) => drawingRef.current && draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const t = e.touches[0];
              startDrawing(t.clientX - rect.left, t.clientY - rect.top);
            }}
            onTouchMove={(e) => {
              if (!drawingRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const t = e.touches[0];
              draw(t.clientX - rect.left, t.clientY - rect.top);
            }}
            onTouchEnd={stopDrawing}
          />
          {preview && <img src={preview} alt="preview" className="preview" />}
        </div>
      </div>
    </div>
  </main>;
}
