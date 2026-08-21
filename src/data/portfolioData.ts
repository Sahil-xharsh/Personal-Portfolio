import { Transmission, CareerMilestone, TechGroup } from '../types';

export const PERSONAL_INFO = {
  name: 'Sahil Harsh',
  title: 'AI/ML Engineer',
  specialization: 'Multimodal AI, Deep Learning, MLOps',
  tagline: 'Working with multimodal AI through model fine-tuning, RAG, agents, inference, and evaluation.',
  githubHandle: 'Sahil-xharsh',
  githubUrl: 'https://github.com/Sahil-xharsh',
  email: 'sahilharsh.dev@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/sahil-harsh-598b02288/',
  huggingFaceUrl: 'https://huggingface.co/Sahil-xharsh',
  kaggleUrl: 'https://www.kaggle.com/sahilxharsh',
  xUrl: 'https://x.com/Sahil_xharsh',
  location: 'India (Remote / Worldwide)',
  availability: 'Open for AI/ML Engineering roles, contracts, and full-time work',
  preferredDomains: ['Deep Learning & Multimodal AI', 'MLOps', 'ML Research'],
};

export const TRANSMISSIONS: Transmission[] = [
  {
    id: 'claw-agent',
    transmissionNumber: '01',
    title: 'ClawAgent',
    accentWord: 'research system',
    tagline: '',
    period: '2024 - 2025',
    status: 'ACTIVE',
    primaryDomain: 'AI Agents & LLMs',
    summary: 'A multi-layered blog-writing agent inspired by Claw Code\'s modular architecture and TOON-optimized prompting - built for lower token costs, higher reliability, and automatic review loops.',
    previewImage: '/clawagent-preview.png',
    originStory: 'Started as a simple tutorial project to build a blog-writing agent. After seeing the leaked Claude Code structure and a Korean developer\'s reimplementation of it, I adapted that modular structure into my own agent. Around the same time, I discovered TOON (Task-Oriented Output Normalization) and rebuilt the system with structured JSON prompts to cut token usage by ~40%.',
    architectureOverview: 'Orchestrated with LangGraph. Given a topic, it researches the web with Tavily, builds a structured outline, fans out to parallel writer agents, runs a Reviewer retry loop on weak sections, generates diagrams with Gemini, and streams real-time updates over Server-Sent Events (SSE).',
    buildPhases: [
      {
        phaseNumber: '1',
        title: 'Foundation Pipeline',
        description: 'Working sequential Researcher -> Writer pipeline built with LangGraph nodes passing state to each other.'
      },
      {
        phaseNumber: '2',
        title: 'Modular Architecture',
        description: 'Restructured into decoupled agents/, tools/, workflow/, and config/ layers (Claw Code pattern) for real scalability, independent debugging, and loop-forwarding.'
      },
      {
        phaseNumber: '3',
        title: 'Token Efficiency & TOON',
        description: 'Rewrote prompts in structured TOON/JSON schemas instead of raw natural language, cutting token usage by ~40% while improving output reliability.'
      }
    ],
    topologyFlow: [
      {
        stepNumber: '1',
        name: 'Topic Input & Web Research',
        description: 'Accepts the target subject and searches the web via Tavily API for fresh facts and references.'
      },
      {
        stepNumber: '2',
        name: 'Supervisor Outline Planning',
        description: 'Supervisor organizes the research into a clear outline with section-by-section requirements.'
      },
      {
        stepNumber: '3',
        name: 'Parallel Writer Fan-Out',
        description: 'LangGraph runs parallel writer agents to draft individual blog sections at the same time.'
      },
      {
        stepNumber: '4',
        name: 'Reviewer Critique & Rewrite Loop',
        description: 'A Reviewer agent reviews the drafts and triggers a one-pass rewrite on any weak sections.'
      },
      {
        stepNumber: '5',
        name: 'Gemini Diagram Generation',
        description: 'Image generation agent creates clear technical diagrams to explain key ideas.'
      },
      {
        stepNumber: '6',
        name: 'Markdown + PDF Assembly & SSE Stream',
        description: 'Compiles the final post into Markdown and PDF while streaming live progress events (node_start, node_end, evidence) over SSE.'
      }
    ],
    designDecisions: [
      {
        question: 'Why an architecture inspired by Claw Code and what to implement from it?',
        answer: 'A simple sequential agent works, but doesn\'t scale or debug easily. Claw Code\'s modular structure - separate agents/, tools/, workflow/, and config/ - lets me isolate and fix parts independently. It also enabled loop-forwarding so the Reviewer can send weak sections back for rewrites instead of a one-way pipeline, making it behave like a real system rather than just a demo.'
      },
      {
        question: 'Why use TOON (Task-Oriented Output Normalization)?',
        answer: 'TOON is not widely used yet because moving to JSON prompts takes extra setup. I used it here to test the tradeoff firsthand, reducing token usage by ~40% while getting clean, reliable output without filler conversation.'
      }
    ],
    specSnippet: {
      tabTitle: 'TOON SPEC CONFIG',
      fileName: 'claw_agent_config.json',
      language: 'json',
      description: 'Task-Oriented Output Normalization schema, provider-agnostic LLM config, and Reviewer loop rules.',
      codeSnippet: `{
  "agent_framework": "CLAW_MODULAR_GRAPH",
  "prompt_normalization": "TOON_TASK_ORIENTED",
  "token_reduction_target": "~40%",
  "provider_config": {
    "active_provider": "env(LLM_PROVIDER)",
    "supported_providers": ["github-models", "openai", "anthropic"],
    "model_mapping": {
      "supervisor": "gpt-4o-mini",
      "parallel_writers": "gpt-4o-mini",
      "reviewer": "claude-3-5-sonnet",
      "diagram_generator": "gemini-1.5-flash"
    }
  },
  "reviewer_loop_rules": {
    "max_rewrite_passes": 1,
    "quality_threshold_score": 8.0,
    "scoring_criteria": ["factual_grounding", "structural_clarity", "conciseness"]
  },
  "streaming_protocol": {
    "transport": "SSE (Server-Sent Events)",
    "events": ["node_start", "evidence_chunk", "node_end", "compilation_done"],
    "polling": false
  },
  "output_formats": ["markdown", "pdf"]
}`
    },
    keyInnovations: [
      'Fan-out / fan-in multi-agent workflow with LangGraph for parallel section drafting',
      'Reviewer retry loop with rewrite limits and section re-scoring',
      'Real-time Server-Sent Events (SSE) streaming with zero polling',
      'Provider-agnostic LLM config: switch between GitHub Models, OpenAI, and Anthropic in .env with zero code changes',
      'Technical diagram generation powered by Gemini',
      'TOON structured prompt format cutting token costs by ~40%'
    ],
    techStack: ['Python', 'LangGraph', 'LangChain', 'FastAPI / SSE', 'Tavily API', 'Gemini API', 'OpenAI & Claude APIs'],
    metrics: [
      { label: 'Orchestration', value: 'LangGraph', context: 'Fan-out / fan-in multi-agent graph' },
      { label: 'Token Saving', value: '~40% Less', context: 'TOON JSON structured prompting' },
      { label: 'Streaming', value: 'Live SSE', context: 'Real-time node & evidence events' },
      { label: 'Research', value: 'Tavily API', context: 'Web search & document references' },
      { label: 'Diagrams', value: 'Gemini API', context: 'Diagram-tuned image generation' },
      { label: 'LLM Config', value: 'Agnostic', context: 'GitHub Models / OpenAI / Anthropic' }
    ],
    githubUrl: 'https://github.com/Sahil-xharsh/ClawAgent-A-Modular-AI-Blog-Research-System',
    featured: true
  },
  {
    id: 'resume-critiquer',
    transmissionNumber: '2',
    title: 'AI Resume Critiquer',
    accentWord: 'analysis tool',
    tagline: 'AI-powered resume tool that gives structured feedback and bullet rewrites using LLMs via OpenRouter.',
    period: '2024',
    status: 'ACTIVE',
    primaryDomain: 'LLM Applications',
    summary: 'A resume review web application that gives clear feedback, section scores, and bullet improvements by sending resume text to LLMs through OpenRouter.',
    previewImage: '/resume-critiquer-preview.png',
    architectureOverview: 'Extracts text from uploaded PDF and Word resumes, splits key sections (Summary, Experience, Projects, Skills), and sends structured prompts to LLMs via OpenRouter to return practical bullet improvements and formatting advice.',
    topologyFlow: [
      {
        stepNumber: '1',
        name: 'Resume Ingestion',
        description: 'Uploads and extracts raw text from PDF and DOCX resume files.'
      },
      {
        stepNumber: '2',
        name: 'Section Parsing',
        description: 'Identifies and separates core sections like Work Experience, Education, and Skills.'
      },
      {
        stepNumber: '3',
        name: 'LLM Evaluation',
        description: 'Sends evaluation prompts to LLMs through the OpenRouter API.'
      },
      {
        stepNumber: '4',
        name: 'Feedback Aggregation',
        description: 'Formats LLM responses into clear bullet suggestions, scores, and rewrites.'
      },
      {
        stepNumber: '5',
        name: 'User Report Display',
        description: 'Displays the review and suggested bullet rewrites in a clean, readable UI.'
      }
    ],
    specSnippet: {
      tabTitle: 'CRITIQUE PROMPT SPEC',
      fileName: 'resume_eval_prompt.json',
      language: 'json',
      description: 'Structured prompt and routing configuration for resume critique.',
      codeSnippet: `{
  "tool_name": "AI_RESUME_CRITIQUER",
  "provider": "OpenRouter API",
  "evaluation_categories": [
    "Action Verb Strength",
    "Quantifiable Achievements",
    "Clarity and Formatting",
    "Relevant Skill Keywords"
  ],
  "output_format": {
    "overall_score": "number",
    "strengths": ["string"],
    "improvements": ["string"],
    "bullet_rewrites": [
      { "original": "string", "suggested": "string", "reason": "string" }
    ]
  }
}`
    },
    keyInnovations: [
      'Multi-model LLM routing through OpenRouter API for flexible evaluation',
      'Section-by-section breakdown for Experience, Education, and Skills',
      'Actionable bullet rewrites focused on clarity and impact',
      'Direct web-based report for quick resume improvements'
    ],
    techStack: ['Python', 'OpenRouter API', 'Streamlit', 'Pydantic'],
    metrics: [
      { label: 'Language', value: 'Python', context: 'Backend parsing and API orchestration' },
      { label: 'API Provider', value: 'OpenRouter', context: 'Multi-model LLM access' },
      { label: 'Output', value: 'Structured Feedback', context: 'Section critiques & bullet rewrites' }
    ],
    githubUrl: 'https://github.com/Sahil-xharsh/Ai-resume-critiquer',
    featured: true
  },
  {
    id: 'image-classifier',
    transmissionNumber: '3',
    title: 'AI Image Classifier',
    accentWord: 'deep learning',
    tagline: 'Streamlit web app that classifies uploaded images in real time using a pretrained MobileNetV2 neural network.',
    period: '2024',
    status: 'ACTIVE',
    primaryDomain: 'Computer Vision',
    summary: 'A computer vision web application built with Streamlit and PyTorch that classifies uploaded images in real time using a pretrained MobileNetV2 model.',
    previewImage: '/image-classifier-preview.png',
    architectureOverview: 'Loads a pretrained MobileNetV2 model. When a user uploads an image, the app resizes and normalizes the image tensor, runs inference through the neural network, and displays the top-5 predicted classes with confidence percentages.',
    topologyFlow: [
      {
        stepNumber: '1',
        name: 'Image Upload',
        description: 'Accepts image files (PNG, JPG, JPEG) through the Streamlit interface.'
      },
      {
        stepNumber: '2',
        name: 'Image Preprocessing',
        description: 'Resizes image to 224x224 and normalizes tensor channels for MobileNetV2.'
      },
      {
        stepNumber: '3',
        name: 'Model Inference',
        description: 'Runs forward pass through the MobileNetV2 neural network.'
      },
      {
        stepNumber: '4',
        name: 'Probability Calculation',
        description: 'Calculates top-5 class probabilities from model outputs.'
      },
      {
        stepNumber: '5',
        name: 'Results Visualization',
        description: 'Shows the uploaded image alongside prediction confidence bars.'
      }
    ],
    specSnippet: {
      tabTitle: 'MODEL CONFIG',
      fileName: 'mobilenet_config.json',
      language: 'json',
      description: 'MobileNetV2 model configuration and preprocessing parameters.',
      codeSnippet: `{
  "model_backbone": "MobileNetV2",
  "input_size": [224, 224, 3],
  "weights": "Pretrained ImageNet",
  "top_k_predictions": 5,
  "preprocessing": {
    "resize": [224, 224],
    "normalize": {
      "mean": [0.485, 0.456, 0.406],
      "std": [0.229, 0.224, 0.225]
    }
  },
  "frontend": "Streamlit"
}`
    },
    keyInnovations: [
      'Pretrained MobileNetV2 deep learning model for fast, lightweight inference',
      'Interactive Streamlit UI for immediate file upload and prediction viewing',
      'Top-5 confidence distribution display for clear classification breakdown',
      'Standardized image preprocessing and tensor normalization pipeline'
    ],
    techStack: ['Python', 'PyTorch', 'MobileNetV2', 'Streamlit', 'OpenCV', 'NumPy'],
    metrics: [
      { label: 'Language', value: 'Python', context: 'Deep learning & UI application' },
      { label: 'Backbone', value: 'MobileNetV2', context: 'Pretrained convolutional network' },
      { label: 'Interface', value: 'Streamlit', context: 'Interactive browser dashboard' }
    ],
    githubUrl: 'https://github.com/Sahil-xharsh/AI-Image-Classifier',
    featured: true
  }
];

