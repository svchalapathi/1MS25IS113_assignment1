import { PaperAnalysisResult } from '../types/paper';

export const SAMPLE_PAPERS: Record<string, PaperAnalysisResult> = {
  transformer: {
    id: 'transformer',
    metadata: {
      title: 'Attention Is All You Need',
      authors: [
        'Ashish Vaswani',
        'Noam Shazeer',
        'Niki Parmar',
        'Jakob Uszkoreit',
        'Llion Jones',
        'Aidan N. Gomez',
        'Łukasz Kaiser',
        'Illia Polosukhin',
      ],
      publicationName: 'Advances in Neural Information Processing Systems (NeurIPS)',
      publicationYear: 2017,
      citationCount: '135,000+ citations',
      venueType: 'Top-tier AI Conference',
      doiOrArxivId: 'arXiv:1706.03762',
      paperKeywords: [
        'Transformers',
        'Self-Attention',
        'Sequence Modeling',
        'Parallel Training',
        'Natural Language Processing',
      ],
    },
    summary: {
      oneLineHook:
        'Replaced slow, sequential RNN/LSTM networks with a purely attention-based architecture that trains up to 100x faster and captures long-range dependencies.',
      problemStatement: {
        simpleExplanation:
          'Before this paper, almost all language models relied on Recurrent Neural Networks (RNNs) and LSTMs. RNNs process sentences word-by-word sequentially: you cannot compute word #50 without computing word #49 first. This created two huge engineering bottlenecks: GPUs could not parallelize training efficiently, and the network suffered catastrophic forgetting on long paragraphs.',
        keyObstacles: [
          'Sequential dependency: Training step t relies on hidden state h_(t-1), preventing parallel execution on GPUs.',
          'Vanishing gradients across long contexts: Gradients degrade when backpropagating through dozens of time steps.',
          'Linear distance memory: Connecting distant words required O(N) sequential hops, causing context loss.',
        ],
      },
      methodology: {
        simpleExplanation:
          'The authors discarded recurrence completely and introduced the "Transformer". It connects every word in a sequence directly to every other word simultaneously using Scaled Dot-Product Self-Attention and Multi-Head Attention, allowing complete GPU parallelization and constant O(1) path length between any two tokens.',
        stepByStepPipeline: [
          {
            step: 'Positional Encoding Injection',
            description:
              'Since self-attention has no innate sense of order, sinusoidal waves of differing frequencies are added to word embeddings so the model knows token positions.',
            engineeringSignificance:
              'Allows order-awareness without recurrent loops, scaling gracefully to arbitrary sequence lengths.',
          },
          {
            step: 'Scaled Dot-Product Multi-Head Attention',
            description:
              'Computes Query (Q), Key (K), and Value (V) projections: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V across 8 parallel heads.',
            engineeringSignificance:
              'Allows the model to jointly attend to information from different representation subspaces (e.g., grammatical vs semantic relationships).',
          },
          {
            step: 'Residual Connections & Layer Normalization (Add & Norm)',
            description:
              'Wraps each sub-layer with a skip connection: LayerNorm(x + Sublayer(x)).',
            engineeringSignificance:
              'Prevents vanishing/exploding gradients in deep networks with 6 stacked encoder/decoder blocks.',
          },
          {
            step: 'Position-Wise Feed-Forward Networks',
            description:
              'Each attention block feeds into two linear transformations with a ReLU activation: FFN(x) = max(0, xW1 + b1)W2 + b2.',
            engineeringSignificance:
              'Transforms and synthesizes the pooled contextual information independently for each position.',
          },
        ],
      },
      keyFindings: {
        simpleExplanation:
          'The Transformer established a new State-of-the-Art in machine translation while training in just 3.5 days on 8 P100 GPUs—a fraction of the compute time required by contemporary convolutional or recurrent models.',
        quantitativeResults: [
          {
            metric: 'WMT 2014 English-to-German Translation',
            value: '28.4 BLEU',
            comparison: '+2.0 BLEU higher than previous best ensemble models',
          },
          {
            metric: 'WMT 2014 English-to-French Translation',
            value: '41.8 BLEU',
            comparison: 'New SOTA beating all published single & ensemble models',
          },
          {
            metric: 'Training Compute Efficiency',
            value: '3.5 days on 8 P100 GPUs',
            comparison: 'Over 10x faster to train than equivalent recurrent baselines',
          },
        ],
        limitations: [
          'Quadratic Memory Complexity: Full self-attention scales at O(N^2) memory and time with respect to sequence length N.',
          'High memory bandwidth demand during autoregressive decoder generation.',
          'Lack of inductive bias for locality (requires large amounts of training data compared to CNNs).',
        ],
      },
    },
    architectureFlowchart: {
      mermaidCode: `graph TD
  subgraph InputPipeline["1. Input Stage"]
    Tokens["Input Sequence Tokens"] --> Embed["Input Embedding (d_model=512)"]
    Embed --> PosAdd["Add Positional Encoding (Sinusoids)"]
  end

  subgraph EncoderStack["2. Encoder Stack (x6 Layers)"]
    PosAdd --> MHA1["Multi-Head Self-Attention (8 Heads)"]
    MHA1 --> AddNorm1["Add & LayerNorm"]
    AddNorm1 --> FFN1["Position-wise Feed-Forward (d_ff=2048)"]
    FFN1 --> AddNorm2["Add & LayerNorm"]
  end

  subgraph DecoderStack["3. Decoder Stack (x6 Layers)"]
    Targets["Target Output Tokens (Shifted Right)"] --> DecEmbed["Output Embedding + Pos Encoding"]
    DecEmbed --> MaskMHA["Masked Multi-Head Self-Attention"]
    MaskMHA --> DecNorm1["Add & LayerNorm"]
    
    AddNorm2 -->|"Encoder Memory (Keys & Values)"| CrossMHA["Cross-Attention (Query from Dec, K/V from Enc)"]
    DecNorm1 -->|"Queries"| CrossMHA
    CrossMHA --> DecNorm2["Add & LayerNorm"]
    DecNorm2 --> DecFFN["Decoder Feed-Forward"]
    DecFFN --> DecNorm3["Add & LayerNorm"]
  end

  subgraph OutputStage["4. Output Projection"]
    DecNorm3 --> Linear["Linear Projection (Vocab Size)"]
    Linear --> Softmax["Softmax Probability Distribution"]
    Softmax --> NextToken["Generated Next Token"]
  end

  classDef input fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
  classDef enc fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#5b21b6;
  classDef dec fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
  classDef out fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d;

  class Tokens,Embed,PosAdd input;
  class MHA1,AddNorm1,FFN1,AddNorm2 enc;
  class Targets,DecEmbed,MaskMHA,DecNorm1,CrossMHA,DecNorm2,DecFFN,DecNorm3 dec;
  class Linear,Softmax,NextToken out;`,
      architectureWalkthrough:
        'The architecture operates as an asymmetric Encoder-Decoder pipeline. The Encoder encodes input context bidirectionally with multi-head self-attention, generating key/value representation vectors. The Decoder consumes target tokens autoregressively with causal masking (preventing peeking into future tokens), querying the encoder memory via Cross-Attention at each layer.',
      keyComponents: [
        {
          name: 'Multi-Head Attention (MHA)',
          role: 'Projects queries, keys, and values into 8 distinct 64-dimensional subspaces to attend to different context aspects simultaneously.',
          engineeringTakeaway:
            'Splitting attention into multiple smaller heads improves representation power without increasing computational cost over a single wide head.',
        },
        {
          name: 'Causal Masking',
          role: 'Zeroes out illegal subsequent connections in the decoder attention matrix (setting logits to -infinity prior to softmax).',
          engineeringTakeaway:
            'Crucial for autoregressive models during batched training so predictions for position i only depend on tokens < i.',
        },
        {
          name: 'Residual Skip Connections',
          role: 'Adds the input of each sublayer directly to its output prior to LayerNorm.',
          engineeringTakeaway:
            'Ensures clean gradient highways, allowing backpropagation through dozens of stacked layers without attenuation.',
        },
      ],
    },
    futureOpportunities: [
      {
        id: 1,
        title: 'Edge-Device TinyTransformer for Wearable ECG Arrhythmia Classification',
        difficultyLevel: 'Beginner / Course Final',
        estimatedDuration: '4 to 6 weeks',
        problemSolved:
          'Medical wearable sensors generate continuous 1D time-series signals. Existing LSTM models on edge microcontrollers suffer high latency and cannot process long-duration cardiac rhythms.',
        proposedMethod:
          'Adapt a 2-layer encoder-only Transformer with linear attention approximation, quantized to INT8 using PyTorch and deployed onto an ESP32-S3 or Raspberry Pi Zero.',
        technologies: ['PyTorch', 'ONNX Runtime', 'TensorRT', 'PhysioNet MIT-BIH Dataset', 'C++ / MicroPython'],
        performanceMetrics: [
          {
            metricName: 'Inference Latency',
            targetThreshold: '< 35 ms per 10-second ECG window',
            measurementMethod: 'Timer benchmark on ARM Cortex-M4 / Raspberry Pi Zero',
          },
          {
            metricName: 'Classification F1-Score',
            targetThreshold: '> 96.5% on 5 arrhythmia classes',
            measurementMethod: 'Stratified 5-fold cross-validation on MIT-BIH test partition',
          },
          {
            metricName: 'Model Memory Footprint',
            targetThreshold: '< 1.8 MB flash storage',
            measurementMethod: 'Binary size after post-training INT8 quantization',
          },
        ],
        gettingStartedDataset: 'MIT-BIH Arrhythmia Database (PhysioNet open repository)',
        firstMilestone:
          'Preprocess 100 raw ECG lead recordings into normalized sliding windows and train a baseline 2-head encoder in PyTorch.',
      },
      {
        id: 2,
        title: 'Sparse Linear-Complexity Attention for Real-Time LiDAR Point Cloud Compression',
        difficultyLevel: 'Intermediate / Capstone',
        estimatedDuration: '8 to 12 weeks',
        problemSolved:
          'Autonomous driving vehicles produce over 1.2 million 3D point cloud coordinates per second. Applying standard O(N^2) attention causes out-of-memory crashes on in-vehicle GPUs.',
        proposedMethod:
          'Implement a FlashAttention / Performer kernel with random feature maps to approximate the softmax kernel in O(N) linear time, preserving critical road obstacles and curbs.',
        technologies: ['CUDA / Triton', 'PyTorch3D', 'ROS 2 (Humble)', 'KITTI / nuScenes Dataset'],
        performanceMetrics: [
          {
            metricName: 'Throughput',
            targetThreshold: '>= 30 frames per second (33ms budget)',
            measurementMethod: 'Real-time ROS 2 node pipeline on an NVIDIA Jetson Orin',
          },
          {
            metricName: 'Compression Ratio vs Chamfer Distance',
            targetThreshold: '10:1 compression ratio with Chamfer Distance < 0.015m',
            measurementMethod: 'Standard point cloud reconstruction evaluation on nuScenes validation set',
          },
          {
            metricName: 'GPU VRAM Peak Consumption',
            targetThreshold: '< 3.2 GB during continuous 10-minute drive replay',
            measurementMethod: 'nvidia-smi memory sampling daemon',
          },
        ],
        gettingStartedDataset: 'KITTI 3D Object Detection Evaluation Dataset',
        firstMilestone:
          'Build a basic PyTorch module comparing memory footprint between naive scaled dot-product attention and a chunked sparse attention on 10,000 synthetic 3D points.',
      },
      {
        id: 3,
        title: 'Low-Precision Cross-Modal Transformer for Drone Thermal-RGB Target Tracking',
        difficultyLevel: "Advanced / Master's Thesis",
        estimatedDuration: '14 to 18 weeks',
        problemSolved:
          'Search-and-rescue UAVs operating at dusk or in smoky environments suffer tracking failures when depending on RGB alone. Fusing thermal and visual spectra in real-time requires resilient cross-attention.',
        proposedMethod:
          'Construct a dual-stream cross-modal Transformer where thermal queries attend to RGB keys/values with dynamic spectral gating, optimized via knowledge distillation from a larger teacher model.',
        technologies: ['PyTorch', 'TensorRT-LLM', 'Roboflow Drone Thermal Dataset', 'DeepStream SDK', 'PX4 Autopilot'],
        performanceMetrics: [
          {
            metricName: 'Target Tracking Success Rate (IoU > 0.5)',
            targetThreshold: '>= 88.5% in zero-lux smoke environments',
            measurementMethod: 'Benchmark on RGBT234 benchmark evaluation suite',
          },
          {
            metricName: 'End-to-End Latency',
            targetThreshold: '< 25 ms frame-to-actuation',
            measurementMethod: 'Oscilloscope hardware trigger measurement on drone companion computer',
          },
          {
            metricName: 'Thermal vs Optical Fallback Robustness',
            targetThreshold: '< 4% drop in tracking precision when optical lens is obstructed',
            measurementMethod: 'Controlled synthetic occlusion test suite across 50 video clips',
          },
        ],
        gettingStartedDataset: 'RGBT234 / DroneVehicle Dual-Modality Benchmark',
        firstMilestone:
          'Write the dual-stream feature fusion layer and verify cross-attention gradients flow correctly back into both camera backbones.',
      },
    ],
  },
  lora: {
    id: 'lora',
    metadata: {
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      authors: [
        'Edward J. Hu',
        'Yelong Shen',
        'Phillip Wallis',
        'Zeyuan Allen-Zhu',
        'Yuanzhi Li',
        'Shean Wang',
        'Lu Wang',
        'Weizhu Chen',
      ],
      publicationName: 'International Conference on Learning Representations (ICLR)',
      publicationYear: 2022,
      citationCount: '11,200+ citations',
      venueType: 'Top-tier Deep Learning Conference',
      doiOrArxivId: 'arXiv:2106.09685',
      paperKeywords: [
        'Parameter-Efficient Fine-Tuning (PEFT)',
        'Low-Rank Decomposition',
        'LLM Adaptation',
        'Zero Inference Latency',
        'GPU Memory Optimization',
      ],
    },
    summary: {
      oneLineHook:
        'Freezes pre-trained model weights and injects trainable rank-decomposition matrices into Transformer layers, cutting trainable parameters by 10,000x and GPU memory by 3x with zero extra inference latency.',
      problemStatement: {
        simpleExplanation:
          'As language models scaled to hundreds of billions of parameters, fine-tuning them for specific engineering domains became prohibitively expensive. Traditional full fine-tuning requires saving a complete new copy of all 175B weights for every single task, demanding hundreds of gigabytes of GPU VRAM just to store optimizer states.',
        keyObstacles: [
          'Storage explosion: Storing checkpoints for 20 custom tasks on a 175B model requires terabytes of high-speed NVMe disk.',
          'VRAM bottleneck: Adam optimizer requires 8 bytes per parameter (moments + variances), exhausting consumer GPU clusters.',
          'Inference overhead of adapter layers: Previous parameter-efficient adapter methods introduced sequential layers that slowed inference by 20-30%.',
        ],
      },
      methodology: {
        simpleExplanation:
          'Hypothesizes that weight updates during adaptation have a low "intrinsic dimension". LoRA freezes the pre-trained weight matrix W_0 (d x k) and parameterizes its update delta W as the product of two low-rank matrices: delta W = B * A, where B is (d x r) and A is (r x k) with rank r << min(d, k). At inference, B*A is simply added back into W_0 with zero latency penalty.',
        stepByStepPipeline: [
          {
            step: 'Matrix Decomposition (B * A)',
            description:
              'For any target weight matrix W_0 in attention projection (W_q, W_v), the forward pass becomes: h = W_0*x + (alpha / r) * B * A * x.',
            engineeringSignificance:
              'If d=4096 and rank r=4, parameters drop from 16,777,216 down to 32,768—a 99.8% reduction.',
          },
          {
            step: 'Zero-Impact Initialization',
            description:
              'Matrix A is initialized with Gaussian distribution N(0, sigma^2) and Matrix B is initialized to exact zeros.',
            engineeringSignificance:
              'Ensures delta W is exactly zero at step 0 of training, guaranteeing the model starts identically to the pre-trained base.',
          },
          {
            step: 'Scaling Constant (alpha / r)',
            description:
              'Scales the low-rank delta by a constant factor alpha / r when updating activations.',
            engineeringSignificance:
              'Decouples hyperparameter tuning: when changing rank r, the learning rate does not need extensive re-tuning.',
          },
          {
            step: 'Zero-Latency Weight Folding',
            description:
              'Once training finishes, compute W_deployed = W_0 + (alpha / r) * (B * A) once offline.',
            engineeringSignificance:
              'No additional matrix multiplies during production deployment, eliminating the latency penalty of previous adapter architectures.',
          },
        ],
      },
      keyFindings: {
        simpleExplanation:
          'LoRA matches or outperforms full fine-tuning across RoBERTa, DeBERTa, and GPT-3 175B benchmarks while fine-tuning only 0.01% of parameters, reducing GPU memory consumption by 3x and checkpoint sizes from 350 GB to 35 MB.',
        quantitativeResults: [
          {
            metric: 'Trainable Parameter Count on GPT-3 175B',
            value: '4.7 Million (Rank 4)',
            comparison: '10,000x reduction compared to 175 Billion full fine-tuning',
          },
          {
            metric: 'GPU VRAM Peak Allocation during Training',
            value: 'Reduced from 1.2 TB to 350 GB',
            comparison: '3x memory reduction; eliminates optimizer state overhead for 99.99% of weights',
          },
          {
            metric: 'Validation Accuracy on Multi-Task Benchmarks',
            value: 'Matches or exceeds Full Fine-Tuning (+0.2% on WikiSQL)',
            comparison: 'Proves high-rank updates are unnecessary for task specialization',
          },
        ],
        limitations: [
          'Batch multi-tenancy challenge: Dynamically switching between different LoRA adapters in a single batched inference request requires custom kernel dispatch.',
          'Not suitable when the base model lacks foundational knowledge required by the target domain.',
        ],
      },
    },
    architectureFlowchart: {
      mermaidCode: `graph TD
  subgraph InputActivation["1. Input Activation"]
    X["Input Vector x (Dimension d)"]
  end

  subgraph BaseStream["2. Frozen Pretrained Backbone"]
    X --> W0["Frozen Matrix W_0 (d x k)<br/>[No Gradient Computation]"]
    W0 --> BaseOut["W_0 * x (k)"]
  end

  subgraph LoRAStream["3. Low-Rank Adapter Path"]
    X --> MatA["Matrix A (r x d)<br/>Initialized: Gaussian N(0, sigma^2)"]
    MatA --> LowRankInner["Rank r Bottleneck (e.g. r=4 or 8)"]
    LowRankInner --> MatB["Matrix B (k x r)<br/>Initialized: Exact Zeros"]
    MatB --> Scaled["Scale by (alpha / r)"]
    Scaled --> LoRAOut["Delta W * x (k)"]
  end

  subgraph MergedOutput["4. Output & Deployment"]
    BaseOut --> AddSum["Element-wise Add (+)"]
    LoRAOut --> AddSum
    AddSum --> OutputH["Output Activation h = W_0*x + (alpha/r)*B*A*x"]
    
    AddSum -.->|"Offline Merge"| Deploy["Folded Weights: W_new = W_0 + (alpha/r)*BA<br/>[Zero Runtime Latency]"]
  end

  classDef frozen fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#334155;
  classDef trainable fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#78350f;
  classDef combined fill:#dcfce7,stroke:#10b981,stroke-width:2px,color:#065f46;

  class W0,BaseOut frozen;
  class MatA,LowRankInner,MatB,Scaled,LoRAOut trainable;
  class AddSum,OutputH,Deploy combined;`,
      architectureWalkthrough:
        'The input vector x passes simultaneously through two parallel paths: the frozen pre-trained weight matrix W_0 (which calculates base activations without storing optimizer states) and the low-rank bypass consisting of matrix A and matrix B down-projecting through rank r. Both paths are summed at the output, and can be collapsed into a single matrix prior to deployment.',
      keyComponents: [
        {
          name: 'Down-Projection Matrix A',
          role: 'Projects incoming high-dimensional activations (d=4096) down to an extremely narrow intrinsic dimension (r=4 or 8).',
          engineeringTakeaway:
            'Gaussian initialization ensures diverse signal propagation from epoch 1.',
        },
        {
          name: 'Up-Projection Matrix B',
          role: 'Expands the low-rank bottleneck back to the target output dimension k, initialized to zeros.',
          engineeringTakeaway:
            'Zero-initialization ensures training begins strictly at the pre-trained distribution baseline without shock.',
        },
        {
          name: 'Weight Folding Mechanism',
          role: 'Combines W_0 + delta W into the main weight matrix when serving the model.',
          engineeringTakeaway:
            'Avoids runtime compute cost, enabling fine-tuned models to serve at identical speeds to the base foundation model.',
        },
      ],
    },
    futureOpportunities: [
      {
        id: 1,
        title: 'QLoRA on Consumer 12GB GPUs for Embedded Autonomous Robot Command Tuning',
        difficultyLevel: 'Beginner / Course Final',
        estimatedDuration: '4 to 6 weeks',
        problemSolved:
          'Engineering student robotic teams cannot afford enterprise A100/H100 clusters to fine-tune open-source 7B/8B language models for domain-specific natural language robot navigation commands.',
        proposedMethod:
          'Combine 4-bit NormalFloat (NF4) quantization with LoRA adapters on an RTX 3060/4060 GPU to fine-tune Llama 3 / Mistral on custom ROS 2 navigation trajectory prompts.',
        technologies: ['bitsandbytes', 'Hugging Face PEFT', 'PyTorch', 'ROS 2', 'NVIDIA RTX 3060'],
        performanceMetrics: [
          {
            metricName: 'GPU VRAM Peak Allocation',
            targetThreshold: '< 8.5 GB during fine-tuning',
            measurementMethod: 'nvidia-smi peak memory usage monitor',
          },
          {
            metricName: 'Navigation Command Parsing Accuracy',
            targetThreshold: '>= 94% correct ROS 2 waypoint command generation',
            measurementMethod: 'Exact-match syntax evaluation across 300 test robotic scenario prompts',
          },
          {
            metricName: 'Adapter Storage Footprint',
            targetThreshold: '< 65 MB per robot personality',
            measurementMethod: 'Disk file size of the saved safetensors LoRA checkpoint',
          },
        ],
        gettingStartedDataset: 'RoCo (Robots in Context) dataset or simulated Gazebo navigation commands',
        firstMilestone:
          'Quantize Mistral-7B into 4-bit NF4 and execute an inference test consuming under 6 GB VRAM on a student laptop.',
      },
      {
        id: 2,
        title: 'Dynamic Multi-LoRA Hot-Swapping Microservice for Multi-Tenant Engineering CAD Parsing',
        difficultyLevel: 'Intermediate / Capstone',
        estimatedDuration: '8 to 10 weeks',
        problemSolved:
          'Engineering firms manage hundreds of distinct CAD schematic formats (AutoCAD DXF, STEP, SolidWorks). Running separate 7B models for each department wastes hundreds of gigabytes of VRAM.',
        proposedMethod:
          'Implement a single frozen base model in vLLM or S-LoRA with a dynamic CUDA adapter routing kernel that swaps lightweight LoRA weights per request based on file metadata.',
        technologies: ['vLLM / S-LoRA', 'FastAPI', 'Triton Inference Server', 'Docker', 'STEP/IGES Python Parsers'],
        performanceMetrics: [
          {
            metricName: 'Adapter Swap Latency',
            targetThreshold: '< 4.5 ms switching time between distinct departmental adapters',
            measurementMethod: 'Server-side timestamp measurement during concurrent batched requests',
          },
          {
            metricName: 'VRAM Efficiency vs Multi-Model Serving',
            targetThreshold: '> 85% reduction in total GPU memory for 12 simultaneous domain adapters',
            measurementMethod: 'Comparative memory allocation profiling',
          },
          {
            metricName: 'Batched Throughput',
            targetThreshold: '>= 120 tokens/sec under 10 concurrent requests',
            measurementMethod: 'Locust load-testing suite against FastAPI inference gateway',
          },
        ],
        gettingStartedDataset: 'ABC Dataset (1M computer-aided design models) + synthesized metadata descriptions',
        firstMilestone:
          'Deploy two distinct LoRA adapters onto one base model in memory and demonstrate alternating requests without model reload.',
      },
      {
        id: 3,
        title: 'Adaptive Singular Value Truncation (AdaLoRA) for FPGA Circuit Route Optimization',
        difficultyLevel: "Advanced / Master's Thesis",
        estimatedDuration: '14 to 18 weeks',
        problemSolved:
          'FPGA electronic design automation (EDA) placement and routing takes hours of heuristic search. Standard LoRA uses a static rank across all layers, wasting parameters on non-critical routing layers.',
        proposedMethod:
          'Implement dynamic singular value pruning that allocates higher rank r to critical graph neural network layers in the EDA router and prunes unimportant layers to rank 0.',
        technologies: ['PyTorch', 'VTR (Verilog-to-Routing)', 'Graph Neural Networks (PyG)', 'CUDA'],
        performanceMetrics: [
          {
            metricName: 'Routing Wirelength Optimization',
            targetThreshold: '>= 8.2% reduction in total chip wirelength compared to standard VTR router',
            measurementMethod: 'Benchmark on MCNC / Titan FPGA circuit benchmarks',
          },
          {
            metricName: 'Adapter Parameter Budget',
            targetThreshold: '< 1.2M total active parameters across the entire GNN',
            measurementMethod: 'Total non-zero weights in the pruned SVD singular value vectors',
          },
          {
            metricName: 'Routing Time Speedup',
            targetThreshold: '3.2x faster convergence than conventional simulated annealing',
            measurementMethod: 'End-to-end routing runtime on 100k-gate FPGA architectures',
          },
        ],
        gettingStartedDataset: 'Titan FPGA Benchmark Suite (Open-source Verilog-to-Routing)',
        firstMilestone:
          'Build an SVD monitoring hook that tracks importance scores of singular values across 10 training epochs.',
      },
    ],
  },
  resnet: {
    id: 'resnet',
    metadata: {
      title: 'Deep Residual Learning for Image Recognition',
      authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
      publicationName: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
      publicationYear: 2016,
      citationCount: '220,000+ citations',
      venueType: 'Top-tier Computer Vision Conference (Best Paper Award)',
      doiOrArxivId: 'arXiv:1512.03385',
      paperKeywords: [
        'Residual Networks',
        'Deep Learning',
        'Vanishing Gradient',
        'Image Classification',
        'Skip Connections',
      ],
    },
    summary: {
      oneLineHook:
        'Introduced identity shortcut connections (skip connections) that allow training neural networks over 100 layers deep without vanishing gradients or degradation.',
      problemStatement: {
        simpleExplanation:
          'Before ResNet, deeper networks performed worse than shallower networks—not because of overfitting, but because of optimization degradation: training error itself became higher as layers were added because gradients vanished when backpropagating through dozens of non-linear transformations.',
        keyObstacles: [
          'Degradation problem: Adding more layers led to higher training error, proving standard deep models failed to learn simple identity functions.',
          'Vanishing and exploding gradients during backpropagation across 20+ layers.',
          'Stagnant convergence on large-scale datasets like ImageNet.',
        ],
      },
      methodology: {
        simpleExplanation:
          'Instead of hoping stacked layers fit an underlying mapping H(x), the authors reformulated layers to fit a residual mapping F(x) := H(x) - x. The original mapping becomes F(x) + x, realized by feedforward networks with identity shortcut connections that bypass one or more layers.',
        stepByStepPipeline: [
          {
            step: 'Residual Formulation',
            description:
              'Layers are set up to learn F(x) where Output = F(x) + x. If an identity mapping is optimal, the network simply drives residual weights F(x) to zero.',
            engineeringSignificance:
              'It is vastly easier for gradient descent to push weights toward zero than to approximate an identity mapping through multi-layer non-linearities.',
          },
          {
            step: 'Identity Skip Shortcut',
            description:
              'Parameter-free addition of input x directly to the output of the convolutional block: y = F(x, {Wi}) + x.',
            engineeringSignificance:
              'Introduces zero additional parameters and zero additional computation while providing an uninterrupted gradient highway.',
          },
          {
            step: 'Bottleneck Architecture',
            description:
              'For deep networks (ResNet-50/101/152), each residual block uses a 1x1, 3x3, 1x1 convolution stack.',
            engineeringSignificance:
              '1x1 layers reduce and then restore dimensions, leaving the 3x3 layer with smaller input/output dimensions to conserve FLOPs.',
          },
        ],
      },
      keyFindings: {
        simpleExplanation:
          'ResNet won 1st place in all ImageNet 2015 and MS COCO competitions, training networks up to 152 layers deep (8x deeper than VGG) with lower complexity and achieving superhuman 3.57% top-5 error.',
        quantitativeResults: [
          {
            metric: 'ImageNet Top-5 Classification Error',
            value: '3.57%',
            comparison: '1st place ImageNet 2015; surpassed human-level perception benchmark (~5.1%)',
          },
          {
            metric: 'Network Depth Feasibility',
            value: 'Up to 1,000+ layers on CIFAR-10',
            comparison: 'Previous state-of-the-art VGG-19 failed to train past 20-30 layers',
          },
          {
            metric: 'Computational Complexity',
            value: 'ResNet-152 has lower FLOPs than VGG-16/19',
            comparison: '11.3 GFLOPs vs 19.6 GFLOPs despite being 8x deeper',
          },
        ],
        limitations: [
          'Feature re-use redundancy: Many layers in extremely deep ResNets contribute minimally to the final representation.',
          'Memory footprint during training is dominated by caching intermediate activation maps for backpropagation.',
        ],
      },
    },
    architectureFlowchart: {
      mermaidCode: `graph TD
  subgraph InputSection["Input"]
    Inp["Input Feature Map x (Channels: C, Size: HxW)"]
  end

  subgraph WeightLayers["Residual Learning Block F(x)"]
    Inp --> Conv1["1x1 Conv (Channel Compression: C/4)"]
    Conv1 --> BN1["Batch Normalization + ReLU"]
    BN1 --> Conv2["3x3 Conv (Spatial Feature Extraction)"]
    Conv2 --> BN2["Batch Normalization + ReLU"]
    BN2 --> Conv3["1x1 Conv (Channel Restoration: C)"]
    Conv3 --> BN3["Batch Normalization"]
  end

  subgraph ShortcutPath["Identity Connection"]
    Inp -->|"Identity Shortcut x (Zero Parameters)"| Direct["Bypass Path"]
  end

  subgraph OutputSection["Summation & Non-Linearity"]
    BN3 --> Sum["Element-wise Addition: F(x) + x"]
    Direct --> Sum
    Sum --> FinalReLU["Final ReLU Activation"]
    FinalReLU --> Out["Output Feature Map y = ReLU(F(x) + x)"]
  end

  classDef input fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
  classDef conv fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;
  classDef path fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
  classDef sum fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d;

  class Inp input;
  class Conv1,BN1,Conv2,BN2,Conv3,BN3 conv;
  class Direct path;
  class Sum,FinalReLU,Out sum;`,
      architectureWalkthrough:
        'A single bottleneck residual unit splits into two streams: the main convolutional path F(x) which performs feature transformations through 1x1, 3x3, and 1x1 convolutions with batch normalization, and the identity shortcut path which carries x forward unchanged. Both streams merge via simple element-wise addition prior to the final ReLU activation.',
      keyComponents: [
        {
          name: 'Identity Shortcut Connection',
          role: 'Carries information forward without attenuation, allowing gradients to flow back directly from output to input layers.',
          engineeringTakeaway:
            'Gradient calculation contains an additive term: dLoss/dx = (dLoss/dy) * (1 + dF/dx). The "+1" guarantees gradients never completely vanish.',
        },
        {
          name: '1x1 Bottleneck Convolutions',
          role: 'Shrinks channel dimension before the compute-heavy 3x3 convolution and expands it back afterwards.',
          engineeringTakeaway:
            'Enables constructing 152 layers with fewer overall parameters and FLOPs than shallow 16-layer networks.',
        },
        {
          name: 'Batch Normalization Post-Conv',
          role: 'Normalizes activations before addition and non-linearities.',
          engineeringTakeaway:
            'Smooths the loss landscape, enabling stable learning rates and faster convergence.',
        },
      ],
    },
    futureOpportunities: [
      {
        id: 1,
        title: 'Micro-ResNet on Microcontrollers for Industrial Vibration Motor Fault Detection',
        difficultyLevel: 'Beginner / Course Final',
        estimatedDuration: '4 to 6 weeks',
        problemSolved:
          'Factory conveyor motors fail unexpectedly, causing costly downtime. Transmitting continuous vibration accelerometer data to the cloud is high-latency and bandwidth-heavy.',
        proposedMethod:
          'Deploy a 1D 8-layer Micro-ResNet on an ARM Cortex-M4 microcontroller running on battery to perform real-time bearing vibration FFT anomaly classification.',
        technologies: ['TensorFlow Lite for Microcontrollers', 'STM32CubeIDE', 'CMSIS-NN', 'C / C++'],
        performanceMetrics: [
          {
            metricName: 'Fault Detection Latency',
            targetThreshold: '< 15 ms per 1024-sample vibration frame',
            measurementMethod: 'Microcontroller hardware timer pin toggle on oscilloscope',
          },
          {
            metricName: 'Anomaly Detection Accuracy',
            targetThreshold: '>= 97.2% on 4 industrial bearing fault states',
            measurementMethod: 'Case Western Reserve University (CWRU) bearing benchmark dataset',
          },
          {
            metricName: 'Current Consumption',
            targetThreshold: '< 22 mA active power draw at 3.3V',
            measurementMethod: 'Nordic Power Profiler Kit II measurement',
          },
        ],
        gettingStartedDataset: 'Case Western Reserve University (CWRU) Bearing Data Center',
        firstMilestone:
          'Convert raw vibration CSV files into 1D FFT spectrogram slices and train a 4-block 1D ResNet in PyTorch.',
      },
      {
        id: 2,
        title: 'Residual Neural Network for Real-Time Solar Panel Micro-Crack Electroluminescence Inspection',
        difficultyLevel: 'Intermediate / Capstone',
        estimatedDuration: '8 to 10 weeks',
        problemSolved:
          'Micro-cracks in photovoltaic solar cells degrade solar farm energy efficiency by up to 25%. Manual visual inspection is labor-intensive and prone to human oversight.',
        proposedMethod:
          'Train a modified ResNet-34 backbone with spatial attention gates mounted on an autonomous ground rover with near-infrared electroluminescence cameras.',
        technologies: ['PyTorch', 'OpenCV', 'TensorRT', 'Jetson Nano / Orin Nano', 'NIR Camera SDK'],
        performanceMetrics: [
          {
            metricName: 'Micro-Crack Detection mAP@0.5',
            targetThreshold: '>= 91.4% mean Average Precision',
            measurementMethod: 'Benchmark on ELPV Photovoltaic Defect Dataset (2,624 images)',
          },
          {
            metricName: 'Inspection Speed',
            targetThreshold: '>= 20 solar panels inspected per minute',
            measurementMethod: 'Automated conveyor simulation benchmark',
          },
          {
            metricName: 'False Alarm Rate',
            targetThreshold: '< 2.5% false positive defect flags on clean panels',
            measurementMethod: 'Validation run across 500 undamaged cell samples',
          },
        ],
        gettingStartedDataset: 'ELPV Dataset (Electroluminescence Images of Photovoltaic Modules)',
        firstMilestone:
          'Preprocess ELPV grayscale images with adaptive histogram equalization and train baseline ResNet-18.',
      },
      {
        id: 3,
        title: 'Physics-Informed Residual Network (PINN) for Lithium-ion Battery Thermal Runaway Prediction',
        difficultyLevel: "Advanced / Master's Thesis",
        estimatedDuration: '12 to 16 weeks',
        problemSolved:
          'Electric vehicle battery packs risk catastrophic thermal runaway during ultra-fast charging. Pure data-driven networks violate heat conservation equations, generating unsafe predictions during edge cases.',
        proposedMethod:
          'Embed 1D Navier-Stokes heat diffusion and Arrhenius chemical reaction rate PDEs directly into the loss function of a deep ResNet estimator, penalizing physical law violations.',
        technologies: ['PyTorch / DeepXDE', 'COMSOL Multiphysics export', 'CAN bus logger', 'SciPy'],
        performanceMetrics: [
          {
            metricName: 'Temperature Prediction Mean Absolute Error',
            targetThreshold: '< 0.85°C across extreme 4C fast-charging cycles',
            measurementMethod: 'Comparison against thermocouple ground truth in battery calorimeter',
          },
          {
            metricName: 'Early Runaway Warning Horizon',
            targetThreshold: '>= 90 seconds prior to critical 80°C threshold',
            measurementMethod: 'Simulated nail-penetration and overcharge test simulations',
          },
          {
            metricName: 'Physical Conservation Adherence',
            targetThreshold: 'Energy conservation residual error < 1.0e-4 W/m^3',
            measurementMethod: 'Evaluating PDE residual loss term across boundary collocation points',
          },
        ],
        gettingStartedDataset: 'NASA Prognostics Battery Aging Dataset & Oxford Battery Degradation Dataset',
        firstMilestone:
          'Formulate the 1D heat equation loss residual in PyTorch using torch.autograd.grad and test on synthetic sine-wave heating.',
      },
    ],
  },
};
