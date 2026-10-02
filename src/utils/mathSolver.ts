/**
 * VNRT Online Math Solver Utilities
 * Algorithms for Linear Systems (1-4 unknowns) and Polynomial Equations (degrees 1-4)
 */

export interface SystemSolution {
  status: 'unique' | 'infinite' | 'none';
  variables: string[];
  values: number[]; // For unique solutions
  fractions: string[];
  steps: string[];
  determinant: number;
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface PolynomialSolution {
  degree: number;
  coefficients: number[];
  realRoots: number[];
  complexRoots: ComplexNumber[];
  steps: string[];
  discriminant?: number;
  extrema?: { x: number; y: number; type: 'min' | 'max' | 'inflection' }[];
}

/**
 * Format a number as a simplified fraction if close to rational (e.g. 0.75 -> "3/4")
 */
export function toFraction(val: number, tolerance = 1e-6): string {
  if (!isFinite(val)) return String(val);
  if (Math.abs(val) < tolerance) return '0';
  if (Math.abs(val - Math.round(val)) < tolerance) {
    return String(Math.round(val));
  }

  const sign = val < 0 ? '-' : '';
  const x = Math.abs(val);

  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = x;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(x - h1 / k1) > x * tolerance && k1 <= 1000);

  if (k1 === 1) return `${sign}${h1}`;
  if (k1 > 1000) return val.toFixed(4).replace(/\.?0+$/, '');
  return `${sign}${h1}/${k1}`;
}

export function formatComplex(c: ComplexNumber, tolerance = 1e-5): string {
  const isRealZero = Math.abs(c.re) < tolerance;
  const isImagZero = Math.abs(c.im) < tolerance;

  if (isImagZero) {
    return toFraction(c.re);
  }

  const imAbs = Math.abs(c.im);
  const imStr = Math.abs(imAbs - 1) < tolerance ? 'i' : `${toFraction(imAbs)}i`;
  const sign = c.im < 0 ? '-' : '+';

  if (isRealZero) {
    return c.im < 0 ? `-${imStr}` : imStr;
  }

  return `${toFraction(c.re)} ${sign} ${imStr}`;
}

/**
 * Solve a system of N linear equations with N unknowns (N = 1 to 4)
 * Matrix A: N x N, vector B: N x 1
 */
export function solveLinearSystem(A: number[][], B: number[], varNames = ['x', 'y', 'z', 't']): SystemSolution {
  const n = B.length;
  const steps: string[] = [];
  const vars = varNames.slice(0, n);

  steps.push(`Khởi tạo hệ ${n} phương trình với ${n} ẩn: [${vars.join(', ')}]`);

  if (n === 1) {
    const a = A[0][0];
    const b = B[0];
    steps.push(`Phương trình: ${a}*${vars[0]} = ${b}`);
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        return { status: 'infinite', variables: vars, values: [], fractions: [], steps, determinant: 0 };
      }
      return { status: 'none', variables: vars, values: [], fractions: [], steps, determinant: 0 };
    }
    const sol = b / a;
    steps.push(`Suy ra: ${vars[0]} = ${b} / ${a} = ${toFraction(sol)}`);
    return {
      status: 'unique',
      variables: vars,
      values: [sol],
      fractions: [toFraction(sol)],
      steps,
      determinant: a,
    };
  }

  // Build augmented matrix [A | B]
  const M: number[][] = [];
  for (let i = 0; i < n; i++) {
    M.push([...A[i], B[i]]);
  }

  // Gaussian elimination with partial pivoting
  let det = 1;
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < 1e-10) {
      det = 0;
      continue;
    }

    if (maxRow !== col) {
      const temp = M[col];
      M[col] = M[maxRow];
      M[maxRow] = temp;
      det = -det;
      steps.push(`Đổi dòng ${col + 1} và dòng ${maxRow + 1}`);
    }

    det *= M[col][col];

    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) < 1e-12) continue;
      const factor = M[row][col] / M[col][col];
      steps.push(`Dòng ${row + 1} = Dòng ${row + 1} - (${factor.toFixed(3)}) * Dòng ${col + 1}`);
      for (let j = col; j <= n; j++) {
        M[row][j] -= factor * M[col][j];
      }
    }
  }

  // Check for no solution or infinite solutions
  for (let i = 0; i < n; i++) {
    let allZeros = true;
    for (let j = 0; j < n; j++) {
      if (Math.abs(M[i][j]) > 1e-9) {
        allZeros = false;
        break;
      }
    }
    if (allZeros) {
      if (Math.abs(M[i][n]) > 1e-9) {
        steps.push(`Xuất hiện dòng dạng 0 = ${M[i][n].toFixed(4)} (Vô lý) -> Hệ vô nghiệm`);
        return { status: 'none', variables: vars, values: [], fractions: [], steps, determinant: det };
      } else {
        steps.push(`Xuất hiện dòng dạng 0 = 0 -> Hệ có vô số nghiệm phụ thuộc tham số`);
        return { status: 'infinite', variables: vars, values: [], fractions: [], steps, determinant: det };
      }
    }
  }

  if (Math.abs(det) < 1e-9) {
    steps.push(`Định thức ma trận Det(A) ≈ 0 -> Hệ vô nghiệm hoặc vô số nghiệm`);
    return { status: 'infinite', variables: vars, values: [], fractions: [], steps, determinant: 0 };
  }

  // Back-substitution
  const sol: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * sol[j];
    }
    sol[i] = sum / M[i][i];
    steps.push(`Thế ngược tìm ${vars[i]} = ${sol[i].toFixed(4)} (${toFraction(sol[i])})`);
  }

  return {
    status: 'unique',
    variables: vars,
    values: sol,
    fractions: sol.map(toFraction),
    steps,
    determinant: det,
  };
}

