/**
 * Symbolic & Step-by-Step Derivative Calculation Engine
 * Supports Polynomials, Trigonometric, Exponential, Logarithmic, Product Rule, Quotient Rule, Chain Rule
 */

export interface DerivativeStep {
  title: string;
  ruleName: string;
  formula: string;
  explanation: string;
}

export interface DerivativeResult {
  expression: string;
  firstDerivative: string;
  secondDerivative?: string;
  steps: DerivativeStep[];
  evalAt?: {
    x0: number;
    fx0: number;
    fPrimeX0: number;
    fDoublePrimeX0: number;
    tangentLine: string; // y = ax + b
  };
}

/**
 * Tokenizer & Tree Parser for Symbolic Differentiation
 */
type ExprNode =
  | { type: 'num'; val: number }
  | { type: 'var'; name: string }
  | { type: 'add'; left: ExprNode; right: ExprNode }
  | { type: 'sub'; left: ExprNode; right: ExprNode }
  | { type: 'mul'; left: ExprNode; right: ExprNode }
  | { type: 'div'; left: ExprNode; right: ExprNode }
  | { type: 'pow'; base: ExprNode; exp: ExprNode }
  | { type: 'func'; name: 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt'; arg: ExprNode };

// Parser from string to ExprNode
class ExprParser {
  private pos = 0;
  private str = '';

  constructor(str: string) {
    this.str = str.replace(/\s+/g, '');
  }

  parse(): ExprNode {
    this.pos = 0;
    const res = this.parseAddSub();
    return res;
  }

  private peek(): string {
    return this.str[this.pos] || '';
  }

  private get(): string {
    return this.str[this.pos++] || '';
  }

  private parseAddSub(): ExprNode {
    let node = this.parseMulDiv();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.get();
      const right = this.parseMulDiv();
      if (op === '+') {
        node = { type: 'add', left: node, right };
      } else {
        node = { type: 'sub', left: node, right };
      }
    }
    return node;
  }

  private parseMulDiv(): ExprNode {
    let node = this.parsePow();
    while (this.peek() === '*' || this.peek() === '/') {
      const op = this.get();
      const right = this.parsePow();
      if (op === '*') {
        node = { type: 'mul', left: node, right };
      } else {
        node = { type: 'div', left: node, right };
      }
    }
    return node;
  }

  private parsePow(): ExprNode {
    const node = this.parsePrimary();
    if (this.peek() === '^') {
      this.get(); // consume ^
      const exp = this.parsePrimary();
      return { type: 'pow', base: node, exp };
    }
    return node;
  }

  private parsePrimary(): ExprNode {
    // Unary minus
    if (this.peek() === '-') {
      this.get();
      const next = this.parsePrimary();
      return { type: 'mul', left: { type: 'num', val: -1 }, right: next };
    }
    if (this.peek() === '+') {
      this.get();
      return this.parsePrimary();
    }

    if (this.peek() === '(') {
      this.get(); // consume (
      const expr = this.parseAddSub();
      if (this.peek() === ')') this.get();
      return expr;
    }

    // Number
    if (/[\d.]/.test(this.peek())) {
      let numStr = '';
      while (/[\d.]/.test(this.peek())) {
        numStr += this.get();
      }
      return { type: 'num', val: parseFloat(numStr) };
    }

    // Identifier / Function / Variable
    if (/[a-zA-Z]/.test(this.peek())) {
      let name = '';
      while (/[a-zA-Z]/.test(this.peek())) {
        name += this.get();
      }
      name = name.toLowerCase();

      if (name === 'x') {
        return { type: 'var', name: 'x' };
      }

      if (['sin', 'cos', 'tan', 'exp', 'ln', 'sqrt'].includes(name)) {
        if (this.peek() === '(') {
          this.get(); // (
          const arg = this.parseAddSub();
          if (this.peek() === ')') this.get();
          return { type: 'func', name: name as any, arg };
        }
      }

      if (name === 'e') {
        return { type: 'num', val: Math.E };
      }
      if (name === 'pi') {
        return { type: 'num', val: Math.PI };
      }

      return { type: 'var', name };
    }

    // Fallback
    return { type: 'num', val: 0 };
  }
}

