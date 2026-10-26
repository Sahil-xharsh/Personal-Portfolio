---
title: "Self-Attention Mechanism & Matrix Projections"
series: "ml-foundations"
section: "linear-algebra"
order: 1
description: "How key, query and value matrix projections work in transformers, and why the math clicks."
tags: ["linear algebra", "matrices", "transformers"]
---

## Scaled Dot-Product Attention

The self-attention mechanism computes a weighted sum over value vectors $V$, where the weight assigned to each value is calculated by evaluating a compatibility function between the query vector $Q$ and corresponding key vector $K$.

The core mathematical definition formulated by Vaswani et al. is:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where:
* $Q \in \mathbb{R}^{n \times d_k}$ is the matrix of packed query vectors.
* $K \in \mathbb{R}^{m \times d_k}$ is the matrix of packed key vectors.
* $V \in \mathbb{R}^{m \times d_v}$ is the matrix of packed value representations.
* $\frac{1}{\sqrt{d_k}}$ acts as a temperature scaling factor to counteract small gradients in large dimensions when dot products grow large.

## Multi-Head Attention Extension

Rather than computing a single attention pass with $d_{\text{model}}$-dimensional queries, keys, and values, Multi-Head Attention projects queries, keys, and values $h$ times with distinct learned linear projections:

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$

$$\text{where} \quad \text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

With parameter projection matrices:
* $W_i^Q \in \mathbb{R}^{d_{\text{model}} \times d_k}$
* $W_i^K \in \mathbb{R}^{d_{\text{model}} \times d_k}$
* $W_i^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$
* $W^O \in \mathbb{R}^{h d_v \times d_{\text{model}}}$

## Positional Encoding Derivation

Because attention lacks recurrent or convolutional inductive biases, order information must be injected via deterministic or learned positional encodings:

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i / d_{\text{model}}}}\right)$$

$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i / d_{\text{model}}}}\right)$$

## PyTorch Multi-Head Self-Attention Implementation

```python
import math
import torch
import torch.nn as nn

class ScaledDotProductAttention(nn.Module):
    def __init__(self, dropout: float = 0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)

    def forward(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor, mask: torch.Tensor = None):
        d_k = q.size(-1)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        attn_weights = torch.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        output = torch.matmul(attn_weights, v)
        return output, attn_weights
```

> **Computational Complexity:** Self-attention layer complexity is $\mathcal{O}(n^2 \cdot d)$, making naive attention quadratic in sequence length $n$. For long contexts ($n > 8192$), linear or chunked approximations (FlashAttention, RingAttention) are preferred.