/**
 * Solve Degree 1: ax + b = 0
 */
export function solveLinear(a: number, b: number): PolynomialSolution {
  const steps: string[] = [];
  steps.push(`Phương trình bậc 1: ${a}x + (${b}) = 0`);

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      steps.push(`0x = 0: Phương trình có vô số nghiệm (x ∈ ℝ)`);
      return { degree: 1, coefficients: [a, b], realRoots: [], complexRoots: [], steps };
    }
    steps.push(`0x = ${-b}: Phương trình vô nghiệm`);
    return { degree: 1, coefficients: [a, b], realRoots: [], complexRoots: [], steps };
  }

  const root = -b / a;
  steps.push(`Chuyển vế: ${a}x = ${-b}`);
  steps.push(`Nghiệm duy nhất: x = ${-b}/${a} = ${toFraction(root)}`);

  return {
    degree: 1,
    coefficients: [a, b],
    realRoots: [root],
    complexRoots: [],
    steps,
  };
}

/**
 * Solve Degree 2: ax^2 + bx + c = 0
 */
export function solveQuadratic(a: number, b: number, c: number): PolynomialSolution {
  if (Math.abs(a) < 1e-12) {
    return solveLinear(b, c);
  }

  const steps: string[] = [];
  steps.push(`Phương trình bậc 2: (${a})x² + (${b})x + (${c}) = 0`);

  const delta = b * b - 4 * a * c;
  steps.push(`Biệt thức: Δ = b² - 4ac = (${b})² - 4*(${a})*(${c}) = ${delta.toFixed(4)}`);

  // Extrema: Vertex of parabola x = -b / (2a)
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;
  const extrema: { x: number; y: number; type: 'min' | 'max' | 'inflection' }[] = [
    { x: vx, y: vy, type: a > 0 ? 'min' : 'max' },
  ];
  steps.push(`Tọa độ đỉnh Parabol: (${vx.toFixed(4)}, ${vy.toFixed(4)}) - Điểm ${a > 0 ? 'cực tiểu' : 'cực đại'}`);

  if (Math.abs(delta) < 1e-10) {
    const x = -b / (2 * a);
    steps.push(`Δ = 0: Phương trình có nghiệm kép: x₁ = x₂ = -b / (2a) = ${toFraction(x)}`);
    return {
      degree: 2,
      coefficients: [a, b, c],
      realRoots: [x],
      complexRoots: [],
      steps,
      discriminant: 0,
      extrema,
    };
  }

  if (delta > 0) {
    const sqrtDelta = Math.sqrt(delta);
    const x1 = (-b + sqrtDelta) / (2 * a);
    const x2 = (-b - sqrtDelta) / (2 * a);
    steps.push(`Δ > 0: Phương trình có 2 nghiệm thực phân biệt:`);
    steps.push(`x₁ = (-b + √Δ)/(2a) = (${-b} + ${sqrtDelta.toFixed(4)}) / ${2 * a} = ${toFraction(x1)} (${x1.toFixed(4)})`);
    steps.push(`x₂ = (-b - √Δ)/(2a) = (${-b} - ${sqrtDelta.toFixed(4)}) / ${2 * a} = ${toFraction(x2)} (${x2.toFixed(4)})`);
    return {
      degree: 2,
      coefficients: [a, b, c],
      realRoots: [x1, x2].sort((p, q) => p - q),
      complexRoots: [],
      steps,
      discriminant: delta,
      extrema,
    };
  }

  // Complex roots
  const re = -b / (2 * a);
  const im = Math.sqrt(-delta) / (2 * Math.abs(a));
  steps.push(`Δ < 0: Phương trình không có nghiệm thực, có 2 nghiệm phức liên hợp:`);
  steps.push(`x₁ = ${formatComplex({ re, im })}`);
  steps.push(`x₂ = ${formatComplex({ re, im: -im })}`);

  return {
    degree: 2,
    coefficients: [a, b, c],
    realRoots: [],
    complexRoots: [
      { re, im },
      { re, im: -im },
    ],
    steps,
    discriminant: delta,
    extrema,
  };
}

/**
 * Solve Degree 3: ax^3 + bx^2 + cx + d = 0 using Cardano's & Viète's Formulas
 */
export function solveCubic(a: number, b: number, c: number, d: number): PolynomialSolution {
  if (Math.abs(a) < 1e-12) {
    return solveQuadratic(b, c, d);
  }

  const steps: string[] = [];
  steps.push(`Phương trình bậc 3: (${a})x³ + (${b})x² + (${c})x + (${d}) = 0`);

  // Normalize: x^3 + a1*x^2 + a2*x + a3 = 0
  const a1 = b / a;
  const a2 = c / a;
  const a3 = d / a;

  // Depressed cubic: t^3 + pt + q = 0 by substituting x = t - a1/3
  const p = a2 - (a1 * a1) / 3;
  const q = (2 * a1 * a1 * a1) / 27 - (a1 * a2) / 3 + a3;

  steps.push(`Đặt x = t - (${a1.toFixed(3)}/3), đưa về dạng chính tắc t³ + pt + q = 0`);
  steps.push(`Hệ số rút gọn: p = ${p.toFixed(4)}, q = ${q.toFixed(4)}`);

  // Cardano's discriminant D = (q/2)^2 + (p/3)^3
  const D = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);
  steps.push(`Biệt thức Cardano: D = (q/2)² + (p/3)³ = ${D.toFixed(6)}`);

  const realRoots: number[] = [];
  const complexRoots: ComplexNumber[] = [];
  const shift = a1 / 3;

  // Extrema: f'(x) = 3ax^2 + 2bx + c = 0
  const extrema: { x: number; y: number; type: 'min' | 'max' | 'inflection' }[] = [];
  const dDelta = 4 * b * b - 12 * a * c;
  if (dDelta > 0) {
    const ex1 = (-2 * b + Math.sqrt(dDelta)) / (6 * a);
    const ex2 = (-2 * b - Math.sqrt(dDelta)) / (6 * a);
    const ey1 = a * Math.pow(ex1, 3) + b * ex1 * ex1 + c * ex1 + d;
    const ey2 = a * Math.pow(ex2, 3) + b * ex2 * ex2 + c * ex2 + d;
    extrema.push({ x: ex1, y: ey1, type: a > 0 ? 'min' : 'max' });
    extrema.push({ x: ex2, y: ey2, type: a > 0 ? 'max' : 'min' });
  }

  // Inflection point: x = -b/(3a)
  const infX = -b / (3 * a);
  const infY = a * Math.pow(infX, 3) + b * infX * infX + c * infX + d;
  extrema.push({ x: infX, y: infY, type: 'inflection' });

  if (Math.abs(D) < 1e-9) {
    if (Math.abs(p) < 1e-9) {
      // 1 triple real root
      const r = -shift;
      realRoots.push(r);
      steps.push(`D = 0 và p = 0: Phương trình có 1 nghiệm bội ba: x = ${toFraction(r)}`);
    } else {
      // 1 single and 1 double real root
      const r1 = 2 * Math.cbrt(-q / 2) - shift;
      const r2 = -Math.cbrt(-q / 2) - shift;
      realRoots.push(r1, r2);
      steps.push(`D = 0: Phương trình có 1 nghiệm đơn và 1 nghiệm kép:`);
      steps.push(`x₁ = ${toFraction(r1)} (${r1.toFixed(4)})`);
      steps.push(`x₂ = x₃ = ${toFraction(r2)} (${r2.toFixed(4)})`);
    }
  } else if (D < 0) {
    // 3 distinct real roots (use trigonometric formula)
    const m = 2 * Math.sqrt(-p / 3);
    const phi = Math.acos(-q / (2 * Math.sqrt(-Math.pow(p / 3, 3))));
    const t1 = m * Math.cos(phi / 3);
    const t2 = m * Math.cos((phi + 2 * Math.PI) / 3);
    const t3 = m * Math.cos((phi + 4 * Math.PI) / 3);

    const r1 = t1 - shift;
    const r2 = t2 - shift;
    const r3 = t3 - shift;

    realRoots.push(r1, r2, r3);
    steps.push(`D < 0: Phương trình có 3 nghiệm thực phân biệt (Dùng công thức Viète):`);
    steps.push(`x₁ = ${toFraction(r1)} (${r1.toFixed(4)})`);
    steps.push(`x₂ = ${toFraction(r2)} (${r2.toFixed(4)})`);
    steps.push(`x₃ = ${toFraction(r3)} (${r3.toFixed(4)})`);
  } else {
    // D > 0: 1 real root and 2 complex conjugate roots
    const sqrtD = Math.sqrt(D);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);

    const r1 = u + v - shift;
    realRoots.push(r1);

    const cRe = -(u + v) / 2 - shift;
    const cIm = (Math.sqrt(3) / 2) * Math.abs(u - v);

    complexRoots.push({ re: cRe, im: cIm });
    complexRoots.push({ re: cRe, im: -cIm });

    steps.push(`D > 0: Phương trình có 1 nghiệm thực và 2 nghiệm phức liên hợp:`);
    steps.push(`Nghiệm thực: x₁ = ${toFraction(r1)} (${r1.toFixed(4)})`);
    steps.push(`Nghiệm phức x₂ = ${formatComplex({ re: cRe, im: cIm })}`);
    steps.push(`Nghiệm phức x₃ = ${formatComplex({ re: cRe, im: -cIm })}`);
  }

  return {
    degree: 3,
    coefficients: [a, b, c, d],
    realRoots: realRoots.sort((x, y) => x - y),
    complexRoots,
    steps,
    discriminant: D,
    extrema,
  };
}