// Convert ExprNode back to formatted Math String
export function stringifyExpr(node: ExprNode): string {
  switch (node.type) {
    case 'num':
      return Number.isInteger(node.val) ? String(node.val) : node.val.toFixed(3).replace(/\.?0+$/, '');
    case 'var':
      return node.name;
    case 'add':
      return `${stringifyExpr(node.left)} + ${stringifyExpr(node.right)}`;
    case 'sub': {
      const rightStr = stringifyExpr(node.right);
      return `${stringifyExpr(node.left)} - ${node.right.type === 'add' || node.right.type === 'sub' ? `(${rightStr})` : rightStr}`;
    }
    case 'mul': {
      const lStr = node.left.type === 'add' || node.left.type === 'sub' ? `(${stringifyExpr(node.left)})` : stringifyExpr(node.left);
      const rStr = node.right.type === 'add' || node.right.type === 'sub' ? `(${stringifyExpr(node.right)})` : stringifyExpr(node.right);
      if (node.left.type === 'num' && node.left.val === -1) {
        return `-${rStr}`;
      }
      if (node.left.type === 'num' && (node.right.type === 'var' || node.right.type === 'func')) {
        return `${stringifyExpr(node.left)}${rStr}`;
      }
      return `${lStr} * ${rStr}`;
    }
    case 'div': {
      const lStr = node.left.type === 'add' || node.left.type === 'sub' ? `(${stringifyExpr(node.left)})` : stringifyExpr(node.left);
      const rStr = node.right.type !== 'var' && node.right.type !== 'num' ? `(${stringifyExpr(node.right)})` : stringifyExpr(node.right);
      return `${lStr} / ${rStr}`;
    }
    case 'pow': {
      const bStr = node.base.type !== 'var' && node.base.type !== 'num' ? `(${stringifyExpr(node.base)})` : stringifyExpr(node.base);
      return `${bStr}^${stringifyExpr(node.exp)}`;
    }
    case 'func':
      return `${node.name}(${stringifyExpr(node.arg)})`;
  }
}

// Simplify algebraic nodes
export function simplify(node: ExprNode): ExprNode {
  switch (node.type) {
    case 'num':
    case 'var':
      return node;
    case 'add': {
      const left = simplify(node.left);
      const right = simplify(node.right);
      if (left.type === 'num' && left.val === 0) return right;
      if (right.type === 'num' && right.val === 0) return left;
      if (left.type === 'num' && right.type === 'num') return { type: 'num', val: left.val + right.val };
      return { type: 'add', left, right };
    }
    case 'sub': {
      const left = simplify(node.left);
      const right = simplify(node.right);
      if (right.type === 'num' && right.val === 0) return left;
      if (left.type === 'num' && right.type === 'num') return { type: 'num', val: left.val - right.val };
      return { type: 'sub', left, right };
    }
    case 'mul': {
      const left = simplify(node.left);
      const right = simplify(node.right);
      if ((left.type === 'num' && left.val === 0) || (right.type === 'num' && right.val === 0)) return { type: 'num', val: 0 };
      if (left.type === 'num' && left.val === 1) return right;
      if (right.type === 'num' && right.val === 1) return left;
      if (left.type === 'num' && right.type === 'num') return { type: 'num', val: left.val * right.val };
      return { type: 'mul', left, right };
    }
    case 'div': {
      const left = simplify(node.left);
      const right = simplify(node.right);
      if (left.type === 'num' && left.val === 0) return { type: 'num', val: 0 };
      if (right.type === 'num' && right.val === 1) return left;
      if (left.type === 'num' && right.type === 'num' && right.val !== 0) return { type: 'num', val: left.val / right.val };
      return { type: 'div', left, right };
    }
    case 'pow': {
      const base = simplify(node.base);
      const exp = simplify(node.exp);
      if (exp.type === 'num' && exp.val === 0) return { type: 'num', val: 1 };
      if (exp.type === 'num' && exp.val === 1) return base;
      if (base.type === 'num' && base.val === 0) return { type: 'num', val: 0 };
      if (base.type === 'num' && exp.type === 'num') return { type: 'num', val: Math.pow(base.val, exp.val) };
      return { type: 'pow', base, exp };
    }
    case 'func': {
      const arg = simplify(node.arg);
      return { type: 'func', name: node.name, arg };
    }
  }
}

// Differentiate an ExprNode with respect to x
function diffNode(node: ExprNode, steps: DerivativeStep[]): ExprNode {
  switch (node.type) {
    case 'num':
      return { type: 'num', val: 0 };

    case 'var':
      if (node.name === 'x') {
        return { type: 'num', val: 1 };
      }
      return { type: 'num', val: 0 };

    case 'add': {
      const dl = diffNode(node.left, steps);
      const dr = diffNode(node.right, steps);
      steps.push({
        title: 'Quy tắc đạo hàm tổng',
        ruleName: 'Tổng: [u + v]\' = u\' + v\'',
        formula: `[${stringifyExpr(node.left)} + ${stringifyExpr(node.right)}]' = [${stringifyExpr(node.left)}]' + [${stringifyExpr(node.right)}]'`,
        explanation: 'Đạo hàm của một tổng bằng tổng các đạo hàm của từng số hạng.'
      });
      return { type: 'add', left: dl, right: dr };
    }

    case 'sub': {
      const dl = diffNode(node.left, steps);
      const dr = diffNode(node.right, steps);
      steps.push({
        title: 'Quy tắc đạo hàm hiệu',
        ruleName: 'Hiệu: [u - v]\' = u\' - v\'',
        formula: `[${stringifyExpr(node.left)} - ${stringifyExpr(node.right)}]' = [${stringifyExpr(node.left)}]' - [${stringifyExpr(node.right)}]'`,
        explanation: 'Đạo hàm của một hiệu bằng hiệu các đạo hàm.'
      });
      return { type: 'sub', left: dl, right: dr };
    }

    case 'mul': {
      // Check if left is a constant number
      if (node.left.type === 'num') {
        const dr = diffNode(node.right, steps);
        steps.push({
          title: 'Đạo hàm hằng số nhân hàm số',
          ruleName: 'Hằng số: [c * u]\' = c * u\'',
          formula: `[${node.left.val} * ${stringifyExpr(node.right)}]' = ${node.left.val} * [${stringifyExpr(node.right)}]'`,
          explanation: 'Hằng số số học được giữ nguyên đưa ra ngoài dấu đạo hàm.'
        });
        return { type: 'mul', left: node.left, right: dr };
      }

      // General product rule: (u * v)' = u' * v + u * v'
      const dl = diffNode(node.left, steps);
      const dr = diffNode(node.right, steps);
      steps.push({
        title: 'Quy tắc đạo hàm của tích (Product Rule)',
        ruleName: 'Tích: [u * v]\' = u\' * v + u * v\'',
        formula: `[${stringifyExpr(node.left)} * ${stringifyExpr(node.right)}]' = [${stringifyExpr(node.left)}]' * (${stringifyExpr(node.right)}) + (${stringifyExpr(node.left)}) * [${stringifyExpr(node.right)}]'`,
        explanation: 'Đạo hàm của hàm tích bằng đạo hàm thừa số thứ nhất nhân thừa số thứ hai cộng với thừa số thứ nhất nhân đạo hàm thừa số thứ hai.'
      });
      return {
        type: 'add',
        left: { type: 'mul', left: dl, right: node.right },
        right: { type: 'mul', left: node.left, right: dr }
      };
    }

    case 'div': {
      // General quotient rule: (u / v)' = (u' * v - u * v') / (v^2)
      const dl = diffNode(node.left, steps);
      const dr = diffNode(node.right, steps);
      steps.push({
        title: 'Quy tắc đạo hàm của thương (Quotient Rule)',
        ruleName: 'Thương: [u / v]\' = (u\' * v - u * v\') / v²',
        formula: `[${stringifyExpr(node.left)} / ${stringifyExpr(node.right)}]' = ([${stringifyExpr(node.left)}]' * (${stringifyExpr(node.right)}) - (${stringifyExpr(node.left)}) * [${stringifyExpr(node.right)}]') / (${stringifyExpr(node.right)})²`,
        explanation: 'Đạo hàm của phân thức: Tử đạo hàm nhân mẫu trừ tử nhân mẫu đạo hàm, tất cả chia cho bình phương mẫu.'
      });
      return {
        type: 'div',
        left: {
          type: 'sub',
          left: { type: 'mul', left: dl, right: node.right },
          right: { type: 'mul', left: node.left, right: dr }
        },
        right: { type: 'pow', base: node.right, exp: { type: 'num', val: 2 } }
      };
    }

    case 'pow': {
      // Case x^n where n is constant
      if (node.exp.type === 'num') {
        const n = node.exp.val;
        const du = diffNode(node.base, steps);
        steps.push({
          title: 'Quy tắc lũy thừa hàm hợp',
          ruleName: 'Lũy thừa: [uⁿ]\' = n * uⁿ⁻¹ * u\'',
          formula: `[(${stringifyExpr(node.base)})^${n}]' = ${n} * (${stringifyExpr(node.base)})^${n - 1} * [${stringifyExpr(node.base)}]'`,
          explanation: `Hạ số mũ ${n} xuống làm hệ số, số mũ giảm đi 1 và nhân thêm đạo hàm của biểu thức cơ số theo quy tắc dây chuyền.`
        });
        return {
          type: 'mul',
          left: {
            type: 'mul',
            left: { type: 'num', val: n },
            right: { type: 'pow', base: node.base, exp: { type: 'num', val: n - 1 } }
          },
          right: du
        };
      }
      return { type: 'num', val: 0 };
    }

    case 'func': {
      const du = diffNode(node.arg, steps);
      const uStr = stringifyExpr(node.arg);

      if (node.name === 'sin') {
        steps.push({
          title: 'Đạo hàm hàm lượng giác Sin',
          ruleName: 'Sin: [sin(u)]\' = cos(u) * u\'',
          formula: `[sin(${uStr})]' = cos(${uStr}) * [${uStr}]'`,
          explanation: 'Đạo hàm của sin bằng cos của biểu thức đó nhân với đạo hàm bên trong.'
        });
        return { type: 'mul', left: { type: 'func', name: 'cos', arg: node.arg }, right: du };
      }

      if (node.name === 'cos') {
        steps.push({
          title: 'Đạo hàm hàm lượng giác Cos',
          ruleName: 'Cos: [cos(u)]\' = -sin(u) * u\'',
          formula: `[cos(${uStr})]' = -sin(${uStr}) * [${uStr}]'`,
          explanation: 'Đạo hàm của cos bằng trừ sin nhân với đạo hàm bên trong.'
        });
        return {
          type: 'mul',
          left: { type: 'mul', left: { type: 'num', val: -1 }, right: { type: 'func', name: 'sin', arg: node.arg } },
          right: du
        };
      }

      if (node.name === 'tan') {
        steps.push({
          title: 'Đạo hàm hàm Tang',
          ruleName: 'Tan: [tan(u)]\' = (1 / cos²(u)) * u\'',
          formula: `[tan(${uStr})]' = (1 + tan²(${uStr})) * [${uStr}]'`,
          explanation: 'Đạo hàm của tang bằng 1/cos² nhân với đạo hàm của góc u.'
        });
        return {
          type: 'div',
          left: du,
          right: { type: 'pow', base: { type: 'func', name: 'cos', arg: node.arg }, exp: { type: 'num', val: 2 } }
        };
      }

      if (node.name === 'exp') {
        steps.push({
          title: 'Đạo hàm hàm mũ tự nhiên eᵘ',
          ruleName: 'Mũ e: [exp(u)]\' = exp(u) * u\'',
          formula: `[exp(${uStr})]' = exp(${uStr}) * [${uStr}]'`,
          explanation: 'Đạo hàm của hàm số mũ cơ số e bằng chính nó nhân với đạo hàm của số mũ.'
        });
        return { type: 'mul', left: { type: 'func', name: 'exp', arg: node.arg }, right: du };
      }

      if (node.name === 'ln') {
        steps.push({
          title: 'Đạo hàm logarit tự nhiên ln(u)',
          ruleName: 'Logarit: [ln(u)]\' = (1 / u) * u\'',
          formula: `[ln(${uStr})]' = (1 / ${uStr}) * [${uStr}]'`,
          explanation: 'Đạo hàm của hàm logarit nepe bằng u\' chia cho u.'
        });
        return { type: 'div', left: du, right: node.arg };
      }

      if (node.name === 'sqrt') {
        steps.push({
          title: 'Đạo hàm căn bậc hai √(u)',
          ruleName: 'Căn bậc 2: [√(u)]\' = u\' / (2√(u))',
          formula: `[sqrt(${uStr})]' = [${uStr}]' / (2 * sqrt(${uStr}))`,
          explanation: 'Đạo hàm của căn thức bậc hai bằng đạo hàm bên trong căn chia cho hai lần căn thức.'
        });
        return {
          type: 'div',
          left: du,
          right: { type: 'mul', left: { type: 'num', val: 2 }, right: { type: 'func', name: 'sqrt', arg: node.arg } }
        };
      }

      return { type: 'num', val: 0 };
    }
  }
}

/**
 * Main Function: Calculate Step-by-Step Derivative
 */
export function calculateDerivative(expr: string, evalPointX?: number): DerivativeResult {
  const cleanExpr = expr.trim() || 'x^2';
  const steps: DerivativeStep[] = [];

  const parser = new ExprParser(cleanExpr);
  const ast = parser.parse();

  steps.push({
    title: 'Xác định biểu thức ban đầu f(x)',
    ruleName: 'Khởi tạo',
    formula: `f(x) = ${cleanExpr}`,
    explanation: 'Phân tích cú pháp đại số và cây phân cấp toán học của hàm số.'
  });

  const diffAst = diffNode(ast, steps);
  const simplifiedAst = simplify(diffAst);
  const firstDerivative = stringifyExpr(simplifiedAst);

  steps.push({
    title: 'Rút gọn biểu thức đạo hàm cấp 1',
    ruleName: 'Đơn giản hóa đại số',
    formula: `f'(x) = ${firstDerivative}`,
    explanation: 'Thu gọn các số hạng đồng dạng, triệt tiêu phép nhân với 0 hoặc 1 và đưa về dạng tối giản nhất.'
  });

  // Calculate second derivative
  const dummySteps: DerivativeStep[] = [];
  const secondDiffAst = simplify(diffNode(simplifiedAst, dummySteps));
  const secondDerivative = stringifyExpr(secondDiffAst);

  // Evaluation at x0
  let evalAt: DerivativeResult['evalAt'] | undefined;
  if (typeof evalPointX === 'number' && !isNaN(evalPointX)) {
    const evaluate = (fnStr: string, xVal: number) => {
      try {
        const js = fnStr
          .replace(/\^/g, '**')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/exp\(/g, 'Math.exp(')
          .replace(/ln\(/g, 'Math.log(');
        const fn = new Function('x', `return ${js};`);
        return Number(fn(xVal));
      } catch {
        return NaN;
      }
    };

    const fx0 = evaluate(cleanExpr, evalPointX);
    const fPrimeX0 = evaluate(firstDerivative, evalPointX);
    const fDoublePrimeX0 = evaluate(secondDerivative, evalPointX);

    // Tangent line: y = f'(x0) * (x - x0) + f(x0) = f'(x0)*x + [f(x0) - f'(x0)*x0]
    const slope = fPrimeX0;
    const intercept = fx0 - slope * evalPointX;
    const sign = intercept >= 0 ? '+' : '-';
    const tangentLine = `y = ${slope.toFixed(3)}x ${sign} ${Math.abs(intercept).toFixed(3)}`;

    evalAt = {
      x0: evalPointX,
      fx0,
      fPrimeX0,
      fDoublePrimeX0,
      tangentLine
    };
  }

  return {
    expression: cleanExpr,
    firstDerivative,
    secondDerivative,
    steps,
    evalAt
  };
}
