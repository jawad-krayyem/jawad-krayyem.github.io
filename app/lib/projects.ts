export type Project = {
  slug: string; name: string; kicker: string; category: 'Documents' | 'Voice & audio' | 'Image generation';
  summary: string; tags: string[]; color: string; image: string; imageAlt: string;
  repository?: string; sourceLabel: string; status: string; problem: string;
  approach: string[]; features: string[]; limitation: string; setup: string;
  pipeline: string[]; video?: string;
};

export const projects: Project[] = [
  {
    slug: 'insightpilot', name: 'InsightPilot', kicker: 'Your documents. Your machine.', category: 'Documents',
    summary: 'A local document assistant combining hybrid retrieval, reranking, and streamed answers with source references.',
    tags: ['Python', 'React', 'Ollama', 'Qdrant'], color: 'sage',
    image: '/images/projects/insightpilot.webp', imageAlt: 'InsightPilot document assistant interface shown with sample document content',
    repository: 'https://github.com/jawad-krayyem/insightpilot-RAG', sourceLabel: 'Interface preview · sample data', status: 'Open source · runs locally',
    problem: 'A useful document assistant needs more than a chat box. It needs to retrieve relevant evidence, show where answers came from, and keep the underlying files on the user’s machine.',
    approach: [
      'Split documents into parent and child chunks so retrieval can match precise passages and still return useful surrounding context.',
      'Combine dense and sparse search in Qdrant, then rerank retrieved passages with a local cross-encoder before constructing the answer context.',
      'Stream reasoning and answers separately in a React interface with a document library, multiple conversations, and inspectable sources.',
    ],
    features: ['Hybrid dense and sparse retrieval', 'Local cross-encoder reranking', 'Document and conversation management', 'Streaming answer and reasoning channels', 'Local Ollama model selection'],
    limitation: 'Model responses still require judgment. Retrieval and prompting help ground an answer; they do not guarantee that every generated statement is correct. Preview media uses synthetic responses, not live inference.',
    setup: 'Requires Python, Ollama, and Qdrant. Follow the repository README for model and service setup.',
    pipeline: ['Documents', 'Hybrid search', 'Rerank', 'Grounded response'], video: '/demos/insightpilot.webm',
  },
  {
    slug: 'sdxl-studio', name: 'SDXL Studio', kicker: 'An image studio that stays local', category: 'Image generation',
    summary: 'One workspace for text-to-image, image-to-image, inpainting, ControlNet, and LoRA experiments.',
    tags: ['Python', 'Flask', 'React', 'Diffusers'], color: 'peach',
    image: '/images/projects/sdxl-studio.webp', imageAlt: 'SDXL Studio interface with generation controls and its canvas',
    repository: 'https://github.com/jawad-krayyem/SDXL', sourceLabel: 'Interface preview · sample data', status: 'Open source · runs locally',
    problem: 'Image generation workflows involve more than entering a prompt. Editing an existing image, controlling its structure, and managing model variants should fit in a coherent workspace.',
    approach: ['Expose four generation modes through one React interface served by a Python Flask backend.', 'Use Stable Diffusion XL pipelines with optional refiner, Canny ControlNet, and adjustable LoRA loading.', 'Record generation parameters alongside a browsable history, and expose LoRA training as a background workflow.'],
    features: ['Four image generation modes', 'Optional SDXL refiner', 'LoRA loading and training controls', 'Generation history and gallery', 'CPU and CUDA execution paths'],
    limitation: 'SDXL requires substantial model downloads and hardware resources. CPU execution is supported but can be slow. Preview images do not demonstrate measured generation speed.',
    setup: 'Requires Python and SDXL model weights. A compatible NVIDIA GPU is recommended. Installation details are in the README.',
    pipeline: ['Prompt or image', 'Generation mode', 'SDXL pipeline', 'Local gallery'], video: '/demos/sdxl-studio.webm',
  },
  {
    slug: 'interview-room', name: 'The Interview Room', kicker: 'A conversation with a local AI host', category: 'Voice & audio',
    summary: 'A voice-to-voice interviewer connecting browser audio to local speech recognition, an LLM, and speech synthesis.',
    tags: ['Python', 'FastAPI', 'React', 'WebSocket'], color: 'sand',
    image: '/images/projects/interview-room.webp', imageAlt: 'The Interview Room interface with microphone controls and conversation transcript area',
    repository: 'https://github.com/jawad-krayyem/ai-interview', sourceLabel: 'Interface preview · sample data', status: 'Public source · runs locally',
    problem: 'A spoken conversation depends on timing: detecting the end of a turn, streaming a response, playing audio smoothly, and allowing the speaker to interrupt.',
    approach: ['Capture browser audio and stream it over a WebSocket to a FastAPI backend.', 'Use voice activity detection and faster-whisper for speech recognition, then send the transcript to a local Ollama model.', 'Synthesize sentence-sized audio with Kokoro and schedule playback in the browser, clearing queued audio when an interruption is detected.'],
    features: ['Browser microphone input', 'Local speech-to-text and text-to-speech', 'Streaming WebSocket connection', 'Conversation transcript', 'Interruption-aware audio playback'],
    limitation: 'Requires microphone permission and local speech/model dependencies. The portfolio preview does not activate your microphone or connect to an AI backend.',
    setup: 'Requires Python, Node.js, Ollama, ffmpeg, and speech dependencies. The repository documents the complete setup.',
    pipeline: ['Microphone', 'Speech to text', 'Local language model', 'Spoken response'],
  },
  {
    slug: 'datheon-workbench', name: 'Datheon AI Workbench', kicker: 'From documents to useful structure', category: 'Documents',
    summary: 'Validated JSON extraction, PDF questions with page citations, and a streaming Streamlit workbench.',
    tags: ['Python', 'LangChain', 'Pydantic', 'Streamlit'], color: 'blue',
    image: '/images/projects/datheon-workbench.svg', imageAlt: 'Architecture diagram connecting source documents to validation, retrieval, and cited responses',
    repository: 'https://github.com/jawad-krayyem/Datheon_Generative_AI_Internship', sourceLabel: 'Architecture overview', status: 'Open source · local-first',
    problem: 'Extracting a structured result and answering a document question are different problems. Both need explicit evidence and checks instead of accepting plausible output at face value.',
    approach: ['Define invoice and résumé schemas with Pydantic, validate structured output, and check invoice arithmetic independently.', 'Preserve PDF page references, store embeddings in Chroma, and show retrieved excerpts alongside answers.', 'Bring the workflows into one Streamlit interface, using Ollama locally by default and keeping optional cloud requests explicitly opt-in.'],
    features: ['Schema-validated JSON extraction', 'Independent invoice consistency checks', 'PDF retrieval with page references', 'Streaming Streamlit interface', 'Local Ollama inference by default'],
    limitation: 'Schema validity is not a guarantee of extraction accuracy. OCR is outside the documented extraction scope. The optional Gemini adapter is documented as requiring a live integration check.',
    setup: 'Install the Python project dependencies and local Ollama models, then run the Streamlit app as documented in the repository.',
    pipeline: ['Source documents', 'Validate or retrieve', 'Local model', 'Inspectable output'],
  },
];

export const skills = [
  { title: 'Interfaces', items: ['React', 'Next.js', 'TypeScript', 'Responsive CSS'] },
  { title: 'Backend & data', items: ['Python', 'FastAPI', 'Flask', 'Pydantic'] },
  { title: 'Applied AI', items: ['Ollama', 'Retrieval systems', 'LangChain', 'Diffusers'] },
  { title: 'Systems & tooling', items: ['Qdrant', 'Chroma', 'WebSocket', 'Git & GitHub'] },
];