/**
 * Solve Degree 4: ax^4 + bx^3 + cx^2 + dx + e = 0 using Ferrari's Method & Jenkins-Traub numerical refinement
 */
export function solveQuartic(a: number, b: number, c: number, d: number, e: number): PolynomialSolution {
  if (Math.abs(a) < 1e-12) {
    return solveCubic(b, c, d, e);
  }

  const steps: string[] = [];
  steps.push(`Phương trình bậc 4: (${a})x⁴ + (${b})x³ + (${c})x² + (${d})x + (${e}) = 0`);

  // Normalize: x^4 + a1*x^3 + a2*x^2 + a3*x + a4 = 0
  const a1 = b / a;
  const a2 = c / a;
  const a3 = d / a;
  const a4 = e / a;

  // Substitute x = y - a1/4 to obtain depressed quartic: y^4 + p*y^2 + q*y + r = 0
  const shift = a1 / 4;
  const p = a2 - (3 * a1 * a1) / 8;
  const q = a3 - (a1 * a2) / 2 + (a1 * a1 * a1) / 8;
  const r = a4 - (a1 * a3) / 4 + (a1 * a1 * a2) / 16 - (3 * a1 * a1 * a1 * a1) / 256;

  steps.push(`Đặt x = y - (${a1.toFixed(3)}/4), đưa về dạng chính tắc: y⁴ + py² + qy + r = 0`);
  steps.push(`Hệ số rút gọn: p = ${p.toFixed(4)}, q = ${q.toFixed(4)}, r = ${r.toFixed(4)}`);

  const realRoots: number[] = [];
  const complexRoots: ComplexNumber[] = [];

  // Case 1: Biquadratic (q ≈ 0) => y^4 + py^2 + r = 0
  if (Math.abs(q) < 1e-9) {
    steps.push(`Vì q ≈ 0, đây là phương trình trùng phương y⁴ + py² + r = 0`);
    const quadSol = solveQuadratic(1, p, r);
    for (const z of quadSol.realRoots) {
      if (z >= 0) {
        const sqrtZ = Math.sqrt(z);
        realRoots.push(sqrtZ - shift);
        realRoots.push(-sqrtZ - shift);
      } else {
        const im = Math.sqrt(-z);
        complexRoots.push({ re: -shift, im });
        complexRoots.push({ re: -shift, im: -im });
      }
    }
    for (const cz of quadSol.complexRoots) {
      // sqrt of complex number
      const mag = Math.sqrt(cz.re * cz.re + cz.im * cz.im);
      const angle = Math.atan2(cz.im, cz.re) / 2;
      const u = Math.sqrt(mag) * Math.cos(angle);
      const v = Math.sqrt(mag) * Math.sin(angle);
      complexRoots.push({ re: u - shift, im: v });
      complexRoots.push({ re: -u - shift, im: -v });
    }
  } else {
    // Ferrari resolvent cubic: 8m^3 + 8p*m^2 + (2p^2 - 8r)*m - q^2 = 0
    // Substitute m = 2y: solve cubic resolvent
    steps.push(`Giải phương trình giải thức bậc 3 Ferrari`);
    const cubicRes = solveCubic(1, 2 * p, p * p - 4 * r, -q * q);
    let m = 0;
    for (const root of cubicRes.realRoots) {
      if (root > 0) {
        m = root;
        break;
      }
    }
    if (m <= 0 && cubicRes.realRoots.length > 0) {
      m = Math.max(...cubicRes.realRoots);
    }
    if (m < 0) m = Math.abs(m);

    const sqrtM = Math.sqrt(m);
    const k1 = (p + m - q / sqrtM) / 2;
    const k2 = (p + m + q / sqrtM) / 2;

    // Two quadratics: y^2 + sqrtM*y + k1 = 0 and y^2 - sqrtM*y + k2 = 0
    const q1 = solveQuadratic(1, sqrtM, k1);
    const q2 = solveQuadratic(1, -sqrtM, k2);

    for (const r of q1.realRoots) realRoots.push(r - shift);
    for (const cr of q1.complexRoots) complexRoots.push({ re: cr.re - shift, im: cr.im });

    for (const r of q2.realRoots) realRoots.push(r - shift);
    for (const cr of q2.complexRoots) complexRoots.push({ re: cr.re - shift, im: cr.im });
  }

  // Deduplicate very close real roots
  const cleanReal: number[] = [];
  realRoots.sort((u, v) => u - v);
  for (const r of realRoots) {
    if (!cleanReal.some((exist) => Math.abs(exist - r) < 1e-5)) {
      cleanReal.push(r);
    }
  }

  steps.push(`Tìm được ${cleanReal.length} nghiệm thực và ${complexRoots.length} nghiệm phức:`);
  cleanReal.forEach((r, idx) => {
    steps.push(`x_${idx + 1} = ${toFraction(r)} (${r.toFixed(4)})`);
  });
  complexRoots.forEach((c, idx) => {
    steps.push(`x_${cleanReal.length + idx + 1} = ${formatComplex(c)}`);
  });

  return {
    degree: 4,
    coefficients: [a, b, c, d, e],
    realRoots: cleanReal,
    complexRoots,
    steps,
  };
}
