import * as React from "react"
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, Image, AlertCircle } from "lucide-react"

interface FileUploadProps {
  onFileChange: (files: FileList | null) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
  placeholder?: string
  showPreview?: boolean
  files?: File[]
  onRemoveFile?: (index: number) => void
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    onFileChange,
    accept = "*/*",
    multiple = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    maxFiles = 5,
    disabled = false,
    className,
    placeholder = "Click to upload or drag and drop files here",
    showPreview = true,
    files = [],
    onRemoveFile,
    ...props
  }, ref) => {
    const [isDragActive, setIsDragActive] = React.useState(false)
    const [uploadProgress, setUploadProgress] = React.useState<number[]>([])
    const [errors, setErrors] = React.useState<string[]>([])
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!)

    const validateFile = (file: File): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`
      }
      return null
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleFileChange = (newFiles: FileList | null) => {
      if (!newFiles) return

      const fileArray = Array.from(newFiles)
      const validationErrors: string[] = []

      // Validate total number of files
      if (multiple && files.length + fileArray.length > maxFiles) {
        validationErrors.push(`Maximum ${maxFiles} files allowed`)
      }

      // Validate each file
      fileArray.forEach(file => {
        const error = validateFile(file)
        if (error) validationErrors.push(error)
      })

      setErrors(validationErrors)

      if (validationErrors.length === 0) {
        onFileChange(newFiles)
        // Simulate upload progress
        const progressArray = fileArray.map(() => 0)
        setUploadProgress(progressArray)
        
        fileArray.forEach((_, index) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            setUploadProgress(prev => {
              const newProgress = [...prev]
              newProgress[index] = progress
              return newProgress
            })
            
            if (progress >= 100) {
              clearInterval(interval)
            }
          }, 100)
        })
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)
      
      if (!disabled) {
        const droppedFiles = e.dataTransfer.files
        handleFileChange(droppedFiles)
      }
    }

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click()
      }
    }

    const handleRemoveFile = (index: number) => {
      if (onRemoveFile) {
        onRemoveFile(index)
      }
    }

    const getFileIcon = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
        return <Image className="w-4 h-4" />
      }
      return <FileText className="w-4 h-4" />
    }

    return (
      <div className={cn("space-y-4", className)}>
        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
            isDragActive && !disabled
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(e.target.files)}
            {...props}
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            <Upload 
              className={cn(
                "w-8 h-8 mb-2 transition-transform duration-200",
                isDragActive && "scale-110"
              )}
            />
            <p className="text-sm text-muted-foreground mb-1">
              {placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept !== "*/*" && `Accepted formats: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {multiple && maxFiles && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-destructive animate-in fade-in-0 duration-200"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            ))}
          </div>
        )}

        {/* File Preview */}
        {showPreview && files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Files:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg animate-in fade-in-0 duration-200"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Progress Bar */}
                    {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress[index]}%` }}
                        />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }