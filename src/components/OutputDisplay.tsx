import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Clipboard,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckSquare,
  Square,
  Download,
  Filter,
} from "lucide-react"
import { FILE_EXTENSIONS, FileExtension } from "@/constants/fileExtensions"

interface OutputDisplayProps {
  content: string
  loading: boolean
  error: string | null
}

const OutputDisplay = ({ content, loading, error }: OutputDisplayProps) => {
  const { toast } = useToast()
  const [files, setFiles] = useState<
    { name: string; content: string; selected: boolean }[]
  >([])
  const [allSelected, setAllSelected] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [copiedFiles, setCopiedFiles] = useState<Record<string, boolean>>({})
  // extension-filter state
  const [extensionItems, setExtensionItems] = useState<
    FileExtension[]
  >([])
  const [selectedExtensions, setSelectedExtensions] = useState<
    Set<string>
  >(new Set())
  const [searchExt, setSearchExt] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const filterBtnRef = useRef<HTMLButtonElement>(null)

  // Parse the big LLM string into files[]
  useEffect(() => {
    const fileRegex =
      /File: (.*?)\n={80}\n([\s\S]*?)(?=\n={80}\n\n|$)/g
    const parsed: {
      name: string
      content: string
      selected: boolean
    }[] = []
    let m
    while ((m = fileRegex.exec(content)) !== null) {
      parsed.push({ name: m[1], content: m[2], selected: true })
    }
    setFiles(parsed)
    setAllSelected(true)
    // build extension list from parsed
    const exts = new Set(
      parsed.map((f) =>
        f.name.includes(".")
          ? f.name.slice(f.name.lastIndexOf("."))
          : ""
      )
    )
    const items: FileExtension[] = Array.from(exts).map((ext) => {
      const known = FILE_EXTENSIONS.find((e) => e.ext === ext)
      return { ext, label: known ? known.label : ext || "[no ext]" }
    })
    items.sort((a, b) => a.label.localeCompare(b.label))
    setExtensionItems(items)
    setSelectedExtensions(new Set(items.map((i) => i.ext)))
  }, [content])

  // close filter dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        showFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => void document.removeEventListener("mousedown", onClick)
  }, [showFilter])

  // toggle one extension in the filter
  const toggleExtension = (ext: string, checked: boolean) => {
    setSelectedExtensions((prev) => {
      const next = new Set(prev)
      if (checked) next.add(ext)
      else next.delete(ext)
      return next
    })
  }

  // select/deselect all files
  const toggleSelectAll = (checked: boolean) => {
    setAllSelected(checked)
    setFiles((f) => f.map((x) => ({ ...x, selected: checked })))
    toast({
      title: checked ? "All files selected" : "All files deselected",
      description: checked
        ? `${files.length} files selected`
        : "You can select individually",
      duration: 1500,
    })
  }

  // individual file select
  const toggleFileSelection = (name: string, checked: boolean) => {
    setFiles((f) =>
      f.map((x) =>
        x.name === name ? { ...x, selected: checked } : x
      )
    )
    const updated = files.map((x) =>
      x.name === name ? { ...x, selected: checked } : x
    )
    setAllSelected(updated.every((x) => x.selected))
  }

  // copy selected files to clipboard
  const copyToClipboard = async () => {
    const selected = files.filter(
      (f) => f.selected && selectedExtensions.has(
        f.name.includes(".")
          ? f.name.slice(f.name.lastIndexOf("."))
          : ""
      )
    )
    if (!selected.length) return
    try {
      const txt = selected
        .map(
          (f) =>
            `File: ${f.name}\n${"=".repeat(
              80
            )}\n${f.content}\n${"=".repeat(80)}\n\n`
        )
        .join("")
      await navigator.clipboard.writeText(txt)
      setIsCopied(true)
      toast({
        title: "Copied to clipboard",
        description: `${selected.length} files copied`,
        duration: 3000,
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // download selected as TXT
  const downloadSelectedFiles = () => {
    const selected = files.filter(
      (f) => f.selected && selectedExtensions.has(
        f.name.includes(".")
          ? f.name.slice(f.name.lastIndexOf("."))
          : ""
      )
    )
    if (!selected.length) return
    try {
      const txt = selected
        .map(
          (f) =>
            `File: ${f.name}\n${"=".repeat(
              80
            )}\n${f.content}\n${"=".repeat(80)}\n\n`
        )
        .join("")
      const blob = new Blob([txt], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "selected_files.txt"
      a.click()
      URL.revokeObjectURL(url)
      setIsDownloading(true)
      toast({
        title: "Downloaded",
        description: `${selected.length} files downloaded`,
        duration: 3000,
      })
      setTimeout(() => setIsDownloading(false), 2000)
    } catch {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // copy single file content
  const copyFileContent = async (
    name: string,
    content: string
  ) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFiles((c) => ({ ...c, [name]: true }))
      toast({
        title: "Copied file",
        description: `${name} copied`,
        duration: 2000,
      })
      setTimeout(
        () =>
          setCopiedFiles((c) => ({ ...c, [name]: false })),
        2000
      )
    } catch {
      toast({
        title: "Copy failed",
        description: "Try again",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <div className="border rounded-lg p-6 mt-8 bg-muted/20
                      flex items-center justify-center h-48
                      animate-pulse">
        <div className="flex flex-col items-center">
          <div
            className="w-8 h-8 border-4 border-primary
                       border-t-transparent rounded-full
                       animate-spin mb-4"
          />
          <p className="text-muted-foreground">
            Fetching repository contents…
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-destructive/50
                      rounded-lg p-6 mt-8 bg-destructive/5
                      animate-fade-in">
        <div className="flex items-start">
          <AlertCircle
            className="text-destructive mr-3 h-5 w-5 mt-0.5"
          />
          <div>
            <h3 className="text-destructive font-medium text-lg">
              Error
            </h3>
            <p className="text-destructive/80 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // filter & map the final list
  const visibleFiles = files.filter((f) => {
    const ext = f.name.includes(".")
      ? f.name.slice(f.name.lastIndexOf("."))
      : ""
    return selectedExtensions.has(ext)
  })
  if (!files.length) return null

  return (
    <div className="mt-8 animate-fade-in">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">
          Repository Contents
        </h3>

        <div className="relative flex items-center gap-2">
          {/* Filter button */}
          <Button
            ref={filterBtnRef}
            variant="outline"
            size="sm"
            onClick={() => setShowFilter((v) => !v)}
            className="flex items-center gap-1.5"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>

          {showFilter && (
            <div
              ref={filterRef}
              className="absolute right-0 mt-2 w-64
                         bg-card border border-border
                         rounded-md shadow-lg z-50 p-3"
            >
              <Input
                placeholder="Search extensions…"
                value={searchExt}
                onChange={(e) =>
                  setSearchExt(e.target.value)
                }
                className="mb-2"
              />
              <div className="max-h-48 overflow-auto">
                {extensionItems
                  .filter(
                    (it) =>
                      it.label
                        .toLowerCase()
                        .includes(searchExt.toLowerCase()) ||
                      it.ext
                        .toLowerCase()
                        .includes(searchExt.toLowerCase())
                  )
                  .map((it) => (
                    <label
                      key={it.ext}
                      className="flex items-center mb-1"
                    >
                      <Checkbox
                        checked={selectedExtensions.has(
                          it.ext
                        )}
                        onCheckedChange={(c) =>
                          toggleExtension(
                            it.ext,
                            c === true
                          )
                        }
                      />
                      <span className="ml-2 text-sm">
                        {it.label}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1.5 ${
              allSelected ? "bg-primary/10" : ""
            }`}
            onClick={() => toggleSelectAll(!allSelected)}
          >
            {allSelected ? (
              <>
                <CheckSquare className="h-4 w-4" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                Select All
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={copyToClipboard}
            disabled={
              isCopied || visibleFiles.length === 0
            }
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                Copy Selected
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={downloadSelectedFiles}
            disabled={
              isDownloading || visibleFiles.length === 0
            }
          >
            {isDownloading ? (
              <>
                <Check className="h-4 w-4" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download TXT
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Files list + expand/collapse */}
      <div className="border rounded-lg shadow-sm bg-card
                      transition-all duration-300
                      hover:shadow-md">
        <div className="p-4 flex justify-between items-center
                        bg-muted/50 rounded-t-lg">
          <h4 className="font-medium">
            Files ({visibleFiles.length})
          </h4>
          <Button
            variant="ghost"
            size="sm"
            className="transition-colors duration-200
                       hover:bg-muted"
            onClick={() => {
              const allExts = new Set(
                extensionItems.map((i) => i.ext)
              )
              // if all selected → deselect all; else select all
              const anyUnselected = Array.from(
                allExts
              ).some((ext) =>
                !selectedExtensions.has(ext)
              )
              if (anyUnselected) {
                setSelectedExtensions(allExts)
              } else {
                setSelectedExtensions(new Set())
              }
            }}
          >
            {Array.from(extensionItems).every((it) =>
              selectedExtensions.has(it.ext)
            )
              ? "Collapse All"
              : "Expand All"}
          </Button>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {visibleFiles.map((file, idx) => (
              <div
                key={idx}
                className="mb-2 last:mb-0"
              >
                <div
                  className="flex items-center justify-between
                             p-3 rounded-md bg-muted/30
                             hover:bg-muted/50
                             transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      id={`file-${idx}`}
                      checked={file.selected}
                      onCheckedChange={(c) =>
                        toggleFileSelection(
                          file.name,
                          c === true
                        )
                      }
                      className="transition-transform
                                 duration-200
                                 data-[state=checked]:scale-110"
                    />
                    <div
                      className="truncate font-mono text-sm
                                 cursor-pointer flex-1
                                 transition-colors duration-150
                                 hover:text-primary"
                      onClick={() => {
                        /* reuse your expand logic here */
                      }}
                    >
                      {file.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0
                                 transition-transform duration-150
                                 hover:scale-110"
                      onClick={() =>
                        copyFileContent(
                          file.name,
                          file.content
                        )
                      }
                    >
                      {copiedFiles[file.name] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0
                                 transition-transform duration-150
                                 hover:scale-110"
                      onClick={() => {
                        /* reuse your expand logic here */
                      }}
                    >
                      {/* Replace with your chevrons */}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default OutputDisplay
