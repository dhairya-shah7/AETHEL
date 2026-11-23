import gradio as gr
import uvicorn
from verde_cloud.server import app as fastapi_app

# Support Hugging Face ZeroGPU if active
try:
    import spaces
    @spaces.GPU
    def zero_gpu_probe():
        return "ZeroGPU Active"
except Exception:
    pass

# 1. Mount a clean status block for the Space UI
with gr.Blocks(title="AETHEL Real Silicon Engine API") as demo:
    gr.Markdown("""
    # ⚡ AETHEL Autonomous GreenOps Engine
    **Host Environment:** 2 vCPU · 16 GB Cloud RAM · Linux Kernel  
    **Capabilities:** Genuine PyTorch Dynamic INT8 Quantization, RAPL Emulation, and Google Borg Trace Replay.
    
    *Live API endpoints active at `/api/health`, `/api/engine/benchmark`, and `/api/trace/frame`.*
    """)

# 2. Mount Gradio directly onto FastAPI
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=False)