export const CAREER_ARC: CareerMilestone[] = [
  {
    era: 'Phase 1',
    role: 'Video Editor & Motion Designer',
    organization: 'Freelance',
    domain: 'Video Editing & Motion Design',
    summary: '',
    keyDifferentiators: [
      '6,000+ hours in Premiere Pro, After Effects, and Audition',
      'Strong eye for visual layout, pacing, and user attention',
      'Fast turnaround and client delivery across diverse creative projects'
    ],
    technologies: ['Adobe After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Adobe Photoshop', 'Blender', 'Sony Vegas', 'Audition']
  },
  {
    era: 'Phase 2',
    role: 'Frontend & UI Developer',
    organization: 'Independent & Client Projects',
    domain: 'Frontend & Web Development',
    summary: '',
    keyDifferentiators: [
      'Modern web stack: TypeScript, Next.js, React, TailwindCSS',
      'Clean component design, responsive layouts, and smooth interactions',
      'Bridging design sense with clean, maintainable frontend code'
    ],
    technologies: ['TypeScript', 'React.js', 'Next.js', 'TailwindCSS', 'CSS3 / HTML5', 'Figma']
  },
  {
    era: 'Phase 3',
    role: 'AI/ML Engineer & Researcher',
    organization: 'Active Focus & Projects',
    domain: 'Deep Learning & Multimodal AI',
    summary: '',
    keyDifferentiators: [
      'Multimodal AI workflows, model fine-tuning, and evaluation metrics',
      'Deploying models and agent pipelines with MLOps best practices',
      'Full capability across Python backend, ML infrastructure, and UI'
    ],
    technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Streamlit', 'LangGraph', 'LangChain', 'OpenCV', 'NumPy', 'Scikit-Learn', 'Git']
  }
];

