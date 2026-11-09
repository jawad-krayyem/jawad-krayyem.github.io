import type { Project } from './projects';

export type ProjectEnhancement = {
  audiences: string[];
  architecture: { label: string; detail: string; file: string }[];
  decisions: { choice: string; tradeoff: string }[];
  codeMap: { label: string; path: string; detail: string }[];
  phases: string[];
  privacy: string;
  benchmark: string;
  contactSubject: string;
};
const make = (project: Project, data: Omit<ProjectEnhancement, 'architecture'> & { architecture: { label: string; detail: string; file: string }[] }) => ({
  ...data,
  architecture: data.architecture.map(node => ({ ...node, file: `${project.repository}/blob/main/${node.file}` })),
});

export function getProjectEnhancement(project: Project): ProjectEnhancement {
  switch (project.slug) {
    case 'insightpilot': return make(project, {
      audiences: ['AI / RAG', 'Local-first software', 'Document workflows'],
      architecture: [
        { label: 'React interface', detail: 'Document library, conversations, source inspection, and streamed status.', file: 'frontend/main.tsx' },
        { label: 'FastAPI service', detail: 'Coordinates ingestion, retrieval, reranking, and streamed responses.', file: 'backend/main.py' },
        { label: 'Qdrant + FlashRank', detail: 'Fuses dense and BM25 search, restores parent context, then reranks locally.', file: 'backend/main.py' },
        { label: 'Ollama models', detail: 'Runs embeddings and generation on the user’s machine in the documented default workflow.', file: 'README.md' },
      ],
      decisions: [
        { choice: 'Keep model calls local by default.', tradeoff: 'Documents stay in a local workflow, while users must install and run model and vector services.' },
        { choice: 'Retrieve focused child chunks and restore parent context.', tradeoff: 'Search can target detail without discarding the surrounding passage.' },
        { choice: 'Combine dense and sparse retrieval before reranking.', tradeoff: 'Different matching signals complement each other, with added local compute and infrastructure.' },
      ],
      codeMap: [
        { label: 'Streaming UI and source references', path: 'frontend/main.tsx', detail: 'Client-side chat, document library, and retrieval feedback.' },
        { label: 'API and retrieval orchestration', path: 'backend/main.py', detail: 'FastAPI endpoints and local RAG workflow.' },
        { label: 'Startup and preflight checks', path: 'main.py', detail: 'Launcher for the local application.' },
      ],
      phases: ['Add documents to the library', 'Retrieve with dense and BM25 search', 'Rerank and restore parent context', 'Stream an answer with source references'],
      privacy: 'The repository describes local Ollama and Qdrant processing with no cloud inference calls in the default workflow. This portfolio sample uses synthetic text only and sends no query or document to the app.',
      benchmark: 'No comparable end-to-end performance results are published here. A local report should record model versions, collection size, hardware, cold-start time, and the median of repeated warm queries.',
      contactSubject: 'Question about InsightPilot',
    });
    case 'sdxl-studio': return make(project, {
      audiences: ['Image generation', 'Local AI', 'Creative tooling'],
      architecture: [
        { label: 'Browser studio', detail: 'Generation modes, prompts, controls, history, and gallery.', file: 'frontend/main.tsx' },
        { label: 'Flask service', detail: 'Loads the requested pipeline and manages generation jobs.', file: 'backend/main.py' },
        { label: 'Diffusers pipelines', detail: 'Text-to-image, image-to-image, inpainting, ControlNet, and an optional refiner.', file: 'README.md' },
        { label: 'Local model storage', detail: 'Model cache, generated images, and LoRA assets use the local storage tree.', file: 'README.md' },
      ],
      decisions: [
        { choice: 'Bring four image workflows into one studio.', tradeoff: 'History and controls stay together, while each mode keeps distinct model requirements.' },
        { choice: 'Support CPU and CUDA paths.', tradeoff: 'More machines can run the app, although CPU generation can be slow.' },
        { choice: 'Keep models and generated assets outside source folders.', tradeoff: 'Large local files do not become part of source history.' },
      ],
      codeMap: [
        { label: 'Studio UI and generation controls', path: 'frontend/main.tsx', detail: 'Mode selection, prompts, and generation history.' },
        { label: 'Pipeline loading and generation jobs', path: 'backend/main.py', detail: 'Flask routes and model orchestration.' },
        { label: 'LoRA training workflow', path: 'scripts/train_lora_sdxl.py', detail: 'Background training entry point.' },
      ],
      phases: ['Choose a generation mode', 'Load its local model pipeline', 'Generate or edit an image', 'Review settings and history'],
      privacy: 'The README describes local inference and local storage. This preview is static and sends no prompt or image and does not run a model.',
      benchmark: 'No comparable generation-speed results are published here. A useful measurement names the model, image size, steps, GPU and VRAM, driver, warm-up policy, and repeated-run median.',
      contactSubject: 'Question about SDXL Studio',
    });
    case 'interview-room': return make(project, {
      audiences: ['Voice interfaces', 'Realtime systems', 'Local AI'],
      architecture: [
        { label: 'Browser audio', detail: 'MediaRecorder captures input and Web Audio schedules speech playback.', file: 'frontend/index.tsx' },
        { label: 'FastAPI + WebSocket', detail: 'Streams audio and conversation events to local services.', file: 'backend/main.py' },
        { label: 'VAD + speech recognition', detail: 'Silero VAD detects turns; faster-whisper transcribes speech.', file: 'backend/main.py' },
        { label: 'Ollama + Kokoro', detail: 'A local language model responds, then Kokoro synthesizes speech.', file: 'readme.md' },
      ],
      decisions: [
        { choice: 'Run speech and language services locally.', tradeoff: 'Audio stays in a local workflow, while setup requires several system dependencies.' },
        { choice: 'Schedule speech in sentence-sized pieces.', tradeoff: 'Playback can begin sooner and can stop when the speaker interrupts.' },
        { choice: 'Use WebSockets for audio and turn events.', tradeoff: 'A continuous connection supports streaming, but connection state needs careful handling.' },
      ],
      codeMap: [
        { label: 'Browser capture and playback queue', path: 'frontend/index.tsx', detail: 'Microphone, transcript, and Web Audio interaction.' },
        { label: 'Realtime backend pipeline', path: 'backend/main.py', detail: 'WebSocket, voice activity, transcription, and responses.' },
        { label: 'Setup and dependency guide', path: 'readme.md', detail: 'Local installation and platform-specific setup.' },
      ],
      phases: ['Capture a browser audio stream', 'Detect the end of a turn', 'Transcribe and respond locally', 'Schedule speech and handle interruption'],
      privacy: 'The repository describes a local browser-to-Python workflow without cloud APIs or accounts. This preview uses a prerecorded synthetic transcript and never asks for microphone access.',
      benchmark: 'No comparable turn-latency measurements are published here. Measure endpointing, transcription, first response audio, and interruption stop time separately on named hardware.',
      contactSubject: 'Question about The Interview Room',
    });
    default: return make(project, {
      audiences: ['Document workflows', 'Applied AI', 'Validated extraction'],
      architecture: [
        { label: 'Streamlit workbench', detail: 'Provides extraction, document Q&A, and chat workflows.', file: 'app.py' },
        { label: 'Extraction and schemas', detail: 'Parses source files, validates structured results, and checks domain constraints.', file: 'src/datheon_ai/extraction.py' },
        { label: 'Chroma + local Ollama', detail: 'Stores local document vectors and supplies local embeddings and generation by default.', file: 'src/datheon_ai/rag.py' },
        { label: 'Pydantic validation', detail: 'Validates output structure and applies additional invoice consistency checks.', file: 'src/datheon_ai/schemas.py' },
      ],
      decisions: [
        { choice: 'Validate extracted fields and invoice arithmetic separately.', tradeoff: 'A structurally valid response still needs domain checks before it can be trusted.' },
        { choice: 'Use Ollama by default and block cloud requests unless enabled.', tradeoff: 'The default is local-first; the optional Gemini integration needs separate live verification.' },
        { choice: 'Preserve PDF page references in document answers.', tradeoff: 'Readers can inspect where an answer came from instead of treating it as unsupported text.' },
      ],
      codeMap: [
        { label: 'Streamlit application', path: 'app.py', detail: 'Main workbench entry point.' },
        { label: 'Extraction and validation', path: 'src/datheon_ai/extraction.py', detail: 'Structured output and repair flow.' },
        { label: 'Document retrieval', path: 'src/datheon_ai/rag.py', detail: 'PDF retrieval and grounded answers.' },
        { label: 'Extraction examples', path: 'tests/test_extraction.py', detail: 'Validation tests in the source repository.' },
      ],
      phases: ['Parse the source document', 'Validate or retrieve evidence', 'Run a local model workflow', 'Inspect cited or structured output'],
      privacy: 'The README states Ollama runs locally by default and cloud calls are blocked unless explicitly enabled. The sample handbook is fictional. This portfolio demo stays in the browser.',
      benchmark: 'No comparable end-to-end performance results are published here. A useful report identifies the local model, document count, hardware, cold-start behavior, and median query time.',
      contactSubject: 'Question about Datheon AI Workbench',
    });
  }
}
