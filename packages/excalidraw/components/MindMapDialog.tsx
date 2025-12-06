import { useState, useRef } from "react";

import { t } from "../i18n";
import { Dialog } from "./Dialog";
import { useApp } from "./App";
import { ArrowRightIcon, MagicIcon } from "./icons";

import "./MindMapDialog.scss";

interface MindMapDialogProps {
  onCloseRequest(): void;
}

export const MindMapDialog = ({ onCloseRequest }: MindMapDialogProps) => {
  const app = useApp();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setMindMapData(null);

    try {
      // 预留调用后端API的代码
      // 这里将调用后端API生成思维导图
      try {
        const response = await fetch("/api/mindmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMindMapData(data.mindMap);
      } catch (apiErr) {
        // 后端API不可用时，使用模拟数据
        console.log("API不可用，使用模拟数据");
        
        // 模拟思维导图数据
        const mockMindMap = {
          mindMap: `# ${prompt}\n` +
            `- 核心概念\n` +
            `  - 定义\n` +
            `  - 特点\n` +
            `- 相关理论\n` +
            `  - 理论1\n` +
            `  - 理论2\n` +
            `- 应用领域\n` +
            `  - 领域1\n` +
            `  - 领域2\n` +
            `- 未来发展\n` +
            `  - 趋势1\n` +
            `  - 趋势2\n`
        };
        
        setMindMapData(mockMindMap.mindMap);
      }
      
      // 这里可以添加将思维导图数据插入到编辑器的代码
      // app.insertElements(...);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成思维导图失败");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      className="mindmap-dialog"
      onCloseRequest={onCloseRequest}
      size="regular"
      title={t("toolBar.aiMindMap")}
      autofocus={false}
    >
      <div className="mindmap-dialog-content">
        <div className="mindmap-dialog-input-section">
          <label htmlFor="mindmap-prompt">{t("labels.prompt")}</label>
          <textarea
            id="mindmap-prompt"
            className="mindmap-dialog-textarea"
            placeholder="输入您的思维导图提示..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            disabled={isGenerating}
          />
        </div>

        <div className="mindmap-dialog-actions">
          <button
            className="mindmap-dialog-generate-button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="mindmap-dialog-loading-spinner"></span>
                {t("buttons.loading")}
              </>
            ) : (
              <>
                {MagicIcon}
                {t("buttons.generate")}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mindmap-dialog-error">
            {error}
          </div>
        )}

        {mindMapData && (
          <div className="mindmap-dialog-result">
            <h3>{t("labels.preview")}</h3>
            <div className="mindmap-dialog-result-content">
              {/* 这里可以添加思维导图预览组件 */}
              <pre>{mindMapData}</pre>
            </div>
            <button
              className="mindmap-dialog-insert-button"
              onClick={() => {
                // 这里可以添加将思维导图插入到编辑器的代码
                console.log("Inserting mind map...");
                onCloseRequest();
              }}
            >
              {ArrowRightIcon}
              {t("buttons.insert")}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export const MindMapDialogTrigger = () => {
  const app = useApp();
  const appState = app.state;

  if (appState.openDialog?.name !== "mindmap") {
    return null;
  }

  return (
    <MindMapDialog
      onCloseRequest={() => {
        app.setOpenDialog(null);
      }}
    />
  );
};
