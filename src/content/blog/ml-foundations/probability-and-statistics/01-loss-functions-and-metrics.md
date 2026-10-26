---
title: "Loss Functions & Evaluation Metrics"
series: "ml-foundations"
section: "probability-and-statistics"
order: 1
description: "A practical guide to how common loss functions work, why we pick them and how they handle noisy data."
tags: ["probability & stats", "loss functions", "evaluation"]
---

## Overview

In statistical machine learning, loss functions quantify the discrepancy between the hypothesis predictions $\hat{y}$ and true ground-truth targets $y$. Choosing the appropriate loss function dictates the geometry of the optimization landscape, gradient stability under outliers, and convergence characteristics.

> **Key Rule of Thumb:** When label noise is Gaussian, Mean Squared Error optimizes for the conditional expectation $E[Y|X]$. When label noise exhibits heavy Laplace tails, Mean Absolute Error optimizes for the conditional median.

## Loss Function Comparison Table

The following comparison summarizes standard loss formulations, their mathematical expressions, gradient properties, and standard domains:

| Loss Function | Target Domain | Mathematical Definition | Gradient w.r.t $\hat{y}$ | Outlier Sensitivity | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mean Squared Error (L2)** | $\mathbb{R}$ continuous | $\frac{1}{2}(y - \hat{y})^2$ | $- (y - \hat{y})$ | High (quadratic penalty) | Standard regression with Gaussian noise |
| **Mean Absolute Error (L1)** | $\mathbb{R}$ continuous | $\|y - \hat{y}\|$ | $-\text{sign}(y - \hat{y})$ | Low (linear penalty) | Robust regression, median estimation |
| **Huber Loss ($\delta$)** | $\mathbb{R}$ continuous | $\begin{cases} \frac{1}{2}(y-\hat{y})^2 & \text{if } \|y-\hat{y}\| \le \delta \\ \delta(\|y-\hat{y}\| - \frac{1}{2}\delta) & \text{otherwise} \end{cases}$ | $\begin{cases} -(y-\hat{y}) \\ -\delta \cdot \text{sign}(y-\hat{y}) \end{cases}$ | Moderate (switches to linear) | Outlier-tolerant regression, Reinforcement Learning |
| **Binary Cross-Entropy (Log Loss)** | $\{0, 1\}$ probabilities | $-[y \log(\hat{y}) + (1-y)\log(1-\hat{y})]$ | $\frac{\hat{y} - y}{\hat{y}(1 - \hat{y})}$ | High near 0 and 1 | Binary classification, logistic regression |
| **Categorical Cross-Entropy** | $\{1, \dots, K\}$ simplex | $-\sum_{k=1}^K y_k \log(\hat{y}_k)$ | $\hat{y}_k - y_k$ (with Softmax) | Moderate | Multi-class classification |
| **Kullback-Leibler Divergence** | Probability distributions | $\sum_{x} P(x) \log\left(\frac{P(x)}{Q(x)}\right)$ | $\frac{Q(x) - P(x)}{Q(x)}$ | High when $Q(x) \to 0$ | VAEs, Knowledge Distillation |

## Empirical Implementation

Here is a vectorized PyTorch implementation illustrating robust loss computation with smooth gradient transitions:

```python
import torch
import torch.nn as nn

class CustomHuberLoss(nn.Module):
    """
    Smooth L1 / Huber Loss implementation with threshold delta.
    Avoids gradient explosion when residuals grow large.
    """
    def __init__(self, delta: float = 1.0):
        super().__init__()
        self.delta = delta

    def forward(self, y_pred: torch.Tensor, y_true: torch.Tensor) -> torch.Tensor:
        residual = torch.abs(y_pred - y_true)
        is_small = residual <= self.delta
        small_loss = 0.5 * torch.pow(residual, 2)
        large_loss = self.delta * (residual - 0.5 * self.delta)
        return torch.where(is_small, small_loss, large_loss).mean()
```

## Summary & Best Practices

1. Never use Mean Squared Error when dataset labels contain extreme measurement anomalies without prior cleaning.
2. For class imbalance in classification tasks, consider weighting loss terms inversely proportional to class frequencies $w_c = N / (K \cdot N_c)$.
3. Cross-entropy paired with Softmax provides an exceptionally well-conditioned gradient $\nabla_z \mathcal{L} = \hat{y} - y$, preventing vanishing gradients early in training.
