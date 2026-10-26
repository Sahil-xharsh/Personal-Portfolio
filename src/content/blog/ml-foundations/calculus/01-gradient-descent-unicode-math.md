---
title: "Gradient Descent & Optimization Calculus"
series: "ml-foundations"
section: "calculus"
order: 1
description: "A clear walkthrough of gradients, learning rates and update rules with step-by-step formulas."
tags: ["calculus", "optimization", "gradients"]
---

## Core Derivations & Analytical Updates

The following analytical notes detail parameter updates, gradient accumulations, and learning rates using standard Unicode notation frequently recorded during research iterations:

* **Batch Cost Function (Mean Squared Error):**
  J(θ) = (1 / 2m) · Σ(h_θ(x^(i)) - y^(i))² for i = 1 to m
  Where m is sample size and h_θ(x) = θ₀ + θ₁·x₁ + θ₂·x₂ + ... + θ_n·x_n.

* **Partial Derivative w.r.t Feature Weight θ_j:**
  ∂J(θ) / ∂θ_j = (1 / m) · Σ(h_θ(x^(i)) - y^(i)) · x_j^(i)
  Evaluating along every coordinate direction j ∈ {0, 1, ..., n}.

* **Standard Gradient Descent Update Rule:**
  θ_j := θ_j - α · (∂J(θ) / ∂θ_j)
  Where α > 0 represents the step size or learning rate.

* **Sample Mean Calculation:**
  x̄ = (1 / n) · Σ x_i for i = 1 to n
  Variance estimation follows: σ² = (1 / (n - 1)) · Σ(x_i - x̄)².

* **Root Mean Square Normalization:**
  RMS(x) = √( (1 / n) · Σ x_i² )
  Standard deviation yields: σ = √( (1 / n) · Σ(x_i - x̄)² ).

* **Adaptive Moment Estimation (Adam) Moments:**
  First moment estimate: m_t = β₁ · m_(t-1) + (1 - β₁) · g_t
  Second uncentered moment estimate: v_t = β₂ · v_(t-1) + (1 - β₂) · g_t²
  Bias-corrected first moment: m̂_t = m_t / (1 - β₁^t)
  Bias-corrected second moment: v̂_t = v_t / (1 - β₂^t)
  Parameter update vector: θ_t := θ_(t-1) - (α / (√(v̂_t) + ε)) · m̂_t

* **Continuous Expectation Integral Formulation:**
  E[X] = ∫ x · p(x) dx over the interval (-∞, +∞)
  Conditional loss integral: L_total = ∫∫ L(y, f(x)) · p(x, y) dx dy

## Long Formula Horizontal Scroll Demonstration

Here is an extended multivariate loss boundary equation designed to test wide inline formulas without clipping or causing layout overflow:

* **Generalized Regularized Elastic-Net Objective Expansion:**
  L(w, b) = (1 / 2n) · Σ_{i=1}^n (y_i - (w^T · x_i + b))² + λ₁ · Σ_{j=1}^d |w_j| + (λ₂ / 2) · Σ_{j=1}^d w_j² + (γ / 3) · Σ_{k=1}^p (x̄_k - μ_k)³ / σ_k³

## Python Reference Implementation

```python
import numpy as np

def gradient_descent_step(X: np.ndarray, y: np.ndarray, theta: np.ndarray, alpha: float):
    """
    Computes one vectorized gradient descent iteration.
    X: Shape (m, n)
    y: Shape (m, 1)
    theta: Shape (n, 1)
    """
    m = len(y)
    predictions = X @ theta
    errors = predictions - y
    gradient = (1 / m) * (X.T @ errors)
    theta_next = theta - alpha * gradient
    cost = (1 / (2 * m)) * np.sum(errors ** 2)
    return theta_next, cost
```

## Observations on Step Size Stability

> **Convergence Criterion:** If learning rate α is too large, the cost sequence J(θ) will oscillate or explode to +∞. If learning rate α is too small, convergence will require an impractical count of epochs. Always normalize inputs such that feature dimensions possess zero mean (x̄ = 0) and unit variance (σ² = 1).
