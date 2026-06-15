import { useRef, useState } from 'react'
import { uploadMedia } from '../services/storageService'

/**
 * MediaUploader
 * Props:
 *   token      — (Legacy admin JWT, ignored in Firebase)
 *   onUploaded — callback(uploadedArray)
 */
export default function MediaUploader({ token, onUploaded }) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [label,     setLabel]     = useState('')
  const [progress,  setProgress]  = useState([])
  const [error,     setError]     = useState('')
  const inputRef = useRef(null)

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    const arr = Array.from(files)
    setProgress(arr.map(f => ({ name: f.name, pct: 0 })))
    setUploading(true)
    setError('')

    try {
      const uploadPromises = arr.map(async (file, index) => {
        return uploadMedia(file, label, (pct) => {
          setProgress(prev => prev.map((p, i) => i === index ? { ...p, pct } : p))
        })
      })
      const uploadedRecords = await Promise.all(uploadPromises)
      onUploaded && onUploaded(uploadedRecords)
      setProgress([])
      setLabel('')
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="media-uploader">
      {/* Label input */}
      <div className="form-field" style={{ marginBottom: '1rem' }}>
        <label>Label / Tag (optional)</label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Championships 2024, Instructors, Events"
          style={{ width: '100%' }}
        />
      </div>

      {/* Drop zone */}
      <div
        className={`media-dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <div className="media-dropzone-inner">
          <span style={{ fontSize: '2.5rem' }}>📁</span>
          <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>
            {dragging ? 'Drop files here!' : 'Drag & drop images or videos here'}
          </p>
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
            or click to browse — JPG, PNG, WebP, GIF, MP4, WebM · Max 200 MB/file
          </p>
        </div>
      </div>

      {/* Progress bars */}
      {progress.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {progress.map((p, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-2)' }}>{p.name}</span>
                <span style={{ color: 'var(--gold)' }}>{p.pct}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: '#ef4444', marginTop: '0.75rem', fontSize: '0.9rem' }}>❌ {error}</p>}
    </div>
  )
}