export const TECH_GROUPS: TechGroup[] = [
  {
    id: 'deep-learning-multimodal',
    code: '1 MULTIMODAL AI',
    title: 'Deep Learning & Multimodal AI',
    description: 'Multimodal architectures, model fine-tuning, inference optimization, and evaluation.',
    skills: [
      { name: 'Multimodal AI & Vision-Language', proficiency: 'Advanced', context: 'Cross-modal representations, multimodal inference', tag: 'Core' },
      { name: 'Model Fine-Tuning & Adaptation', proficiency: 'Advanced', context: 'Parameter-efficient tuning, domain adaptation, transfer learning', tag: 'Research' },
      { name: 'PyTorch & Neural Architectures', proficiency: 'Advanced', context: 'Model architectures, custom training loops, tensor ops', tag: 'Framework' },
      { name: 'Model Evaluation & Benchmarking', proficiency: 'Advanced', context: 'Quantitative metrics, validation pipelines, error analysis', tag: 'Research' },
      { name: 'Inference & Optimization', proficiency: 'Core', context: 'Model quantization, latency reduction, batch execution', tag: 'Engineering' }
    ]
  },
  {
    id: 'generative-ai-agents',
    code: '2 AGENTS RAG',
    title: 'Agents & RAG Systems',
    description: 'Autonomous workflows, dense vector retrieval, and structured tool calling.',
    skills: [
      { name: 'Autonomous Agents', proficiency: 'Advanced', context: 'Multi-layer supervisor-worker loops & tool use', tag: 'Core' },
      { name: 'RAG Architectures', proficiency: 'Advanced', context: 'Dense vector retrieval & document processing', tag: 'Core' },
      { name: 'Prompt Engineering / TOON', proficiency: 'Advanced', context: 'Task-oriented output normalization', tag: 'Specialty' },
      { name: 'LangChain & LangGraph', proficiency: 'Advanced', context: 'Agent chains, state graphs, tool routing', tag: 'Core' },
      { name: 'OpenAI & Claude APIs', proficiency: 'Advanced', context: 'Structured tool calling, reasoning, streaming', tag: 'Core' },
      { name: 'OpenRouter & Multi-LLM', proficiency: 'Core', context: 'Dynamic model routing & API integration', tag: 'Production' }
    ]
  },
  {
    id: 'mlops-infrastructure',
    code: '3 MLOPS SYSTEMS',
    title: 'MLOps & Deployment',
    description: 'Practical engineering, containerization, inference serving, and pipeline automation.',
    skills: [
      { name: 'FastAPI & RESTful APIs', proficiency: 'Advanced', context: 'High-throughput async endpoints & model serving', tag: 'Backend' },
      { name: 'Docker & Containerization', proficiency: 'Core', context: 'Reproducible runtime environments & isolated builds', tag: 'Infra' },
      { name: 'Streamlit & Web Apps', proficiency: 'Advanced', context: 'Interactive model dashboards & evaluation demos', tag: 'Deploy' },
      { name: 'Git & GitHub', proficiency: 'Advanced', context: 'Version control, repositories, workflows', tag: 'DevOps' }
    ]
  },
  {
    id: 'frontend-motion',
    code: '4 FRONTEND MOTION',
    title: 'Frontend & Motion Craft',
    description: 'Production web interfaces, visual narrative, and user experience.',
    skills: [
      { name: 'TypeScript & JavaScript', proficiency: 'Advanced', context: 'Modern web application development', tag: 'Languages' },
      { name: 'React.js & Next.js', proficiency: 'Advanced', context: 'Component architecture, state hooks', tag: 'Web' },
      { name: 'TailwindCSS & Modern CSS', proficiency: 'Advanced', context: 'Responsive layouts, clean styling', tag: 'Styling' },
      { name: 'Video & Motion Design', proficiency: 'Advanced', context: '6,000+ hours in Premiere, After Effects, Audition', tag: 'Foundation' }
    ]
  }
];
